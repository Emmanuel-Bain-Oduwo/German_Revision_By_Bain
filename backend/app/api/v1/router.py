from fastapi import APIRouter
from app.api.v1 import auth, users, vocabulary, exams, ai, courses, flashcards, content

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(courses.router)
api_router.include_router(vocabulary.router)
api_router.include_router(exams.router)
api_router.include_router(flashcards.router)
api_router.include_router(content.router)
api_router.include_router(ai.router)
