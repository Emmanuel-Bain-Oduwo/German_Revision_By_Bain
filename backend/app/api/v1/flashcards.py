from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timezone, timedelta
from typing import Optional

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.flashcard import Flashcard, FlashcardProgress, FlashcardDeck

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


@router.get("/")
async def list_flashcards(
    level: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    card_type: Optional[str] = Query(None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Flashcard).where(Flashcard.is_public == True)
    if level:
        query = query.where(Flashcard.level == level)
    if topic:
        query = query.where(Flashcard.topic == topic)
    if card_type:
        query = query.where(Flashcard.card_type == card_type)

    count = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count.scalar()

    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    cards = result.scalars().all()

    return {
        "items": [
            {
                "id": c.id,
                "front_text": c.front_text,
                "back_text": c.back_text,
                "front_image_url": c.front_image_url,
                "front_audio_url": c.front_audio_url,
                "card_type": c.card_type,
                "level": c.level,
                "topic": c.topic,
                "hint": c.hint,
            }
            for c in cards
        ],
        "total": total,
        "page": page,
    }


@router.get("/study-session")
async def get_study_session(
    level: Optional[str] = Query(None),
    limit: int = Query(default=20, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)

    due_query = (
        select(FlashcardProgress, Flashcard)
        .join(Flashcard, FlashcardProgress.flashcard_id == Flashcard.id)
        .where(
            FlashcardProgress.user_id == current_user.id,
            FlashcardProgress.next_review_at <= now,
        )
        .order_by(FlashcardProgress.next_review_at)
        .limit(limit)
    )
    if level:
        due_query = due_query.where(Flashcard.level == level)

    due_result = await db.execute(due_query)
    due_cards = due_result.all()

    new_limit = max(0, limit - len(due_cards))
    if new_limit > 0:
        reviewed_ids = [p.flashcard_id for p, _ in due_cards]
        new_query = select(Flashcard).where(
            Flashcard.is_public == True,
            ~Flashcard.id.in_(reviewed_ids) if reviewed_ids else True,
        ).limit(new_limit)
        if level:
            new_query = new_query.where(Flashcard.level == level)
        new_result = await db.execute(new_query)
        new_cards = new_result.scalars().all()
    else:
        new_cards = []

    session_cards = []
    for p, c in due_cards:
        session_cards.append({
            "id": c.id,
            "front_text": c.front_text,
            "back_text": c.back_text,
            "front_image_url": c.front_image_url,
            "front_audio_url": c.front_audio_url,
            "card_type": c.card_type,
            "level": c.level,
            "hint": c.hint,
            "status": p.status,
            "is_new": False,
        })
    for c in new_cards:
        session_cards.append({
            "id": c.id,
            "front_text": c.front_text,
            "back_text": c.back_text,
            "front_image_url": c.front_image_url,
            "front_audio_url": c.front_audio_url,
            "card_type": c.card_type,
            "level": c.level,
            "hint": c.hint,
            "status": "new",
            "is_new": True,
        })

    return {"cards": session_cards, "total_due": len(due_cards), "total_new": len(new_cards)}


@router.post("/{card_id}/review")
async def review_flashcard(
    card_id: int,
    quality: int = Query(..., ge=0, le=5, description="0=blackout, 1=wrong, 2=wrong+easy, 3=hard, 4=good, 5=perfect"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Flashcard).where(Flashcard.id == card_id))
    card = result.scalar_one_or_none()
    if not card:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    progress_result = await db.execute(
        select(FlashcardProgress).where(
            FlashcardProgress.user_id == current_user.id,
            FlashcardProgress.flashcard_id == card_id,
        )
    )
    progress = progress_result.scalar_one_or_none()

    if not progress:
        progress = FlashcardProgress(user_id=current_user.id, flashcard_id=card_id)
        db.add(progress)

    if quality >= 3:
        new_ef = max(1.3, progress.ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        progress.ease_factor = new_ef
        if progress.repetitions == 0:
            progress.interval_days = 1
        elif progress.repetitions == 1:
            progress.interval_days = 6
        else:
            progress.interval_days = round(progress.interval_days * new_ef)
        progress.repetitions += 1
        progress.status = "mature" if progress.interval_days >= 21 else "review"
    else:
        progress.repetitions = 0
        progress.interval_days = 1
        progress.status = "learning"

    progress.quality_rating = quality
    progress.last_reviewed_at = datetime.now(timezone.utc)
    progress.next_review_at = datetime.now(timezone.utc) + timedelta(days=progress.interval_days)

    xp = 5 if quality >= 3 else 2
    current_user.xp_points += xp
    await db.commit()

    return {
        "success": True,
        "next_review_days": progress.interval_days,
        "status": progress.status,
        "xp_earned": xp,
    }


@router.get("/decks")
async def list_decks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(FlashcardDeck).where(
            (FlashcardDeck.user_id == current_user.id) | (FlashcardDeck.is_public == True)
        )
    )
    decks = result.scalars().all()
    return {"decks": decks}
