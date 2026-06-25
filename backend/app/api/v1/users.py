from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from typing import Optional

from app.core.deps import get_db, get_current_user
from app.models.user import User, UserProfile
from app.models.content import UserAnalytics
from app.schemas.user import UserResponse, UserUpdate, ProfileUpdate, LeaderboardEntry, UserPublic

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for field, value in update_data.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.get("/me/dashboard")
async def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.models.exam import ExamAttempt, ExamStatus
    from datetime import datetime, timedelta, timezone

    recent_attempts_result = await db.execute(
        select(ExamAttempt)
        .where(ExamAttempt.user_id == current_user.id)
        .where(ExamAttempt.status == ExamStatus.graded)
        .order_by(desc(ExamAttempt.completed_at))
        .limit(5)
    )
    recent_attempts = recent_attempts_result.scalars().all()

    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    analytics_result = await db.execute(
        select(UserAnalytics)
        .where(UserAnalytics.user_id == current_user.id)
        .where(UserAnalytics.date >= seven_days_ago)
        .order_by(UserAnalytics.date)
    )
    weekly_analytics = analytics_result.scalars().all()

    return {
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "full_name": current_user.full_name,
            "avatar_url": current_user.avatar_url,
            "level": current_user.level,
            "xp_points": current_user.xp_points,
            "streak_days": current_user.streak_days,
            "target_level": current_user.target_level,
            "subscription_tier": current_user.subscription_tier,
            "badges": current_user.badges,
        },
        "exam_readiness": {
            "A1": current_user.exam_readiness_a1,
            "A2": current_user.exam_readiness_a2,
            "B1": current_user.exam_readiness_b1,
        },
        "recent_exam_attempts": [
            {
                "id": a.id,
                "mock_exam_id": a.mock_exam_id,
                "total_score": a.total_score,
                "passed": a.passed,
                "completed_at": a.completed_at,
            }
            for a in recent_attempts
        ],
        "weekly_stats": [
            {
                "date": str(a.date.date()),
                "study_minutes": a.study_minutes,
                "xp_earned": a.xp_earned,
                "vocabulary_reviewed": a.vocabulary_reviewed,
            }
            for a in weekly_analytics
        ],
        "total_study_minutes": current_user.total_study_minutes,
    }


@router.get("/leaderboard", response_model=list[dict])
async def get_leaderboard(
    level: Optional[str] = Query(None),
    limit: int = Query(default=50, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = select(User).where(User.is_active == True).order_by(desc(User.xp_points)).limit(limit)
    if level:
        query = query.where(User.target_level == level)
    result = await db.execute(query)
    users = result.scalars().all()
    return [
        {
            "rank": idx + 1,
            "id": u.id,
            "username": u.username,
            "avatar_url": u.avatar_url,
            "xp_points": u.xp_points,
            "level": u.level,
            "streak_days": u.streak_days,
            "target_level": u.target_level,
        }
        for idx, u in enumerate(users)
    ]


@router.get("/{user_id}", response_model=UserPublic)
async def get_user_public(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id, User.is_active == True))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
