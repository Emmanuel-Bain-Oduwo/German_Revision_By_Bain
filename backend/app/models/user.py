from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, JSON, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.db.base import Base, TimestampMixin


class UserRole(str, enum.Enum):
    student = "student"
    teacher = "teacher"
    admin = "admin"


class SubscriptionTier(str, enum.Enum):
    free = "free"
    basic = "basic"
    pro = "pro"
    enterprise = "enterprise"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    avatar_url = Column(String(500))
    role = Column(Enum(UserRole), default=UserRole.student, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.free)
    subscription_expires_at = Column(DateTime(timezone=True))
    stripe_customer_id = Column(String(255))

    target_level = Column(String(10), default="A1")
    native_language = Column(String(50), default="English")
    timezone = Column(String(50), default="UTC")
    preferred_ai_provider = Column(String(50), default="openai")

    xp_points = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)
    streak_days = Column(Integer, default=0, nullable=False)
    last_activity_date = Column(DateTime(timezone=True))
    total_study_minutes = Column(Integer, default=0)

    exam_readiness_a1 = Column(Float, default=0.0)
    exam_readiness_a2 = Column(Float, default=0.0)
    exam_readiness_b1 = Column(Float, default=0.0)

    badges = Column(JSON, default=list)
    achievements = Column(JSON, default=list)
    preferences = Column(JSON, default=dict)

    last_login = Column(DateTime(timezone=True))
    login_count = Column(Integer, default=0)

    profiles = relationship("UserProfile", back_populates="user", uselist=False)
    exam_attempts = relationship("ExamAttempt", back_populates="user")
    flashcard_progress = relationship("FlashcardProgress", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user")
    vocabulary_progress = relationship("VocabularyProgress", back_populates="user")
    analytics = relationship("UserAnalytics", back_populates="user")


class UserProfile(Base, TimestampMixin):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    bio = Column(Text)
    country = Column(String(100))
    city = Column(String(100))
    phone = Column(String(50))
    date_of_birth = Column(DateTime)
    occupation = Column(String(200))
    learning_goals = Column(JSON, default=list)
    weekly_study_goal_minutes = Column(Integer, default=300)
    daily_vocabulary_goal = Column(Integer, default=10)
    exam_date = Column(DateTime)
    social_links = Column(JSON, default=dict)

    user = relationship("User", back_populates="profiles")
