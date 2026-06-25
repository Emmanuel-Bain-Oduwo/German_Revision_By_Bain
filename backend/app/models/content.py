from sqlalchemy import Column, Integer, String, Text, JSON, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Story(Base, TimestampMixin):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_english = Column(String(255))
    content = Column(Text, nullable=False)
    content_english = Column(Text)
    level = Column(String(10), nullable=False)
    topic = Column(String(100))
    word_count = Column(Integer)
    reading_time_minutes = Column(Integer)
    audio_url = Column(String(500))
    image_url = Column(String(500))
    vocabulary_list = Column(JSON, default=list)
    comprehension_questions = Column(JSON, default=list)
    is_interactive = Column(Boolean, default=False)
    interaction_points = Column(JSON, default=list)
    is_published = Column(Boolean, default=True)
    is_ai_generated = Column(Boolean, default=True)
    xp_reward = Column(Integer, default=30)
    tags = Column(JSON, default=list)
    likes_count = Column(Integer, default=0)


class Podcast(Base, TimestampMixin):
    __tablename__ = "podcasts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    topic = Column(String(100))
    level = Column(String(10), nullable=False)
    audio_url = Column(String(500), nullable=False)
    transcript = Column(Text)
    duration_seconds = Column(Integer)
    thumbnail_url = Column(String(500))
    is_published = Column(Boolean, default=True)
    is_ai_generated = Column(Boolean, default=True)
    hosts = Column(JSON, default=list)
    chapters = Column(JSON, default=list)
    vocabulary_highlighted = Column(JSON, default=list)
    comprehension_questions = Column(JSON, default=list)
    xp_reward = Column(Integer, default=25)
    plays_count = Column(Integer, default=0)
    tags = Column(JSON, default=list)


class ChatSession(Base, TimestampMixin):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_type = Column(String(50))  # tutor, conversation, writing_help, exam_prep
    level = Column(String(10))
    ai_provider = Column(String(50), default="openai")
    messages = Column(JSON, default=list)
    total_messages = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    title = Column(String(255))
    summary = Column(Text)
    xp_earned = Column(Integer, default=0)
    grammar_corrections = Column(JSON, default=list)
    vocabulary_used = Column(JSON, default=list)

    user = relationship("User", back_populates="chat_sessions")


class AudioFile(Base, TimestampMixin):
    __tablename__ = "audio_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer)
    duration_seconds = Column(Float)
    language = Column(String(10), default="de")
    text_content = Column(Text)
    voice_id = Column(String(100))
    ai_provider = Column(String(50))
    purpose = Column(String(100))  # vocabulary, story, podcast, exam, speaking_prompt
    reference_id = Column(Integer)
    reference_type = Column(String(50))
    transcription = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)


class ImageContent(Base, TimestampMixin):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    prompt = Column(Text)
    alt_text = Column(String(500))
    topic = Column(String(100))
    level = Column(String(10))
    ai_provider = Column(String(50))
    purpose = Column(String(100))  # flashcard, story, exercise, speaking_prompt
    reference_id = Column(Integer)
    reference_type = Column(String(50))
    file_size_bytes = Column(Integer)
    width = Column(Integer)
    height = Column(Integer)


class UserAnalytics(Base, TimestampMixin):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(DateTime(timezone=True), nullable=False)
    study_minutes = Column(Integer, default=0)
    xp_earned = Column(Integer, default=0)
    vocabulary_reviewed = Column(Integer, default=0)
    vocabulary_mastered = Column(Integer, default=0)
    lessons_completed = Column(Integer, default=0)
    exercises_completed = Column(Integer, default=0)
    exam_attempts = Column(Integer, default=0)
    ai_conversations = Column(Integer, default=0)
    speaking_sessions = Column(Integer, default=0)
    listening_sessions = Column(Integer, default=0)
    stories_read = Column(Integer, default=0)
    podcasts_listened = Column(Integer, default=0)
    average_accuracy = Column(Float, default=0.0)
    streak_maintained = Column(Boolean, default=False)
    section_breakdown = Column(JSON, default=dict)

    user = relationship("User", back_populates="analytics")


class Subscription(Base, TimestampMixin):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stripe_subscription_id = Column(String(255), unique=True)
    stripe_price_id = Column(String(255))
    tier = Column(String(50), nullable=False)
    status = Column(String(50))  # active, canceled, past_due, trialing
    current_period_start = Column(DateTime(timezone=True))
    current_period_end = Column(DateTime(timezone=True))
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime(timezone=True))
    trial_end = Column(DateTime(timezone=True))
    metadata = Column(JSON, default=dict)
