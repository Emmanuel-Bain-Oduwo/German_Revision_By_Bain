from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ChatMessage(BaseModel):
    role: str
    content: str


class TutorChatRequest(BaseModel):
    messages: List[ChatMessage]
    level: str = "A1"
    session_id: Optional[int] = None
    provider: Optional[str] = None
    session_type: str = "tutor"


class TutorChatResponse(BaseModel):
    message: str
    provider: str
    session_id: int
    grammar_corrections: List[Dict[str, Any]] = []
    vocabulary_suggestions: List[Dict[str, Any]] = []
    xp_earned: int = 0


class GenerateVocabularyRequest(BaseModel):
    topic: str
    level: str = Field(..., pattern="^(A1|A2|B1|B2|C1|C2)$")
    count: int = Field(default=10, ge=1, le=50)
    provider: Optional[str] = None


class VocabularyItem(BaseModel):
    german_word: str
    article: Optional[str]
    english_translation: str
    example_sentence_de: str
    example_sentence_en: str
    word_type: str
    level: str


class GenerateVocabularyResponse(BaseModel):
    vocabulary: List[VocabularyItem]
    topic: str
    level: str
    provider: str


class GenerateStoryRequest(BaseModel):
    topic: str
    level: str = Field(..., pattern="^(A1|A2|B1)$")
    word_count: int = Field(default=300, ge=100, le=1000)
    include_questions: bool = True
    provider: Optional[str] = None


class GeneratePodcastRequest(BaseModel):
    topic: str
    level: str = Field(..., pattern="^(A1|A2|B1)$")
    duration_minutes: int = Field(default=5, ge=2, le=15)
    provider: Optional[str] = None


class TextToSpeechRequest(BaseModel):
    text: str = Field(..., max_length=5000)
    voice: str = "alloy"
    language: str = "de"
    speed: float = Field(default=1.0, ge=0.5, le=2.0)


class GrammarCorrectRequest(BaseModel):
    text: str = Field(..., max_length=5000)
    level: str = "A1"
    provider: Optional[str] = None


class ExerciseGenerateRequest(BaseModel):
    topic: str
    level: str = Field(..., pattern="^(A1|A2|B1)$")
    exercise_type: str  # mcq, fill_blank, matching, true_false, sentence_order
    count: int = Field(default=5, ge=1, le=20)
    provider: Optional[str] = None


class ImageDescriptionRequest(BaseModel):
    image_url: str
    level: str = "A1"
    user_description: str
    topic: Optional[str] = None


class ExamReadinessCalculateRequest(BaseModel):
    target_level: str = Field(..., pattern="^(A1|A2|B1)$")
