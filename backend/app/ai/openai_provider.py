from typing import List, Dict, Any, AsyncGenerator
from openai import AsyncOpenAI
from app.ai.base import AIProvider, AIResponse, Message
from app.core.config import settings


class OpenAIProvider(AIProvider):
    name = "openai"

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL

    async def chat(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs,
    ) -> AIResponse:
        formatted = [{"role": m.role, "content": m.content} for m in messages]
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=formatted,
            temperature=temperature,
            max_tokens=max_tokens,
            **kwargs,
        )
        usage = None
        if response.usage:
            usage = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            }
        return AIResponse(
            content=response.choices[0].message.content,
            provider=self.name,
            model=self.model,
            usage=usage,
        )

    async def stream_chat(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs,
    ) -> AsyncGenerator[str, None]:
        formatted = [{"role": m.role, "content": m.content} for m in messages]
        stream = await self.client.chat.completions.create(
            model=self.model,
            messages=formatted,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
            **kwargs,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def generate_audio(self, text: str, voice: str = "alloy", **kwargs) -> bytes:
        response = await self.client.audio.speech.create(
            model="tts-1-hd",
            voice=voice,
            input=text,
            **kwargs,
        )
        return response.content

    async def transcribe_audio(self, audio_data: bytes, language: str = "de") -> str:
        import io
        audio_file = io.BytesIO(audio_data)
        audio_file.name = "audio.webm"
        response = await self.client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language=language,
        )
        return response.text

    async def generate_image(self, prompt: str, size: str = "1024x1024") -> str:
        response = await self.client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size=size,
            quality="standard",
            n=1,
        )
        return response.data[0].url
