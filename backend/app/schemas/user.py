from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.user import UserRole, SubscriptionTier


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    target_level: str = "A1"
    native_language: str = "English"


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    target_level: Optional[str] = None
    native_language: Optional[str] = None
    timezone: Optional[str] = None
    preferred_ai_provider: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str]
    target_level: str
    native_language: str
    xp_points: int
    level: int
    streak_days: int
    subscription_tier: SubscriptionTier
    exam_readiness_a1: float
    exam_readiness_a2: float
    exam_readiness_b1: float
    badges: List[Any]
    total_study_minutes: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    id: int
    username: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    level: int
    xp_points: int
    streak_days: int
    target_level: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenRefresh(BaseModel):
    refresh_token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class PasswordReset(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    occupation: Optional[str] = None
    learning_goals: Optional[List[str]] = None
    weekly_study_goal_minutes: Optional[int] = None
    daily_vocabulary_goal: Optional[int] = None
    exam_date: Optional[datetime] = None


class LeaderboardEntry(BaseModel):
    rank: int
    user: UserPublic
    xp_points: int
    streak_days: int
    level: int
    exam_readiness: float
