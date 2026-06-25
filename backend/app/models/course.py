from sqlalchemy import Column, Integer, String, Boolean, Text, JSON, Float, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base, TimestampMixin


class CEFRLevel(str, enum.Enum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"


class Course(Base, TimestampMixin):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True)
    description = Column(Text)
    level = Column(Enum(CEFRLevel), nullable=False)
    thumbnail_url = Column(String(500))
    is_published = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    estimated_hours = Column(Integer, default=0)
    xp_reward = Column(Integer, default=0)
    tags = Column(JSON, default=list)
    meta = Column(JSON, default=dict)

    topics = relationship("Topic", back_populates="course", order_by="Topic.order_index")
    lessons = relationship("Lesson", back_populates="course")


class Topic(Base, TimestampMixin):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    title_german = Column(String(255))
    description = Column(Text)
    level = Column(Enum(CEFRLevel), nullable=False)
    order_index = Column(Integer, default=0)
    icon = Column(String(100))
    color = Column(String(50))
    xp_reward = Column(Integer, default=50)
    is_published = Column(Boolean, default=True)

    course = relationship("Course", back_populates="topics")
    lessons = relationship("Lesson", back_populates="topic")
    vocabulary = relationship("Vocabulary", back_populates="topic")
    grammar_rules = relationship("GrammarRule", back_populates="topic")


class Lesson(Base, TimestampMixin):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    lesson_type = Column(String(50))  # vocabulary, grammar, reading, listening, speaking, writing
    content = Column(JSON, default=dict)
    level = Column(Enum(CEFRLevel), nullable=False)
    order_index = Column(Integer, default=0)
    duration_minutes = Column(Integer, default=15)
    xp_reward = Column(Integer, default=20)
    is_published = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    audio_url = Column(String(500))
    video_url = Column(String(500))
    transcript = Column(Text)
    exercises = Column(JSON, default=list)

    course = relationship("Course", back_populates="lessons")
    topic = relationship("Topic", back_populates="lessons")
