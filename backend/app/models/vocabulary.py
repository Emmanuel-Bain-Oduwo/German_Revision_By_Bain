from sqlalchemy import Column, Integer, String, Text, JSON, Float, Boolean, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.db.base import Base, TimestampMixin


class WordType(str, enum.Enum):
    noun = "noun"
    verb = "verb"
    adjective = "adjective"
    adverb = "adverb"
    preposition = "preposition"
    conjunction = "conjunction"
    pronoun = "pronoun"
    article = "article"
    phrase = "phrase"


class Vocabulary(Base, TimestampMixin):
    __tablename__ = "vocabulary"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="SET NULL"), nullable=True)
    german_word = Column(String(255), nullable=False, index=True)
    english_translation = Column(String(255), nullable=False)
    plural_form = Column(String(255))
    article = Column(String(10))  # der/die/das
    word_type = Column(Enum(WordType))
    level = Column(String(10), nullable=False)
    example_sentence_de = Column(Text)
    example_sentence_en = Column(Text)
    audio_url = Column(String(500))
    image_url = Column(String(500))
    ipa_pronunciation = Column(String(255))
    conjugations = Column(JSON, default=dict)
    synonyms = Column(JSON, default=list)
    antonyms = Column(JSON, default=list)
    word_family = Column(JSON, default=list)
    frequency_rank = Column(Integer)
    is_active = Column(Boolean, default=True)

    topic = relationship("Topic", back_populates="vocabulary")
    flashcards = relationship("Flashcard", back_populates="vocabulary")
    progress = relationship("VocabularyProgress", back_populates="vocabulary")


class VocabularyProgress(Base, TimestampMixin):
    __tablename__ = "vocabulary_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    vocabulary_id = Column(Integer, ForeignKey("vocabulary.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="new")  # new, learning, reviewing, mastered
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    ease_factor = Column(Float, default=2.5)
    interval_days = Column(Integer, default=1)
    next_review_at = Column(DateTime(timezone=True))
    last_reviewed_at = Column(DateTime(timezone=True))
    retention_score = Column(Float, default=0.0)

    user = relationship("User", back_populates="vocabulary_progress")
    vocabulary = relationship("Vocabulary", back_populates="progress")


class GrammarRule(Base, TimestampMixin):
    __tablename__ = "grammar_rules"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    level = Column(String(10), nullable=False)
    category = Column(String(100))  # cases, tenses, word_order, etc.
    explanation = Column(Text, nullable=False)
    explanation_simple = Column(Text)
    formula = Column(Text)
    examples = Column(JSON, default=list)
    exceptions = Column(JSON, default=list)
    exercises = Column(JSON, default=list)
    tips = Column(JSON, default=list)
    related_rules = Column(JSON, default=list)
    order_index = Column(Integer, default=0)

    topic = relationship("Topic", back_populates="grammar_rules")
