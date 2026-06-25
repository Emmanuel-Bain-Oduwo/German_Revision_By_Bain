from typing import List, Dict, Any, AsyncGenerator
from openai import AsyncOpenAI
from app.ai.base import AIProvider, AIResponse, Message
from app.core.config import settings


class DeepSeekProvider(AIProvider):
    name = "deepseek"

    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.DEEPSEEK_API_KEY,
            base_url=settings.DEEPSEEK_BASE_URL,
        )
        self.model = settings.DEEPSEEK_MODEL

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
        )
        return AIResponse(
            content=response.choices[0].message.content,
            provider=self.name,
            model=self.model,
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
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def generate_audio(self, text: str, voice: str = "alloy", **kwargs) -> bytes:
        raise NotImplementedError("DeepSeek does not support audio generation")

    async def transcribe_audio(self, audio_data: bytes, language: str = "de") -> str:
        raise NotImplementedError("DeepSeek does not support audio transcription")
