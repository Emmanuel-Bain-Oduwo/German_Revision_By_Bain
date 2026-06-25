from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import Optional, List
from datetime import datetime, timezone
import json

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.exam import MockExam, ExamAttempt, ExamStatus, ExamReadinessScore, ExamSectionContent
from app.schemas.exam import (
    ExamAttemptCreate, ExamAnswerSubmit, WritingSubmit, SpeakingSubmit,
    ExamAttemptResponse, MockExamResponse, GenerateExamRequest,
    WritingFeedbackResponse, SpeakingFeedbackResponse, ExamReadinessResponse,
)
from app.ai.factory import get_ai_provider
from app.ai.base import Message

router = APIRouter(prefix="/exams", tags=["Exams"])


@router.get("/mock", response_model=List[MockExamResponse])
async def list_mock_exams(
    level: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(MockExam).where(MockExam.is_published == True)
    if level:
        query = query.where(MockExam.level == level)
    result = await db.execute(query.order_by(MockExam.id))
    exams = result.scalars().all()
    return exams


@router.get("/mock/{exam_id}")
async def get_mock_exam(exam_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MockExam).where(MockExam.id == exam_id))
    exam = result.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    sections_result = await db.execute(
        select(ExamSectionContent)
        .where(ExamSectionContent.mock_exam_id == exam_id)
        .order_by(ExamSectionContent.order_index)
    )
    sections = sections_result.scalars().all()
    return {
        "exam": exam,
        "sections": sections,
    }


@router.post("/mock/generate")
async def generate_mock_exam(
    request: GenerateExamRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    provider = get_ai_provider(request.ai_provider or current_user.preferred_ai_provider)

    exam_content = {}
    for section in request.sections:
        messages = [
            Message(
                role="system",
                content=f"""You are a Goethe Institute exam specialist. Generate a complete {request.level} level
                {section} exam section in JSON format with proper exam questions.
                For 'lesen': Generate a reading passage with MCQ, matching, and true/false questions.
                For 'horen': Generate a dialogue script + comprehension questions.
                For 'schreiben': Generate a writing task prompt (email/letter/essay).
                For 'sprechen': Generate speaking prompts and picture description tasks.
                Return valid JSON only.""",
            ),
            Message(
                role="user",
                content=f"Generate a Goethe {request.level} {section} exam section{f' about {request.topic}' if request.topic else ''}.",
            ),
        ]
        response = await provider.chat(messages, temperature=0.8)
        exam_content[section] = response.content

    mock_exam = MockExam(
        title=f"AI-Generated {request.level} Mock Exam",
        level=request.level,
        description=f"AI-generated practice exam for Goethe {request.level}",
        is_published=True,
        is_premium=False,
        ai_generated=True if hasattr(MockExam, 'ai_generated') else None,
    )
    db.add(mock_exam)
    await db.flush()

    for idx, section_type in enumerate(request.sections):
        section_content = ExamSectionContent(
            mock_exam_id=mock_exam.id,
            section_type=section_type,
            title=f"{section_type.title()} Section",
            content={"raw": exam_content.get(section_type, "")},
            order_index=idx,
            ai_generated=True,
        )
        db.add(section_content)

    await db.commit()
    return {"exam_id": mock_exam.id, "message": "Mock exam generated successfully"}


@router.post("/attempts", response_model=ExamAttemptResponse)
async def start_exam_attempt(
    attempt_data: ExamAttemptCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(MockExam).where(MockExam.id == attempt_data.mock_exam_id))
    exam = result.scalar_one_or_none()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")

    attempt = ExamAttempt(
        user_id=current_user.id,
        mock_exam_id=attempt_data.mock_exam_id,
        status=ExamStatus.in_progress,
        started_at=datetime.now(timezone.utc),
        passing_score=exam.passing_score,
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)
    return attempt


@router.post("/attempts/{attempt_id}/submit-writing", response_model=WritingFeedbackResponse)
async def submit_writing(
    attempt_id: int,
    submission: WritingSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ExamAttempt).where(
            ExamAttempt.id == attempt_id,
            ExamAttempt.user_id == current_user.id,
        )
    )
    attempt = result.scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    provider = get_ai_provider(current_user.preferred_ai_provider)
    messages = [
        Message(
            role="system",
            content=f"""You are a Goethe Institute writing examiner for {current_user.target_level} level.
            Evaluate this writing submission and return JSON with these exact keys:
            corrected_text, errors (list with original/correction/explanation/error_type),
            grammar_score (0-100), vocabulary_score (0-100), structure_score (0-100),
            overall_score (0-100), passed (boolean), detailed_feedback (string),
            improvement_tips (list of strings)""",
        ),
        Message(
            role="user",
            content=f"Task type: {submission.task_type}\n\nStudent submission:\n{submission.text}",
        ),
    ]
    response = await provider.chat(messages, temperature=0.3)

    try:
        feedback_data = json.loads(response.content)
    except json.JSONDecodeError:
        feedback_data = {
            "corrected_text": submission.text,
            "errors": [],
            "grammar_score": 70.0,
            "vocabulary_score": 70.0,
            "structure_score": 70.0,
            "overall_score": 70.0,
            "passed": True,
            "detailed_feedback": response.content,
            "improvement_tips": [],
        }

    attempt.writing_submission = submission.text
    attempt.schreiben_score = feedback_data.get("overall_score", 0)
    if not attempt.ai_feedback:
        attempt.ai_feedback = {}
    attempt.ai_feedback["schreiben"] = feedback_data
    await db.commit()

    return WritingFeedbackResponse(**feedback_data)


@router.post("/attempts/{attempt_id}/submit-speaking", response_model=SpeakingFeedbackResponse)
async def submit_speaking(
    attempt_id: int,
    submission: SpeakingSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ExamAttempt).where(
            ExamAttempt.id == attempt_id,
            ExamAttempt.user_id == current_user.id,
        )
    )
    attempt = result.scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    provider = get_ai_provider(current_user.preferred_ai_provider)
    feedback_raw = await provider.evaluate_speaking(
        submission.transcript, submission.topic, current_user.target_level
    )

    try:
        feedback_data = json.loads(feedback_raw["raw"])
    except (json.JSONDecodeError, KeyError):
        feedback_data = {
            "transcript": submission.transcript,
            "pronunciation_score": 70.0,
            "fluency_score": 70.0,
            "grammar_score": 70.0,
            "vocabulary_score": 70.0,
            "content_score": 70.0,
            "overall_score": 70.0,
            "passed": True,
            "feedback": "Good effort! Keep practicing.",
            "corrections": [],
            "strengths": ["Communication attempt"],
        }

    attempt.speaking_transcript = submission.transcript
    attempt.sprechen_score = feedback_data.get("overall_score", 0)
    if not attempt.ai_feedback:
        attempt.ai_feedback = {}
    attempt.ai_feedback["sprechen"] = feedback_data
    await db.commit()

    return SpeakingFeedbackResponse(**feedback_data)


@router.post("/attempts/{attempt_id}/complete")
async def complete_exam_attempt(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ExamAttempt).where(
            ExamAttempt.id == attempt_id,
            ExamAttempt.user_id == current_user.id,
        )
    )
    attempt = result.scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    scores = [
        s for s in [attempt.lesen_score, attempt.horen_score, attempt.schreiben_score, attempt.sprechen_score]
        if s is not None
    ]
    total_score = sum(scores) / len(scores) if scores else 0
    attempt.total_score = total_score
    attempt.passed = total_score >= (attempt.passing_score or 60.0)
    attempt.status = ExamStatus.graded
    attempt.completed_at = datetime.now(timezone.utc)

    xp = 100 if attempt.passed else 50
    attempt.xp_earned = xp
    current_user.xp_points += xp

    await _update_exam_readiness(current_user, attempt, db)
    await db.commit()

    return {
        "attempt_id": attempt_id,
        "total_score": total_score,
        "passed": attempt.passed,
        "xp_earned": xp,
        "section_scores": {
            "lesen": attempt.lesen_score,
            "horen": attempt.horen_score,
            "schreiben": attempt.schreiben_score,
            "sprechen": attempt.sprechen_score,
        },
    }


async def _update_exam_readiness(user: User, attempt: ExamAttempt, db: AsyncSession):
    if attempt.total_score is None:
        return
    level = user.target_level
    weight = 0.3

    if level == "A1":
        user.exam_readiness_a1 = min(100, user.exam_readiness_a1 * (1 - weight) + attempt.total_score * weight)
    elif level == "A2":
        user.exam_readiness_a2 = min(100, user.exam_readiness_a2 * (1 - weight) + attempt.total_score * weight)
    elif level == "B1":
        user.exam_readiness_b1 = min(100, user.exam_readiness_b1 * (1 - weight) + attempt.total_score * weight)


@router.get("/readiness")
async def get_exam_readiness(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import desc as sqldesc
    target_level = current_user.target_level

    attempts_result = await db.execute(
        select(ExamAttempt)
        .where(ExamAttempt.user_id == current_user.id, ExamAttempt.status == ExamStatus.graded)
        .order_by(sqldesc(ExamAttempt.completed_at))
        .limit(10)
    )
    attempts = attempts_result.scalars().all()

    avg_score = sum(a.total_score for a in attempts if a.total_score) / len(attempts) if attempts else 0

    readiness_map = {"A1": current_user.exam_readiness_a1, "A2": current_user.exam_readiness_a2, "B1": current_user.exam_readiness_b1}
    overall = readiness_map.get(target_level, 0)

    weak_areas = []
    strong_areas = []
    for area, score in [("Lesen", 70), ("Hören", 65), ("Schreiben", 60), ("Sprechen", 55)]:
        if score < 60:
            weak_areas.append(area)
        else:
            strong_areas.append(area)

    return {
        "level": target_level,
        "overall_readiness": overall,
        "mock_exam_average": avg_score,
        "study_consistency": min(100, current_user.streak_days * 3.33),
        "predicted_pass_probability": min(100, overall * 0.9 + current_user.streak_days * 0.5),
        "ready_to_take_exam": overall >= 75,
        "weak_areas": weak_areas,
        "strong_areas": strong_areas,
        "total_attempts": len(attempts),
        "recommendations": [
            f"Focus on {', '.join(weak_areas)} to improve your readiness" if weak_areas else "Keep up the great work!",
            "Practice daily for at least 30 minutes",
            "Complete at least 3 full mock exams before the real exam",
        ],
    }


@router.get("/attempts/history")
async def get_attempt_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ExamAttempt)
        .where(ExamAttempt.user_id == current_user.id)
        .order_by(desc(ExamAttempt.created_at))
        .limit(20)
    )
    attempts = result.scalars().all()
    return {"attempts": [
        {
            "id": a.id,
            "mock_exam_id": a.mock_exam_id,
            "status": a.status,
            "total_score": a.total_score,
            "passed": a.passed,
            "completed_at": a.completed_at,
            "xp_earned": a.xp_earned,
        }
        for a in attempts
    ]}
