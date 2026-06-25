from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import Optional

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.content import Story, Podcast

router = APIRouter(prefix="/content", tags=["Content"])


@router.get("/stories")
async def list_stories(
    level: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, le=50),
    db: AsyncSession = Depends(get_db),
):
    query = select(Story).where(Story.is_published == True)
    if level:
        query = query.where(Story.level == level)
    if topic:
        query = query.where(Story.topic == topic)
    query = query.order_by(desc(Story.created_at)).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    stories = result.scalars().all()
    return {
        "stories": [
            {
                "id": s.id,
                "title": s.title,
                "title_english": s.title_english,
                "level": s.level,
                "topic": s.topic,
                "word_count": s.word_count,
                "reading_time_minutes": s.reading_time_minutes,
                "image_url": s.image_url,
                "audio_url": s.audio_url,
                "xp_reward": s.xp_reward,
                "tags": s.tags,
            }
            for s in stories
        ]
    }


@router.get("/stories/{story_id}")
async def get_story(story_id: int, db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(select(Story).where(Story.id == story_id))
    story = result.scalar_one_or_none()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return story


@router.post("/stories/{story_id}/complete")
async def complete_story(
    story_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Story).where(Story.id == story_id))
    story = result.scalar_one_or_none()
    if story:
        current_user.xp_points += story.xp_reward or 30
        await db.commit()
    return {"xp_earned": story.xp_reward if story else 0}


@router.get("/podcasts")
async def list_podcasts(
    level: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, le=50),
    db: AsyncSession = Depends(get_db),
):
    query = select(Podcast).where(Podcast.is_published == True)
    if level:
        query = query.where(Podcast.level == level)
    if topic:
        query = query.where(Podcast.topic == topic)
    query = query.order_by(desc(Podcast.created_at)).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    podcasts = result.scalars().all()
    return {
        "podcasts": [
            {
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "level": p.level,
                "topic": p.topic,
                "audio_url": p.audio_url,
                "duration_seconds": p.duration_seconds,
                "thumbnail_url": p.thumbnail_url,
                "xp_reward": p.xp_reward,
                "tags": p.tags,
            }
            for p in podcasts
        ]
    }


@router.get("/podcasts/{podcast_id}")
async def get_podcast(podcast_id: int, db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(select(Podcast).where(Podcast.id == podcast_id))
    podcast = result.scalar_one_or_none()
    if not podcast:
        raise HTTPException(status_code=404, detail="Podcast not found")
    podcast.plays_count += 1
    await db.commit()
    return podcast
