from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import json

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.content import ChatSession
from app.ai.factory import get_ai_provider, get_audio_provider
from app.ai.base import Message
from app.schemas.ai import (
    TutorChatRequest, TutorChatResponse,
    GenerateVocabularyRequest, GenerateVocabularyResponse, VocabularyItem,
    GenerateStoryRequest, GeneratePodcastRequest,
    TextToSpeechRequest, GrammarCorrectRequest,
    ExerciseGenerateRequest, ImageDescriptionRequest,
    VideoLessonRequest, VideoLessonResponse, VideoLessonSlide,
    VoiceChatRequest, VoiceChatResponse,
)

router = APIRouter(prefix="/ai", tags=["AI"])

TUTOR_SYSTEM_PROMPT = """You are an expert German language tutor specializing in Goethe Institute examinations.
You are warm, encouraging, and pedagogically sound. Your name is Greta.

Guidelines:
- Always respond in a mix of German and English appropriate for the student's level
- For A1/A2: Use simple German with English explanations
- For B1: Use mostly German with occasional English for complex grammar points
- Correct mistakes gently and explain WHY something is wrong
- Give 1-2 relevant vocabulary words per response when appropriate
- Use real-world examples from Goethe exam contexts
- Be encouraging and celebrate progress
- Format corrections clearly: ❌ Wrong → ✅ Correct

Current student level: {level}"""


@router.post("/tutor/chat", response_model=TutorChatResponse)
async def tutor_chat(
    request: TutorChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)

    if request.session_id:
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.id == request.session_id,
                ChatSession.user_id == current_user.id,
            )
        )
        session = result.scalar_one_or_none()
    else:
        session = None

    if not session:
        session = ChatSession(
            user_id=current_user.id,
            session_type=request.session_type,
            level=request.level,
            ai_provider=provider.name,
            title=f"{request.session_type.replace('_', ' ').title()} Session",
        )
        db.add(session)
        await db.flush()

    messages = [
        Message(
            role="system",
            content=TUTOR_SYSTEM_PROMPT.format(level=request.level),
        )
    ]
    for msg in request.messages[-10:]:
        messages.append(Message(role=msg.role, content=msg.content))

    response = await provider.chat(messages, temperature=0.7)

    if not session.messages:
        session.messages = []
    session.messages = session.messages + [
        {"role": "user", "content": request.messages[-1].content if request.messages else ""},
        {"role": "assistant", "content": response.content},
    ]
    session.total_messages += 2
    xp_earned = 10
    current_user.xp_points += xp_earned
    session.xp_earned = (session.xp_earned or 0) + xp_earned

    await db.commit()

    return TutorChatResponse(
        message=response.content,
        provider=provider.name,
        session_id=session.id,
        xp_earned=xp_earned,
    )


@router.post("/tutor/stream")
async def tutor_chat_stream(
    request: TutorChatRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)
    messages = [
        Message(role="system", content=TUTOR_SYSTEM_PROMPT.format(level=request.level))
    ]
    for msg in request.messages[-10:]:
        messages.append(Message(role=msg.role, content=msg.content))

    async def generate():
        async for chunk in provider.stream_chat(messages):
            yield f"data: {json.dumps({'content': chunk})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.post("/vocabulary/generate", response_model=GenerateVocabularyResponse)
async def generate_vocabulary(
    request: GenerateVocabularyRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)
    messages = [
        Message(
            role="system",
            content=f"""You are a Goethe Institute German teacher.
            Generate exactly {request.count} vocabulary words for {request.level} level learners about '{request.topic}'.
            Return ONLY valid JSON: {{"vocabulary": [{{"german_word": "", "article": "der/die/das or null",
            "english_translation": "", "example_sentence_de": "", "example_sentence_en": "",
            "word_type": "noun/verb/adjective/etc", "level": "{request.level}"}}]}}""",
        ),
        Message(role="user", content=f"Generate {request.count} {request.level} vocabulary words about {request.topic}."),
    ]
    response = await provider.chat(messages, temperature=0.7, max_tokens=3000)

    try:
        data = json.loads(response.content)
        vocab_items = [VocabularyItem(**item) for item in data.get("vocabulary", [])]
    except (json.JSONDecodeError, Exception) as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    return GenerateVocabularyResponse(
        vocabulary=vocab_items,
        topic=request.topic,
        level=request.level,
        provider=provider.name,
    )


@router.post("/story/generate")
async def generate_story(
    request: GenerateStoryRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)
    messages = [
        Message(
            role="system",
            content=f"""You are a German language teacher creating engaging reading material.
            Generate a story for {request.level} level learners about '{request.topic}'.
            Target word count: {request.word_count} words.
            Return JSON: {{"title": "", "title_english": "", "content": "",
            "content_english": "", "vocabulary_list": [{{"german": "", "english": "", "article": ""}}],
            "comprehension_questions": [{{"question": "", "answer": "", "question_type": "mcq/open"}}]}}""",
        ),
        Message(role="user", content=f"Generate a {request.level} German story about {request.topic}."),
    ]
    response = await provider.chat(messages, temperature=0.8, max_tokens=4000)
    try:
        data = json.loads(response.content)
        return {"story": data, "provider": provider.name}
    except json.JSONDecodeError:
        return {"story": {"content": response.content}, "provider": provider.name}


@router.post("/podcast/generate")
async def generate_podcast_script(
    request: GeneratePodcastRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)
    messages = [
        Message(
            role="system",
            content=f"""You are creating a German language learning podcast script.
            Level: {request.level}, Topic: {request.topic}, Duration: ~{request.duration_minutes} minutes.
            Create a natural conversation between two hosts (Anna and Klaus).
            Return JSON: {{"title": "", "description": "",
            "script": [{{"speaker": "Anna/Klaus", "text": "", "translation": ""}}],
            "vocabulary_highlighted": [{{"word": "", "translation": ""}}],
            "comprehension_questions": []}}""",
        ),
        Message(role="user", content=f"Generate a {request.duration_minutes}-minute {request.level} podcast about {request.topic}."),
    ]
    response = await provider.chat(messages, temperature=0.8, max_tokens=4000)
    try:
        data = json.loads(response.content)
        return {"podcast": data, "provider": provider.name}
    except json.JSONDecodeError:
        return {"podcast": {"script": response.content}, "provider": provider.name}


@router.post("/grammar/correct")
async def correct_grammar(
    request: GrammarCorrectRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)
    result = await provider.correct_german_text(request.text, request.level)
    return {"correction": result, "provider": provider.name}


@router.post("/exercises/generate")
async def generate_exercises(
    request: ExerciseGenerateRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)
    result = await provider.generate_german_exercise(
        request.topic, request.level, request.exercise_type, request.count
    )
    try:
        data = json.loads(result["raw"])
        return {"exercises": data.get("exercises", []), "provider": provider.name}
    except json.JSONDecodeError:
        return {"exercises": [], "raw": result["raw"], "provider": provider.name}


@router.post("/tts")
async def text_to_speech(
    request: TextToSpeechRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_audio_provider()
    try:
        audio_bytes = await provider.generate_audio(request.text, voice=request.voice)
        return StreamingResponse(
            iter([audio_bytes]),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=speech.mp3"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")


@router.post("/transcribe")
async def transcribe_audio(
    current_user: User = Depends(get_current_user),
):
    return {"message": "Upload audio file for transcription via multipart form"}


@router.post("/image-description/evaluate")
async def evaluate_image_description(
    request: ImageDescriptionRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_ai_provider(current_user.preferred_ai_provider)
    messages = [
        Message(
            role="system",
            content=f"""You are a German language examiner. A {request.level} level student described an image.
            Evaluate their description for grammar, vocabulary, and completeness.
            Return JSON: {{"grammar_score": 0-100, "vocabulary_score": 0-100, "completeness_score": 0-100,
            "overall_score": 0-100, "corrections": [], "feedback": "", "better_description": ""}}""",
        ),
        Message(
            role="user",
            content=f"Image topic: {request.topic or 'general'}\nStudent's description: {request.user_description}",
        ),
    ]
    response = await provider.chat(messages, temperature=0.3)
    try:
        return json.loads(response.content)
    except json.JSONDecodeError:
        return {"feedback": response.content, "provider": provider.name}


@router.post("/video-lesson/generate", response_model=VideoLessonResponse)
async def generate_video_lesson(
    request: VideoLessonRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)
    messages = [
        Message(
            role="system",
            content=f"""You are an expert German language teacher creating a structured video lesson.
Level: {request.level}. Topic: {request.topic}.
Create a 6-slide video lesson with engaging content.
Return ONLY valid JSON in this exact structure:
{{
  "title": "lesson title in English",
  "slides": [
    {{
      "slide_number": 1,
      "type": "title",
      "heading": "slide heading",
      "content": "brief intro text",
      "german_examples": [],
      "english_translations": [],
      "narrator_text": "What the narrator says aloud for this slide (1-3 sentences, encouraging and clear)"
    }},
    {{
      "slide_number": 2,
      "type": "vocabulary",
      "heading": "Key Vocabulary",
      "content": "Short explanation",
      "german_examples": ["word1", "word2", "word3", "word4"],
      "english_translations": ["trans1", "trans2", "trans3", "trans4"],
      "narrator_text": "Narrator reads each word and translation"
    }},
    {{
      "slide_number": 3,
      "type": "grammar",
      "heading": "Grammar Point",
      "content": "Clear grammar rule explanation",
      "german_examples": ["example sentence 1", "example sentence 2"],
      "english_translations": ["translation 1", "translation 2"],
      "narrator_text": "Narrator explains the rule"
    }},
    {{
      "slide_number": 4,
      "type": "example",
      "heading": "Real-life Examples",
      "content": "Context description",
      "german_examples": ["dialogue or examples"],
      "english_translations": ["translations"],
      "narrator_text": "Narrator walks through examples"
    }},
    {{
      "slide_number": 5,
      "type": "grammar",
      "heading": "Practice Point",
      "content": "A second grammar or usage point",
      "german_examples": ["example1", "example2"],
      "english_translations": ["trans1", "trans2"],
      "narrator_text": "Narrator explains"
    }},
    {{
      "slide_number": 6,
      "type": "summary",
      "heading": "Summary & Tips",
      "content": "Key takeaways",
      "german_examples": ["tip1", "tip2"],
      "english_translations": ["tip1 en", "tip2 en"],
      "narrator_text": "Closing summary and encouragement"
    }}
  ]
}}""",
        ),
        Message(role="user", content=f"Generate a video lesson about '{request.topic}' for {request.level} German learners."),
    ]
    response = await provider.chat(messages, temperature=0.7, max_tokens=4000)
    try:
        raw = response.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        data = json.loads(raw.strip())
        slides = [VideoLessonSlide(**s) for s in data.get("slides", [])]
        duration = len(slides) * 25
        return VideoLessonResponse(
            title=data.get("title", f"{request.topic} — {request.level}"),
            level=request.level,
            topic=request.topic,
            slides=slides,
            provider=provider.name,
            total_duration_seconds=duration,
        )
    except (json.JSONDecodeError, Exception) as e:
        raise HTTPException(status_code=500, detail=f"Video lesson generation failed: {str(e)}")


@router.post("/voice-chat", response_model=VoiceChatResponse)
async def voice_chat(
    request: VoiceChatRequest,
    current_user: User = Depends(get_current_user),
):
    provider = get_ai_provider(request.provider or current_user.preferred_ai_provider)
    system_prompt = f"""You are Greta, a warm and friendly German language tutor.
The student is speaking to you by voice at level {request.level}.
Keep responses SHORT (2-4 sentences max) since they will be read aloud.
Respond in a natural, conversational mix of German and English appropriate for {request.level}.
Correct mistakes gently inline. Be encouraging."""

    messages = [Message(role="system", content=system_prompt)]
    for msg in request.conversation_history[-6:]:
        messages.append(Message(role=msg.role, content=msg.content))
    messages.append(Message(role="user", content=request.transcript))

    response = await provider.chat(messages, temperature=0.75, max_tokens=300)
    current_user.xp_points += 5
    await get_db()

    return VoiceChatResponse(
        reply_text=response.content,
        provider=provider.name,
        xp_earned=5,
    )


@router.get("/chat/sessions")
async def get_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
        .limit(20)
    )
    sessions = result.scalars().all()
    return {
        "sessions": [
            {
                "id": s.id,
                "title": s.title,
                "session_type": s.session_type,
                "total_messages": s.total_messages,
                "xp_earned": s.xp_earned,
                "created_at": s.created_at,
            }
            for s in sessions
        ]
    }
