# 🇩🇪 Goethe Exam Platform — German Exam Preparation

> Production-ready AI-powered platform for Goethe Institute A1, A2, and B1 exam preparation.

---

## 🏗️ Architecture Overview

```
goethe-platform/
├── backend/          # FastAPI + PostgreSQL + Redis
├── frontend/         # Next.js 15 + TailwindCSS + ShadCN
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 | Full-stack React framework |
| TypeScript | Type safety |
| TailwindCSS | Utility-first styling |
| Framer Motion | Animations |
| Zustand | State management |
| Axios | HTTP client |
| Recharts | Data visualization |
| React Query | Server state |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | High-performance API |
| SQLAlchemy 2 | ORM with async support |
| PostgreSQL | Primary database |
| Alembic | Database migrations |
| Redis | Caching & sessions |
| Celery | Background tasks |
| JWT | Authentication |
| Pydantic v2 | Data validation |

### AI Integration
| Provider | Use Cases |
|---|---|
| OpenAI GPT-4o | Tutoring, grammar correction, writing feedback |
| DeepSeek | Cost-effective Q&A, exercise generation |
| Google Gemini | Image generation, audio conversations |

---

## 📋 Features

### Core Learning
- ✅ Complete A1, A2, B1 learning paths
- ✅ 15+ topics per level (Begrüßung, Familie, Arbeit, etc.)
- ✅ Vocabulary builder with spaced repetition (SM-2 algorithm)
- ✅ Grammar explanations with examples and exercises
- ✅ Interactive flashcards with audio pronunciation

### Goethe Exam Modules
- ✅ **Lesen** — Reading passages with MCQ, matching, true/false
- ✅ **Hören** — AI-generated audio conversations with questions
- ✅ **Schreiben** — Writing tasks with AI grading and corrections
- ✅ **Sprechen** — Speaking prompts with pronunciation analysis

### AI Features
- ✅ 24/7 AI Tutor "Greta" (GPT-4o powered)
- ✅ Voice-to-voice German conversations
- ✅ AI Podcast Generator (daily/travel/health topics)
- ✅ Story Generator with comprehension questions
- ✅ Grammar correction with detailed explanations
- ✅ Image-based speaking practice

### Exam Readiness Predictor
- ✅ Analyzes 5 key factors:
  1. Mock exam scores (30%)
  2. Speaking performance (25%)
  3. Listening accuracy (20%)
  4. Vocabulary retention (15%)
  5. Study consistency (10%)
- ✅ Predicted pass probability percentage
- ✅ "Ready to book your exam" indicator
- ✅ Personalized weak area recommendations

### Gamification
- ✅ XP points system
- ✅ Leveling system
- ✅ Daily streaks
- ✅ Achievement badges
- ✅ Global leaderboard

---

## 🗄️ Database Schema

### Core Tables
- `users` — User accounts with XP, streaks, exam readiness
- `profiles` — Extended user profiles
- `courses` — Learning courses by CEFR level
- `topics` — Course topics (Begrüßung, Familie, etc.)
- `lessons` — Individual lessons within topics
- `vocabulary` — German words with audio, examples, articles
- `vocabulary_progress` — SM-2 spaced repetition tracking
- `grammar_rules` — Grammar explanations with examples
- `flashcards` — Flashcard content
- `flashcard_progress` — Per-user flashcard mastery
- `mock_exams` — Full exam configurations
- `exam_sections` — Lesen/Hören/Schreiben/Sprechen sections
- `exam_attempts` — User exam attempt records with AI feedback
- `exam_readiness_scores` — Computed readiness predictions
- `stories` — AI-generated reading stories
- `podcasts` — AI-generated audio content
- `chat_sessions` — AI tutor conversation history
- `audio_files` — TTS and user recordings
- `analytics` — Daily study statistics
- `subscriptions` — Stripe subscription management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL 16+
- Redis 7+
- Docker (recommended)

### Docker (Recommended)
```bash
# Clone and setup
git clone https://github.com/your-org/goethe-platform
cd goethe-platform

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Start everything
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head
```

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env
alembic upgrade head
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local
npm run dev
```

---

## 🔑 Environment Variables

### Backend (backend/.env)
```env
SECRET_KEY=your-secret-key
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_DB=goethe_platform
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=sk-...
DEEPSEEK_API_KEY=...
GEMINI_API_KEY=...
DEFAULT_AI_PROVIDER=openai
CLOUDFLARE_R2_ACCOUNT_ID=...
CLOUDFLARE_R2_ACCESS_KEY=...
CLOUDFLARE_R2_SECRET_KEY=...
STRIPE_SECRET_KEY=sk_live_...
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 API Reference

### Authentication
```
POST /api/v1/auth/register   — Create account
POST /api/v1/auth/login      — Login
POST /api/v1/auth/refresh    — Refresh token
GET  /api/v1/auth/me         — Current user
```

### Vocabulary
```
GET  /api/v1/vocabulary/              — List vocabulary
GET  /api/v1/vocabulary/me/progress   — My progress
GET  /api/v1/vocabulary/me/due-for-review — Cards due
POST /api/v1/vocabulary/{id}/review   — Record review
GET  /api/v1/vocabulary/grammar/rules — Grammar rules
```

### Exams
```
GET  /api/v1/exams/mock              — List mock exams
POST /api/v1/exams/mock/generate     — AI generate exam
POST /api/v1/exams/attempts          — Start exam
POST /api/v1/exams/attempts/{id}/submit-writing   — Submit writing
POST /api/v1/exams/attempts/{id}/submit-speaking  — Submit speaking
POST /api/v1/exams/attempts/{id}/complete         — Complete exam
GET  /api/v1/exams/readiness         — Exam readiness score
```

### AI
```
POST /api/v1/ai/tutor/chat           — Chat with AI tutor
POST /api/v1/ai/tutor/stream         — Stream AI response
POST /api/v1/ai/vocabulary/generate  — Generate vocabulary
POST /api/v1/ai/story/generate       — Generate story
POST /api/v1/ai/podcast/generate     — Generate podcast
POST /api/v1/ai/grammar/correct      — Correct German text
POST /api/v1/ai/exercises/generate   — Generate exercises
POST /api/v1/ai/tts                  — Text to speech
```

---

## 🚀 Deployment

### Backend → Railway
1. Create Railway account
2. Connect GitHub repo
3. Set root directory to `/backend`
4. Add all environment variables
5. Railway auto-detects Python and deploys

### Frontend → Vercel
1. Import repo to Vercel
2. Set root directory to `/frontend`
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Database → Railway PostgreSQL
- Provision PostgreSQL plugin in Railway
- Connection string auto-injected

---

## 🗺️ Development Roadmap

### MVP (v1.0) ✅
- [x] Authentication system
- [x] A1, A2, B1 course structure
- [x] Vocabulary with spaced repetition
- [x] AI tutor chatbot
- [x] Mock exam system
- [x] Exam Readiness Predictor
- [x] Speaking lab
- [x] Flashcard system

### v1.1
- [ ] OAuth (Google, GitHub)
- [ ] Email verification
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Push notifications

### v1.2
- [ ] B2 level content
- [ ] Live tutoring sessions
- [ ] Study groups
- [ ] Partner speaking practice

### v2.0 Enterprise
- [ ] C1, C2 levels
- [ ] School/institution accounts
- [ ] Teacher dashboard
- [ ] Progress reporting for administrators
- [ ] White-label solution

---

## 📊 Scaling Plan

### Infrastructure
- **CDN:** Cloudflare for static assets
- **Load Balancing:** Railway auto-scaling
- **Database:** PostgreSQL with read replicas
- **Caching:** Redis cluster
- **Media:** Cloudflare R2 (S3-compatible)

### Performance Targets
- API response time: < 200ms (p95)
- Page load: < 1.5s (LCP)
- Uptime: 99.9% SLA
- Concurrent users: 10,000+

---

## 📝 License

MIT License — Built with ❤️ for German language learners worldwide.

---

## 🙏 Acknowledgments

- Goethe Institut for exam standards
- OpenAI for GPT-4o API
- DeepSeek for efficient AI inference
- Google for Gemini multimodal capabilities
