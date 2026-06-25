from sqlalchemy import Column, Integer, String, Text, JSON, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Flashcard(Base, TimestampMixin):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    vocabulary_id = Column(Integer, ForeignKey("vocabulary.id", ondelete="SET NULL"), nullable=True)
    front_text = Column(String(500), nullable=False)
    back_text = Column(String(500), nullable=False)
    front_image_url = Column(String(500))
    back_image_url = Column(String(500))
    front_audio_url = Column(String(500))
    back_audio_url = Column(String(500))
    card_type = Column(String(50), default="vocabulary")  # vocabulary, phrase, grammar
    level = Column(String(10))
    topic = Column(String(100))
    tags = Column(JSON, default=list)
    hint = Column(Text)
    notes = Column(Text)
    is_public = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    vocabulary = relationship("Vocabulary", back_populates="flashcards")
    progress = relationship("FlashcardProgress", back_populates="flashcard")


class FlashcardProgress(Base, TimestampMixin):
    __tablename__ = "flashcard_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id", ondelete="CASCADE"), nullable=False)

    ease_factor = Column(Float, default=2.5)
    interval_days = Column(Integer, default=1)
    repetitions = Column(Integer, default=0)
    next_review_at = Column(DateTime(timezone=True))
    last_reviewed_at = Column(DateTime(timezone=True))
    quality_rating = Column(Integer)  # 0-5
    status = Column(String(50), default="new")  # new, learning, review, mature

    user = relationship("User", back_populates="flashcard_progress")
    flashcard = relationship("Flashcard", back_populates="progress")


class FlashcardDeck(Base, TimestampMixin):
    __tablename__ = "flashcard_decks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    level = Column(String(10))
    is_public = Column(Boolean, default=False)
    card_ids = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    cover_color = Column(String(50))
