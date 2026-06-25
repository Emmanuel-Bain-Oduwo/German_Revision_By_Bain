from typing import Dict, Optional
from app.ai.base import AIProvider
from app.core.config import settings


_providers: Dict[str, AIProvider] = {}


def get_ai_provider(provider_name: Optional[str] = None) -> AIProvider:
    name = provider_name or settings.DEFAULT_AI_PROVIDER

    if name in _providers:
        return _providers[name]

    if name == "openai":
        from app.ai.openai_provider import OpenAIProvider
        provider = OpenAIProvider()
    elif name == "deepseek":
        from app.ai.deepseek_provider import DeepSeekProvider
        provider = DeepSeekProvider()
    elif name == "gemini":
        from app.ai.gemini_provider import GeminiProvider
        provider = GeminiProvider()
    else:
        from app.ai.openai_provider import OpenAIProvider
        provider = OpenAIProvider()

    _providers[name] = provider
    return provider


def get_audio_provider() -> AIProvider:
    return get_ai_provider("openai")
