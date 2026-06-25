from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any, AsyncGenerator
from pydantic import BaseModel


class Message(BaseModel):
    role: str  # system, user, assistant
    content: str


class AIResponse(BaseModel):
    content: str
    provider: str
    model: str
    usage: Optional[Dict[str, int]] = None
    metadata: Optional[Dict[str, Any]] = None


class AIProvider(ABC):
    name: str
    model: str

    @abstractmethod
    async def chat(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs,
    ) -> AIResponse:
        pass

    @abstractmethod
    async def stream_chat(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs,
    ) -> AsyncGenerator[str, None]:
        pass

    @abstractmethod
    async def generate_audio(self, text: str, voice: str = "alloy", **kwargs) -> bytes:
        pass

    @abstractmethod
    async def transcribe_audio(self, audio_data: bytes, language: str = "de") -> str:
        pass

    async def correct_german_text(self, text: str, level: str = "A1") -> Dict[str, Any]:
        messages = [
            Message(
                role="system",
                content=f"""You are an expert German language teacher specializing in Goethe Institute examinations.
                Analyze the following German text written by a {level} level student.
                Return a JSON object with:
                - corrected_text: the corrected version
                - errors: list of {{original, correction, explanation, error_type}}
                - grammar_score: 0-100
                - vocabulary_score: 0-100
                - overall_score: 0-100
                - positive_feedback: what they did well
                - improvement_tips: specific tips for improvement""",
            ),
            Message(role="user", content=f"Please correct this German text:\n\n{text}"),
        ]
        response = await self.chat(messages, temperature=0.3)
        return {"raw": response.content, "provider": self.name}

    async def generate_german_exercise(
        self, topic: str, level: str, exercise_type: str, count: int = 5
    ) -> Dict[str, Any]:
        messages = [
            Message(
                role="system",
                content=f"""You are a Goethe Institute certified German language teacher.
                Generate {count} {exercise_type} exercises for {level} level German learners about '{topic}'.
                Return valid JSON with an 'exercises' array. Each exercise must have:
                - question, correct_answer, options (for MCQ), explanation, difficulty""",
            ),
            Message(
                role="user",
                content=f"Generate {count} {exercise_type} exercises about {topic} for {level} learners.",
            ),
        ]
        response = await self.chat(messages, temperature=0.8)
        return {"raw": response.content, "provider": self.name}

    async def evaluate_speaking(self, transcript: str, topic: str, level: str) -> Dict[str, Any]:
        messages = [
            Message(
                role="system",
                content=f"""You are a Goethe Institute speaking examiner.
                Evaluate this spoken German response (transcript) for a {level} level student.
                Topic was: {topic}
                Return JSON with:
                - pronunciation_score: 0-100
                - fluency_score: 0-100
                - grammar_score: 0-100
                - vocabulary_score: 0-100
                - content_score: 0-100
                - overall_score: 0-100
                - passed: boolean (based on {level} requirements)
                - feedback: detailed feedback
                - corrections: list of errors
                - strengths: list of good points""",
            ),
            Message(role="user", content=f"Transcript:\n{transcript}"),
        ]
        response = await self.chat(messages, temperature=0.3)
        return {"raw": response.content, "provider": self.name}
