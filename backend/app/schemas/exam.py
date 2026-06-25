from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.exam import ExamSection, ExamStatus


class ExamReadinessResponse(BaseModel):
    level: str
    overall_readiness: float
    lesen_readiness: float
    horen_readiness: float
    schreiben_readiness: float
    sprechen_readiness: float
    vocabulary_retention: float
    grammar_accuracy: float
    study_consistency: float
    mock_exam_average: float
    predicted_pass_probability: float
    ready_to_take_exam: bool
    estimated_ready_date: Optional[datetime]
    weak_areas: List[str]
    strong_areas: List[str]
    recommendations: List[str]
    calculation_breakdown: Dict[str, Any]

    class Config:
        from_attributes = True


class ExamAttemptCreate(BaseModel):
    mock_exam_id: int


class ExamAnswerSubmit(BaseModel):
    attempt_id: int
    section: ExamSection
    answers: Dict[str, Any]
    time_taken_seconds: int


class WritingSubmit(BaseModel):
    attempt_id: int
    text: str
    task_type: str


class SpeakingSubmit(BaseModel):
    attempt_id: int
    transcript: str
    topic: str
    audio_url: Optional[str] = None


class ExamAttemptResponse(BaseModel):
    id: int
    mock_exam_id: int
    status: ExamStatus
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    total_score: Optional[float]
    passed: Optional[bool]
    lesen_score: Optional[float]
    horen_score: Optional[float]
    schreiben_score: Optional[float]
    sprechen_score: Optional[float]
    ai_feedback: Dict[str, Any]
    xp_earned: int

    class Config:
        from_attributes = True


class MockExamResponse(BaseModel):
    id: int
    title: str
    level: str
    description: Optional[str]
    duration_minutes: int
    is_premium: bool
    passing_score: float
    total_points: int
    tags: List[str]

    class Config:
        from_attributes = True


class GenerateExamRequest(BaseModel):
    level: str = Field(..., pattern="^(A1|A2|B1)$")
    sections: List[str] = ["lesen", "horen", "schreiben", "sprechen"]
    topic: Optional[str] = None
    ai_provider: Optional[str] = None


class WritingFeedbackResponse(BaseModel):
    corrected_text: str
    errors: List[Dict[str, Any]]
    grammar_score: float
    vocabulary_score: float
    structure_score: float
    overall_score: float
    passed: bool
    detailed_feedback: str
    improvement_tips: List[str]


class SpeakingFeedbackResponse(BaseModel):
    transcript: str
    pronunciation_score: float
    fluency_score: float
    grammar_score: float
    vocabulary_score: float
    content_score: float
    overall_score: float
    passed: bool
    feedback: str
    corrections: List[Dict[str, Any]]
    strengths: List[str]
