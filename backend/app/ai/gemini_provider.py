from typing import List, Dict, Any, AsyncGenerator
import google.generativeai as genai
from app.ai.base import AIProvider, AIResponse, Message
from app.core.config import settings


class GeminiProvider(AIProvider):
    name = "gemini"

    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model_name = settings.GEMINI_MODEL
        self.model = genai.GenerativeModel(self.model_name)

    def _format_messages(self, messages: List[Message]) -> tuple[str, list]:
        system_msg = None
        history = []
        user_message = ""
        for msg in messages:
            if msg.role == "system":
                system_msg = msg.content
            elif msg.role == "user":
                user_message = msg.content
                if history and history[-1]["role"] == "model":
                    history.append({"role": "user", "parts": [msg.content]})
                elif not history:
                    if system_msg:
                        combined = f"{system_msg}\n\n{msg.content}"
                        history.append({"role": "user", "parts": [combined]})
                    else:
                        history.append({"role": "user", "parts": [msg.content]})
            elif msg.role == "assistant":
                history.append({"role": "model", "parts": [msg.content]})
        return user_message, history

    async def chat(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs,
    ) -> AIResponse:
        user_message, history = self._format_messages(messages)
        chat = self.model.start_chat(history=history[:-1] if history else [])
        last_user = history[-1]["parts"][0] if history else user_message
        response = await chat.send_message_async(
            last_user,
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            ),
        )
        return AIResponse(
            content=response.text,
            provider=self.name,
            model=self.model_name,
        )

    async def stream_chat(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs,
    ) -> AsyncGenerator[str, None]:
        user_message, history = self._format_messages(messages)
        chat = self.model.start_chat(history=history[:-1] if history else [])
        last_user = history[-1]["parts"][0] if history else user_message
        response = await chat.send_message_async(
            last_user,
            stream=True,
            generation_config=genai.types.GenerationConfig(temperature=temperature),
        )
        async for chunk in response:
            yield chunk.text

    async def generate_audio(self, text: str, voice: str = "alloy", **kwargs) -> bytes:
        raise NotImplementedError("Use OpenAI for audio generation")

    async def transcribe_audio(self, audio_data: bytes, language: str = "de") -> str:
        raise NotImplementedError("Use OpenAI for audio transcription")
