from sqlalchemy import Column, Integer, String, Text, JSON, Float, Boolean, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.db.base import Base, TimestampMixin


class ExamSection(str, enum.Enum):
    lesen = "lesen"
    horen = "horen"
    schreiben = "schreiben"
    sprechen = "sprechen"


class ExamStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"
    graded = "graded"


class MockExam(Base, TimestampMixin):
    __tablename__ = "mock_exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    level = Column(String(10), nullable=False)
    description = Column(Text)
    duration_minutes = Column(Integer, default=90)
    is_published = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    passing_score = Column(Float, default=60.0)
    total_points = Column(Integer, default=100)
    instructions = Column(JSON, default=dict)
    sections_config = Column(JSON, default=dict)
    version = Column(Integer, default=1)
    tags = Column(JSON, default=list)

    sections = relationship("ExamSectionContent", back_populates="mock_exam")
    attempts = relationship("ExamAttempt", back_populates="mock_exam")


class ExamSectionContent(Base, TimestampMixin):
    __tablename__ = "exam_sections"

    id = Column(Integer, primary_key=True, index=True)
    mock_exam_id = Column(Integer, ForeignKey("mock_exams.id", ondelete="CASCADE"))
    section_type = Column(Enum(ExamSection), nullable=False)
    title = Column(String(255))
    instructions = Column(Text)
    content = Column(JSON, default=dict)
    questions = Column(JSON, default=list)
    audio_url = Column(String(500))
    image_urls = Column(JSON, default=list)
    duration_minutes = Column(Integer, default=20)
    max_points = Column(Integer, default=25)
    order_index = Column(Integer, default=0)
    ai_generated = Column(Boolean, default=False)
    generation_prompt = Column(Text)

    mock_exam = relationship("MockExam", back_populates="sections")


class ExamAttempt(Base, TimestampMixin):
    __tablename__ = "exam_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    mock_exam_id = Column(Integer, ForeignKey("mock_exams.id", ondelete="CASCADE"))
    status = Column(Enum(ExamStatus), default=ExamStatus.not_started)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    time_taken_minutes = Column(Integer)

    lesen_score = Column(Float)
    horen_score = Column(Float)
    schreiben_score = Column(Float)
    sprechen_score = Column(Float)
    total_score = Column(Float)
    passing_score = Column(Float)
    passed = Column(Boolean)

    answers = Column(JSON, default=dict)
    ai_feedback = Column(JSON, default=dict)
    section_results = Column(JSON, default=dict)
    writing_submission = Column(Text)
    speaking_audio_url = Column(String(500))
    speaking_transcript = Column(Text)

    pronunciation_score = Column(Float)
    fluency_score = Column(Float)
    grammar_score = Column(Float)
    vocabulary_score = Column(Float)

    exam_readiness_impact = Column(Float, default=0.0)
    xp_earned = Column(Integer, default=0)

    user = relationship("User", back_populates="exam_attempts")
    mock_exam = relationship("MockExam", back_populates="attempts")


class ExamReadinessScore(Base, TimestampMixin):
    __tablename__ = "exam_readiness_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    level = Column(String(10), nullable=False)

    overall_readiness = Column(Float, default=0.0)
    lesen_readiness = Column(Float, default=0.0)
    horen_readiness = Column(Float, default=0.0)
    schreiben_readiness = Column(Float, default=0.0)
    sprechen_readiness = Column(Float, default=0.0)

    vocabulary_retention = Column(Float, default=0.0)
    grammar_accuracy = Column(Float, default=0.0)
    study_consistency = Column(Float, default=0.0)
    mock_exam_average = Column(Float, default=0.0)

    weak_areas = Column(JSON, default=list)
    strong_areas = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    predicted_pass_probability = Column(Float, default=0.0)
    ready_to_take_exam = Column(Boolean, default=False)
    estimated_ready_date = Column(DateTime(timezone=True))

    calculation_breakdown = Column(JSON, default=dict)
    last_calculated_at = Column(DateTime(timezone=True))
