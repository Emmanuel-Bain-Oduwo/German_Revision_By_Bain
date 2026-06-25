from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import Optional, List
from datetime import datetime, timezone, timedelta

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.vocabulary import Vocabulary, VocabularyProgress, GrammarRule

router = APIRouter(prefix="/vocabulary", tags=["Vocabulary"])


@router.get("/")
async def list_vocabulary(
    level: Optional[str] = Query(None),
    topic_id: Optional[int] = Query(None),
    word_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(Vocabulary).where(Vocabulary.is_active == True)
    if level:
        query = query.where(Vocabulary.level == level)
    if topic_id:
        query = query.where(Vocabulary.topic_id == topic_id)
    if word_type:
        query = query.where(Vocabulary.word_type == word_type)
    if search:
        query = query.where(
            Vocabulary.german_word.ilike(f"%{search}%") |
            Vocabulary.english_translation.ilike(f"%{search}%")
        )

    count_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = count_result.scalar()

    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    words = result.scalars().all()

    return {
        "items": [
            {
                "id": w.id,
                "german_word": w.german_word,
                "article": w.article,
                "english_translation": w.english_translation,
                "word_type": w.word_type,
                "level": w.level,
                "example_sentence_de": w.example_sentence_de,
                "example_sentence_en": w.example_sentence_en,
                "audio_url": w.audio_url,
                "image_url": w.image_url,
                "ipa_pronunciation": w.ipa_pronunciation,
            }
            for w in words
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
    }


@router.get("/{vocab_id}")
async def get_vocabulary_detail(vocab_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vocabulary).where(Vocabulary.id == vocab_id))
    vocab = result.scalar_one_or_none()
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    return vocab


@router.get("/me/progress")
async def get_my_vocabulary_progress(
    level: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(VocabularyProgress, Vocabulary)
        .join(Vocabulary, VocabularyProgress.vocabulary_id == Vocabulary.id)
        .where(VocabularyProgress.user_id == current_user.id)
    )
    if level:
        query = query.where(Vocabulary.level == level)
    if status:
        query = query.where(VocabularyProgress.status == status)

    result = await db.execute(query)
    rows = result.all()

    return {
        "progress": [
            {
                "vocabulary_id": p.vocabulary_id,
                "german_word": v.german_word,
                "english_translation": v.english_translation,
                "status": p.status,
                "correct_count": p.correct_count,
                "incorrect_count": p.incorrect_count,
                "retention_score": p.retention_score,
                "next_review_at": p.next_review_at,
            }
            for p, v in rows
        ]
    }


@router.get("/me/due-for-review")
async def get_due_for_review(
    limit: int = Query(default=20, le=50),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    query = (
        select(VocabularyProgress, Vocabulary)
        .join(Vocabulary, VocabularyProgress.vocabulary_id == Vocabulary.id)
        .where(
            VocabularyProgress.user_id == current_user.id,
            VocabularyProgress.next_review_at <= now,
            VocabularyProgress.status != "mastered",
        )
        .order_by(VocabularyProgress.next_review_at)
        .limit(limit)
    )
    result = await db.execute(query)
    rows = result.all()
    return {"due_cards": len(rows), "cards": [{"progress": p.__dict__, "vocabulary": v.__dict__} for p, v in rows]}


@router.post("/{vocab_id}/review")
async def record_vocabulary_review(
    vocab_id: int,
    quality: int = Query(..., ge=0, le=5),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(VocabularyProgress).where(
            VocabularyProgress.user_id == current_user.id,
            VocabularyProgress.vocabulary_id == vocab_id,
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        progress = VocabularyProgress(user_id=current_user.id, vocabulary_id=vocab_id)
        db.add(progress)

    if quality >= 3:
        progress.correct_count += 1
        new_ef = max(1.3, progress.ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        progress.ease_factor = new_ef

        if progress.repetitions == 0:
            progress.interval_days = 1
        elif progress.repetitions == 1:
            progress.interval_days = 6
        else:
            progress.interval_days = round(progress.interval_days * progress.ease_factor)

        progress.repetitions += 1
        progress.status = "mature" if progress.interval_days >= 21 else "review"
    else:
        progress.incorrect_count += 1
        progress.repetitions = 0
        progress.interval_days = 1
        progress.status = "learning"

    total = progress.correct_count + progress.incorrect_count
    progress.retention_score = progress.correct_count / total * 100 if total > 0 else 0
    progress.last_reviewed_at = datetime.now(timezone.utc)
    progress.next_review_at = datetime.now(timezone.utc) + timedelta(days=progress.interval_days)

    if quality >= 3:
        current_user.xp_points += 5

    await db.commit()
    return {"success": True, "next_review_days": progress.interval_days, "retention_score": progress.retention_score}


@router.get("/grammar/rules")
async def list_grammar_rules(
    level: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(GrammarRule)
    if level:
        query = query.where(GrammarRule.level == level)
    if category:
        query = query.where(GrammarRule.category == category)
    query = query.order_by(GrammarRule.order_index)
    result = await db.execute(query)
    rules = result.scalars().all()
    return {"rules": [{"id": r.id, "title": r.title, "level": r.level, "category": r.category, "explanation": r.explanation, "examples": r.examples} for r in rules]}
