from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.course import Course, Topic, Lesson, CEFRLevel

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("/")
async def list_courses(
    level: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Course).where(Course.is_published == True)
    if level:
        query = query.where(Course.level == level)
    query = query.order_by(Course.order_index)
    result = await db.execute(query)
    courses = result.scalars().all()
    return {
        "courses": [
            {
                "id": c.id,
                "title": c.title,
                "slug": c.slug,
                "description": c.description,
                "level": c.level,
                "thumbnail_url": c.thumbnail_url,
                "is_premium": c.is_premium,
                "total_lessons": c.total_lessons,
                "estimated_hours": c.estimated_hours,
                "xp_reward": c.xp_reward,
                "tags": c.tags,
            }
            for c in courses
        ]
    }


@router.get("/{course_id}")
async def get_course_detail(course_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    topics_result = await db.execute(
        select(Topic).where(Topic.course_id == course_id, Topic.is_published == True).order_by(Topic.order_index)
    )
    topics = topics_result.scalars().all()
    return {"course": course, "topics": topics}


@router.get("/{course_id}/topics/{topic_id}")
async def get_topic_detail(course_id: int, topic_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Topic).where(Topic.id == topic_id, Topic.course_id == course_id)
    )
    topic = result.scalar_one_or_none()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    lessons_result = await db.execute(
        select(Lesson).where(Lesson.topic_id == topic_id, Lesson.is_published == True).order_by(Lesson.order_index)
    )
    lessons = lessons_result.scalars().all()
    return {"topic": topic, "lessons": lessons}


@router.get("/topics/all")
async def list_all_topics(
    level: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Topic).where(Topic.is_published == True)
    if level:
        query = query.where(Topic.level == level)
    query = query.order_by(Topic.order_index)
    result = await db.execute(query)
    topics = result.scalars().all()
    return {"topics": topics}


@router.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
