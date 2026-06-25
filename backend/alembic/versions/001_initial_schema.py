"""Initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('role', sa.String(), nullable=False, server_default='student'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('subscription_tier', sa.String(), nullable=False, server_default='free'),
        sa.Column('target_level', sa.String(), nullable=False, server_default='A1'),
        sa.Column('native_language', sa.String(), nullable=True),
        sa.Column('xp_points', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('level', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('streak_days', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('last_study_date', sa.Date(), nullable=True),
        sa.Column('daily_goal_minutes', sa.Integer(), nullable=False, server_default='30'),
        sa.Column('exam_readiness_a1', sa.Float(), nullable=False, server_default='0'),
        sa.Column('exam_readiness_a2', sa.Float(), nullable=False, server_default='0'),
        sa.Column('exam_readiness_b1', sa.Float(), nullable=False, server_default='0'),
        sa.Column('badges', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('achievements', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username'),
    )

    # user_profiles table
    op.create_table('user_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('avatar_url', sa.String(), nullable=True),
        sa.Column('timezone', sa.String(), nullable=True),
        sa.Column('study_reminder_time', sa.String(), nullable=True),
        sa.Column('preferred_topics', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('total_study_minutes', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id'),
    )

    # courses table
    op.create_table('courses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_premium', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('total_lessons', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('estimated_hours', sa.Float(), nullable=False, server_default='0'),
        sa.Column('xp_reward', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('tags', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('thumbnail_url', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # topics table
    op.create_table('topics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('course_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('title_german', sa.String(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('xp_reward', sa.Integer(), nullable=False, server_default='50'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # lessons table
    op.create_table('lessons',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('topic_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('lesson_type', sa.String(), nullable=False, server_default='vocabulary'),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('xp_reward', sa.Integer(), nullable=False, server_default='10'),
        sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default='5'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # vocabulary table
    op.create_table('vocabulary',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('german', sa.String(), nullable=False),
        sa.Column('english', sa.String(), nullable=False),
        sa.Column('article', sa.String(), nullable=True),
        sa.Column('word_type', sa.String(), nullable=False, server_default='noun'),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('topic', sa.String(), nullable=True),
        sa.Column('ipa_pronunciation', sa.String(), nullable=True),
        sa.Column('example_sentence', sa.Text(), nullable=True),
        sa.Column('example_translation', sa.Text(), nullable=True),
        sa.Column('audio_url', sa.String(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('synonyms', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('conjugations', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('tags', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('frequency_rank', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # vocabulary_progress table
    op.create_table('vocabulary_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('vocabulary_id', sa.Integer(), nullable=False),
        sa.Column('ease_factor', sa.Float(), nullable=False, server_default='2.5'),
        sa.Column('interval_days', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('repetitions', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('next_review_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('retention_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('times_seen', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('times_correct', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['vocabulary_id'], ['vocabulary.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'vocabulary_id', name='uq_vocab_progress'),
    )

    # grammar_rules table
    op.create_table('grammar_rules',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=False),
        sa.Column('formula', sa.String(), nullable=True),
        sa.Column('examples', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('exercises', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('tips', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # flashcard_decks table
    op.create_table('flashcard_decks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('topic', sa.String(), nullable=True),
        sa.Column('card_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # flashcards table
    op.create_table('flashcards',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('deck_id', sa.Integer(), nullable=True),
        sa.Column('front', sa.Text(), nullable=False),
        sa.Column('back', sa.Text(), nullable=False),
        sa.Column('front_audio_url', sa.String(), nullable=True),
        sa.Column('back_audio_url', sa.String(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('topic', sa.String(), nullable=True),
        sa.Column('card_type', sa.String(), nullable=False, server_default='vocabulary'),
        sa.Column('hint', sa.Text(), nullable=True),
        sa.Column('tags', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['deck_id'], ['flashcard_decks.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )

    # flashcard_progress table
    op.create_table('flashcard_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('flashcard_id', sa.Integer(), nullable=False),
        sa.Column('ease_factor', sa.Float(), nullable=False, server_default='2.5'),
        sa.Column('interval_days', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('repetitions', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('next_review_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('is_mastered', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['flashcard_id'], ['flashcards.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'flashcard_id', name='uq_flashcard_progress'),
    )

    # mock_exams table
    op.create_table('mock_exams',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default='90'),
        sa.Column('passing_score', sa.Float(), nullable=False, server_default='60'),
        sa.Column('is_ai_generated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_premium', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('times_taken', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('average_score', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # exam_section_contents table
    op.create_table('exam_section_contents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('exam_id', sa.Integer(), nullable=False),
        sa.Column('section', sa.String(), nullable=False),
        sa.Column('content', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('max_score', sa.Float(), nullable=False, server_default='100'),
        sa.Column('time_limit_minutes', sa.Integer(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['exam_id'], ['mock_exams.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # exam_attempts table
    op.create_table('exam_attempts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('exam_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='in_progress'),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('total_score', sa.Float(), nullable=True),
        sa.Column('lesen_score', sa.Float(), nullable=True),
        sa.Column('horen_score', sa.Float(), nullable=True),
        sa.Column('schreiben_score', sa.Float(), nullable=True),
        sa.Column('sprechen_score', sa.Float(), nullable=True),
        sa.Column('lesen_answers', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('horen_answers', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('schreiben_response', sa.Text(), nullable=True),
        sa.Column('sprechen_transcript', sa.Text(), nullable=True),
        sa.Column('ai_feedback', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('passed', sa.Boolean(), nullable=True),
        sa.Column('xp_earned', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['exam_id'], ['mock_exams.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # exam_readiness_scores table
    op.create_table('exam_readiness_scores',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('mock_exam_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('speaking_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('listening_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('vocabulary_retention', sa.Float(), nullable=False, server_default='0'),
        sa.Column('study_consistency', sa.Float(), nullable=False, server_default='0'),
        sa.Column('predicted_pass_probability', sa.Float(), nullable=False, server_default='0'),
        sa.Column('weak_areas', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('strong_areas', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('recommendation', sa.Text(), nullable=True),
        sa.Column('computed_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # stories table
    op.create_table('stories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('title_english', sa.String(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('topic', sa.String(), nullable=True),
        sa.Column('word_count', sa.Integer(), nullable=True),
        sa.Column('reading_time_minutes', sa.Integer(), nullable=True),
        sa.Column('comprehension_questions', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('vocabulary_highlights', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('is_ai_generated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('xp_reward', sa.Integer(), nullable=False, server_default='30'),
        sa.Column('tags', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('plays_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # podcasts table
    op.create_table('podcasts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('level', sa.String(), nullable=False),
        sa.Column('topic', sa.String(), nullable=True),
        sa.Column('duration_seconds', sa.Integer(), nullable=True),
        sa.Column('audio_url', sa.String(), nullable=True),
        sa.Column('script', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('vocabulary_highlighted', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('comprehension_questions', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('is_ai_generated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('xp_reward', sa.Integer(), nullable=False, server_default='25'),
        sa.Column('plays_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # chat_sessions table
    op.create_table('chat_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('messages', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='[]'),
        sa.Column('message_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('xp_earned', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('ai_provider', sa.String(), nullable=False, server_default='openai'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # user_analytics table
    op.create_table('user_analytics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('study_minutes', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('xp_earned', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('vocabulary_reviewed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('flashcards_reviewed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('lessons_completed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('exam_attempts', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('ai_interactions', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'date', name='uq_user_daily_analytics'),
    )

    # subscriptions table
    op.create_table('subscriptions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('stripe_subscription_id', sa.String(), nullable=True),
        sa.Column('stripe_customer_id', sa.String(), nullable=True),
        sa.Column('plan', sa.String(), nullable=False, server_default='free'),
        sa.Column('status', sa.String(), nullable=False, server_default='active'),
        sa.Column('current_period_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('current_period_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancel_at_period_end', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create indexes for performance
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_username', 'users', ['username'])
    op.create_index('ix_vocabulary_level', 'vocabulary', ['level'])
    op.create_index('ix_vocabulary_topic', 'vocabulary', ['topic'])
    op.create_index('ix_grammar_rules_level', 'grammar_rules', ['level'])
    op.create_index('ix_grammar_rules_category', 'grammar_rules', ['category'])
    op.create_index('ix_flashcards_level', 'flashcards', ['level'])
    op.create_index('ix_stories_level', 'stories', ['level'])
    op.create_index('ix_podcasts_level', 'podcasts', ['level'])
    op.create_index('ix_mock_exams_level', 'mock_exams', ['level'])
    op.create_index('ix_vocab_progress_next_review', 'vocabulary_progress', ['next_review_at'])
    op.create_index('ix_flashcard_progress_next_review', 'flashcard_progress', ['next_review_at'])
    op.create_index('ix_user_analytics_date', 'user_analytics', ['user_id', 'date'])


def downgrade() -> None:
    op.drop_table('subscriptions')
    op.drop_table('user_analytics')
    op.drop_table('chat_sessions')
    op.drop_table('podcasts')
    op.drop_table('stories')
    op.drop_table('exam_readiness_scores')
    op.drop_table('exam_attempts')
    op.drop_table('exam_section_contents')
    op.drop_table('mock_exams')
    op.drop_table('flashcard_progress')
    op.drop_table('flashcards')
    op.drop_table('flashcard_decks')
    op.drop_table('grammar_rules')
    op.drop_table('vocabulary_progress')
    op.drop_table('vocabulary')
    op.drop_table('lessons')
    op.drop_table('topics')
    op.drop_table('courses')
    op.drop_table('user_profiles')
    op.drop_table('users')
