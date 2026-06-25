"""
Seed initial data for the Goethe exam platform.
Run: python -m app.db.init_db
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session_maker


COURSES_DATA = [
    {
        "title": "German A1 — Absolute Beginner",
        "description": "Start your German journey with the most essential vocabulary, grammar, and phrases for everyday situations.",
        "level": "A1",
        "order_index": 1,
        "is_published": True,
        "is_premium": False,
        "total_lessons": 45,
        "estimated_hours": 15,
        "xp_reward": 500,
        "tags": ["beginner", "Goethe A1", "daily life", "essential"],
        "topics": [
            {"title": "Greetings & Introductions", "title_german": "Begrüßung", "icon": "👋", "order_index": 1},
            {"title": "Family & Relationships", "title_german": "Familie", "icon": "👨‍👩‍👧", "order_index": 2},
            {"title": "Numbers & Counting", "title_german": "Zahlen", "icon": "🔢", "order_index": 3},
            {"title": "Time & Days", "title_german": "Uhrzeit & Tage", "icon": "🕐", "order_index": 4},
            {"title": "Colors & Shapes", "title_german": "Farben", "icon": "🎨", "order_index": 5},
            {"title": "Food & Drinks", "title_german": "Essen & Trinken", "icon": "🍽️", "order_index": 6},
            {"title": "Shopping & Money", "title_german": "Einkaufen", "icon": "🛍️", "order_index": 7},
            {"title": "Transportation", "title_german": "Verkehr", "icon": "🚌", "order_index": 8},
            {"title": "Housing & Home", "title_german": "Wohnen", "icon": "🏠", "order_index": 9},
            {"title": "Body & Health", "title_german": "Körper & Gesundheit", "icon": "🏥", "order_index": 10},
            {"title": "Weather & Seasons", "title_german": "Wetter", "icon": "🌤️", "order_index": 11},
            {"title": "Hobbies & Free Time", "title_german": "Freizeit", "icon": "🎮", "order_index": 12},
            {"title": "School & Work", "title_german": "Schule & Arbeit", "icon": "📚", "order_index": 13},
            {"title": "Countries & Languages", "title_german": "Länder", "icon": "🌍", "order_index": 14},
            {"title": "A1 Mock Exam Prep", "title_german": "Prüfungsvorbereitung", "icon": "📝", "order_index": 15},
        ],
    },
    {
        "title": "German A2 — Elementary",
        "description": "Build on your basics with more complex sentences, past tense, and real-world conversational skills.",
        "level": "A2",
        "order_index": 2,
        "is_published": True,
        "is_premium": False,
        "total_lessons": 35,
        "estimated_hours": 20,
        "xp_reward": 750,
        "tags": ["elementary", "Goethe A2", "past tense", "conversations"],
        "topics": [
            {"title": "Daily Routines", "title_german": "Alltag", "icon": "☀️", "order_index": 1},
            {"title": "Past Tense (Perfekt)", "title_german": "Perfekt", "icon": "⏮️", "order_index": 2},
            {"title": "Dative Case", "title_german": "Dativ", "icon": "📐", "order_index": 3},
            {"title": "Adjective Endings", "title_german": "Adjektivdeklination", "icon": "✏️", "order_index": 4},
            {"title": "Talking About the Past", "title_german": "Vergangenheit", "icon": "📅", "order_index": 5},
            {"title": "Travel & Tourism", "title_german": "Reisen", "icon": "✈️", "order_index": 6},
            {"title": "At the Doctor", "title_german": "Beim Arzt", "icon": "🩺", "order_index": 7},
            {"title": "Money & Banking", "title_german": "Geld & Bank", "icon": "💰", "order_index": 8},
            {"title": "Making Appointments", "title_german": "Termine", "icon": "📆", "order_index": 9},
            {"title": "A2 Mock Exam Prep", "title_german": "Prüfungsvorbereitung", "icon": "📝", "order_index": 10},
        ],
    },
    {
        "title": "German B1 — Intermediate",
        "description": "Achieve independence in German with complex grammar, opinion expression, and advanced exam techniques.",
        "level": "B1",
        "order_index": 3,
        "is_published": True,
        "is_premium": True,
        "total_lessons": 40,
        "estimated_hours": 30,
        "xp_reward": 1000,
        "tags": ["intermediate", "Goethe B1", "subjunctive", "complex grammar"],
        "topics": [
            {"title": "Konjunktiv II (Subjunctive)", "title_german": "Konjunktiv II", "icon": "💭", "order_index": 1},
            {"title": "Passive Voice", "title_german": "Passiv", "icon": "🔄", "order_index": 2},
            {"title": "Relative Clauses", "title_german": "Relativsätze", "icon": "🔗", "order_index": 3},
            {"title": "Work & Career", "title_german": "Beruf & Karriere", "icon": "💼", "order_index": 4},
            {"title": "Environment & Society", "title_german": "Umwelt & Gesellschaft", "icon": "🌱", "order_index": 5},
            {"title": "Media & Technology", "title_german": "Medien & Technologie", "icon": "📱", "order_index": 6},
            {"title": "Expressing Opinions", "title_german": "Meinungsäußerung", "icon": "💬", "order_index": 7},
            {"title": "Reading Complex Texts", "title_german": "Lesetexte", "icon": "📰", "order_index": 8},
            {"title": "Writing Formal Letters", "title_german": "Briefe schreiben", "icon": "✉️", "order_index": 9},
            {"title": "Listening Strategies", "title_german": "Hörstrategien", "icon": "🎧", "order_index": 10},
            {"title": "Speaking Exam Prep", "title_german": "Sprechen", "icon": "🎤", "order_index": 11},
            {"title": "B1 Mock Exam Prep", "title_german": "Prüfungsvorbereitung", "icon": "📝", "order_index": 12},
        ],
    },
]

GRAMMAR_DATA = [
    # A1 Grammar
    {
        "title": "Present Tense (Präsens)",
        "category": "tenses",
        "level": "A1",
        "explanation": "The present tense is used to describe current actions, habits, and facts. Regular verbs follow a predictable conjugation pattern.",
        "formula": "Verb stem + ending: -e, -st, -t, -en, -t, -en",
        "examples": [
            {"german": "Ich lerne Deutsch.", "english": "I am learning German."},
            {"german": "Du spielst Fußball.", "english": "You play football."},
            {"german": "Er arbeitet im Büro.", "english": "He works in the office."},
        ],
        "tips": ["Remove -en from the infinitive to get the stem", "ich always ends in -e", "du always ends in -st (usually)"],
        "order_index": 1,
    },
    {
        "title": "Definite Articles (Der, Die, Das)",
        "category": "articles",
        "level": "A1",
        "explanation": "German has three grammatical genders: masculine (der), feminine (die), and neuter (das). Every noun has a fixed gender that must be memorized.",
        "formula": "der (masc.) | die (fem.) | das (neut.) | die (plural)",
        "examples": [
            {"german": "der Mann", "english": "the man (masculine)"},
            {"german": "die Frau", "english": "the woman (feminine)"},
            {"german": "das Kind", "english": "the child (neuter)"},
        ],
        "tips": ["Learn the article WITH every new noun", "Feminine nouns: -ung, -heit, -keit, -tion → always die", "Neuter nouns: -chen, -lein → always das"],
        "order_index": 2,
    },
    {
        "title": "Nominative Case",
        "category": "cases",
        "level": "A1",
        "explanation": "The nominative case is used for the subject of a sentence — the person or thing performing the action.",
        "formula": "Subject + Verb + ...",
        "examples": [
            {"german": "Der Hund bellt.", "english": "The dog barks."},
            {"german": "Die Katze schläft.", "english": "The cat sleeps."},
            {"german": "Das Buch liegt auf dem Tisch.", "english": "The book lies on the table."},
        ],
        "tips": ["The nominative is the 'dictionary form' of nouns", "Always ask: Who or what is doing the action?"],
        "order_index": 3,
    },
    # A2 Grammar
    {
        "title": "Perfect Tense (Perfekt)",
        "category": "tenses",
        "level": "A2",
        "explanation": "The Perfekt is the most common past tense in spoken German. It's formed with haben/sein + past participle (Partizip II).",
        "formula": "haben/sein (conjugated) + Partizip II (at end)",
        "examples": [
            {"german": "Ich habe Deutsch gelernt.", "english": "I (have) learned German."},
            {"german": "Er ist nach Berlin gefahren.", "english": "He went/has gone to Berlin."},
            {"german": "Wir haben gegessen.", "english": "We ate/have eaten."},
        ],
        "tips": ["Use sein with movement/change of state verbs (fahren, gehen, kommen)", "Regular Partizip II: ge- + stem + -t", "Irregular Partizip II must be memorized"],
        "order_index": 4,
    },
    {
        "title": "Accusative Case",
        "category": "cases",
        "level": "A2",
        "explanation": "The accusative case marks the direct object — the person or thing directly affected by the action.",
        "formula": "der → den | die → die | das → das | die (pl.) → die",
        "examples": [
            {"german": "Ich kaufe den Apfel.", "english": "I buy the apple. (masc. → den)"},
            {"german": "Sie liest die Zeitung.", "english": "She reads the newspaper. (fem. stays die)"},
            {"german": "Er hat das Buch.", "english": "He has the book. (neut. stays das)"},
        ],
        "tips": ["Only masculine changes in the accusative (der → den)", "Ask: Who or what is being acted upon?", "Accusative prepositions: durch, für, gegen, ohne, um"],
        "order_index": 5,
    },
    # B1 Grammar
    {
        "title": "Konjunktiv II (Subjunctive II)",
        "category": "tenses",
        "level": "B1",
        "explanation": "Konjunktiv II expresses hypothetical situations, wishes, polite requests, and conditions that are contrary to reality.",
        "formula": "würde + Infinitiv OR past tense form + Umlaut",
        "examples": [
            {"german": "Wenn ich reich wäre, würde ich reisen.", "english": "If I were rich, I would travel."},
            {"german": "Könnten Sie mir helfen?", "english": "Could you help me? (polite)"},
            {"german": "Ich hätte gern einen Kaffee.", "english": "I would like a coffee."},
        ],
        "tips": ["würde + infinitive works for most verbs", "sein → wäre, haben → hätte, können → könnte (memorize these)", "Used for polite requests in everyday speech"],
        "order_index": 6,
    },
    {
        "title": "Passive Voice (Passiv)",
        "category": "verbs",
        "level": "B1",
        "explanation": "The passive voice shifts focus from the doer to the action or result. Very common in formal/written German.",
        "formula": "werden (conjugated) + Partizip II",
        "examples": [
            {"german": "Das Buch wird gelesen.", "english": "The book is being read."},
            {"german": "Das Haus wurde gebaut.", "english": "The house was built."},
            {"german": "Der Brief ist geschrieben worden.", "english": "The letter has been written."},
        ],
        "tips": ["The agent (doer) is introduced with 'von + Dativ'", "Passive is very common in news, instructions, official texts", "Learn all tenses: wird (present), wurde (past), ist worden (perfect)"],
        "order_index": 7,
    },
]

VOCABULARY_DATA = [
    # A1 Vocabulary
    {"german": "die Begrüßung", "english": "greeting", "article": "die", "word_type": "noun", "level": "A1", "topic": "Begrüßung", "example_sentence": "Die Begrüßung ist sehr wichtig.", "example_translation": "The greeting is very important.", "frequency_rank": 1},
    {"german": "Hallo", "english": "Hello", "word_type": "interjection", "level": "A1", "topic": "Begrüßung", "example_sentence": "Hallo! Wie heißen Sie?", "example_translation": "Hello! What is your name?", "frequency_rank": 2},
    {"german": "Guten Morgen", "english": "Good morning", "word_type": "phrase", "level": "A1", "topic": "Begrüßung", "example_sentence": "Guten Morgen! Wie geht es Ihnen?", "example_translation": "Good morning! How are you?", "frequency_rank": 3},
    {"german": "Auf Wiedersehen", "english": "Goodbye", "word_type": "phrase", "level": "A1", "topic": "Begrüßung", "example_sentence": "Auf Wiedersehen! Bis morgen!", "example_translation": "Goodbye! Until tomorrow!", "frequency_rank": 4},
    {"german": "die Familie", "english": "family", "article": "die", "word_type": "noun", "level": "A1", "topic": "Familie", "example_sentence": "Meine Familie ist sehr groß.", "example_translation": "My family is very big.", "frequency_rank": 5},
    {"german": "die Mutter", "english": "mother", "article": "die", "word_type": "noun", "level": "A1", "topic": "Familie", "example_sentence": "Meine Mutter heißt Anna.", "example_translation": "My mother's name is Anna.", "frequency_rank": 6},
    {"german": "der Vater", "english": "father", "article": "der", "word_type": "noun", "level": "A1", "topic": "Familie", "example_sentence": "Mein Vater arbeitet als Arzt.", "example_translation": "My father works as a doctor.", "frequency_rank": 7},
    {"german": "das Kind", "english": "child", "article": "das", "word_type": "noun", "level": "A1", "topic": "Familie", "example_sentence": "Das Kind spielt im Garten.", "example_translation": "The child plays in the garden.", "frequency_rank": 8},
    {"german": "eins", "english": "one", "word_type": "number", "level": "A1", "topic": "Zahlen", "example_sentence": "Ich habe eins, zwei, drei Äpfel.", "example_translation": "I have one, two, three apples.", "frequency_rank": 9},
    {"german": "das Essen", "english": "food / meal", "article": "das", "word_type": "noun", "level": "A1", "topic": "Essen", "example_sentence": "Das Essen schmeckt sehr gut.", "example_translation": "The food tastes very good.", "frequency_rank": 10},
    # A2 Vocabulary
    {"german": "der Alltag", "english": "everyday life", "article": "der", "word_type": "noun", "level": "A2", "topic": "Alltag", "example_sentence": "Im Alltag spreche ich Deutsch.", "example_translation": "In everyday life I speak German.", "frequency_rank": 20},
    {"german": "die Reise", "english": "trip / journey", "article": "die", "word_type": "noun", "level": "A2", "topic": "Reisen", "example_sentence": "Die Reise nach Berlin war toll.", "example_translation": "The trip to Berlin was great.", "frequency_rank": 21},
    {"german": "der Termin", "english": "appointment", "article": "der", "word_type": "noun", "level": "A2", "topic": "Termine", "example_sentence": "Ich habe einen Termin beim Arzt.", "example_translation": "I have an appointment at the doctor.", "frequency_rank": 22},
    # B1 Vocabulary
    {"german": "die Gesellschaft", "english": "society", "article": "die", "word_type": "noun", "level": "B1", "topic": "Gesellschaft", "example_sentence": "In der modernen Gesellschaft ist Technologie wichtig.", "example_translation": "In modern society, technology is important.", "frequency_rank": 50},
    {"german": "die Umwelt", "english": "environment", "article": "die", "word_type": "noun", "level": "B1", "topic": "Umwelt", "example_sentence": "Wir müssen die Umwelt schützen.", "example_translation": "We must protect the environment.", "frequency_rank": 51},
    {"german": "die Meinung", "english": "opinion", "article": "die", "word_type": "noun", "level": "B1", "topic": "Kommunikation", "example_sentence": "Meiner Meinung nach ist das richtig.", "example_translation": "In my opinion, that is correct.", "frequency_rank": 52},
]

FLASHCARD_DATA = [
    {"front": "Hallo!", "back": "Hello!", "level": "A1", "topic": "Begrüßung", "card_type": "vocabulary", "hint": "Common informal greeting"},
    {"front": "Wie heißen Sie?", "back": "What is your name? (formal)", "level": "A1", "topic": "Begrüßung", "card_type": "phrase"},
    {"front": "Wie heißt du?", "back": "What is your name? (informal)", "level": "A1", "topic": "Begrüßung", "card_type": "phrase"},
    {"front": "Ich komme aus ...", "back": "I come from ...", "level": "A1", "topic": "Begrüßung", "card_type": "phrase"},
    {"front": "der Hund", "back": "the dog (masculine)", "level": "A1", "topic": "Tiere", "card_type": "vocabulary"},
    {"front": "die Katze", "back": "the cat (feminine)", "level": "A1", "topic": "Tiere", "card_type": "vocabulary"},
    {"front": "What is the Perfekt of 'fahren'?", "back": "ist gefahren", "level": "A2", "topic": "Perfekt", "card_type": "grammar"},
    {"front": "What is the Perfekt of 'essen'?", "back": "hat gegessen", "level": "A2", "topic": "Perfekt", "card_type": "grammar"},
    {"front": "Accusative of 'der Mann'?", "back": "den Mann", "level": "A2", "topic": "Akkusativ", "card_type": "grammar"},
    {"front": "Passive: 'Someone reads the book'", "back": "Das Buch wird gelesen.", "level": "B1", "topic": "Passiv", "card_type": "grammar"},
    {"front": "Konjunktiv II of 'sein'?", "back": "wäre", "level": "B1", "topic": "Konjunktiv II", "card_type": "grammar"},
    {"front": "die Meinung", "back": "opinion | Meiner Meinung nach = In my opinion", "level": "B1", "topic": "Kommunikation", "card_type": "vocabulary"},
]

MOCK_EXAM_DATA = [
    {
        "title": "Goethe A1 Full Mock Exam",
        "level": "A1",
        "description": "Complete simulation of the official Goethe Institut A1 exam with all four skills: Lesen, Hören, Schreiben, Sprechen.",
        "duration_minutes": 75,
        "passing_score": 60.0,
        "is_ai_generated": False,
        "is_published": True,
        "is_premium": False,
    },
    {
        "title": "Goethe A2 Full Mock Exam",
        "level": "A2",
        "description": "Complete simulation of the official Goethe Institut A2 exam. Tests real-world language use at elementary level.",
        "duration_minutes": 90,
        "passing_score": 60.0,
        "is_ai_generated": False,
        "is_published": True,
        "is_premium": False,
    },
    {
        "title": "Goethe B1 Full Mock Exam",
        "level": "B1",
        "description": "Complete simulation of the official Goethe Institut B1 exam. Intermediate level with complex reading, listening, writing, and speaking tasks.",
        "duration_minutes": 120,
        "passing_score": 60.0,
        "is_ai_generated": False,
        "is_published": True,
        "is_premium": True,
    },
]


async def seed_database(db: AsyncSession) -> None:
    from sqlalchemy import text

    # Check if data already exists
    result = await db.execute(text("SELECT COUNT(*) FROM courses"))
    count = result.scalar()
    if count and count > 0:
        print("Database already seeded, skipping.")
        return

    print("Seeding database...")

    # Insert courses and topics
    for course_data in COURSES_DATA:
        topics = course_data.pop("topics", [])
        result = await db.execute(
            text("""INSERT INTO courses (title, description, level, order_index, is_published, is_premium, total_lessons, estimated_hours, xp_reward, tags)
                    VALUES (:title, :description, :level, :order_index, :is_published, :is_premium, :total_lessons, :estimated_hours, :xp_reward, :tags::json)
                    RETURNING id"""),
            {**course_data, "tags": str(course_data["tags"]).replace("'", '"')}
        )
        course_id = result.scalar()
        for topic in topics:
            await db.execute(
                text("""INSERT INTO topics (course_id, title, title_german, icon, order_index, xp_reward)
                        VALUES (:course_id, :title, :title_german, :icon, :order_index, 50)"""),
                {"course_id": course_id, **topic}
            )

    # Insert grammar rules
    for rule in GRAMMAR_DATA:
        import json
        await db.execute(
            text("""INSERT INTO grammar_rules (title, category, level, explanation, formula, examples, tips, order_index)
                    VALUES (:title, :category, :level, :explanation, :formula, :examples::json, :tips::json, :order_index)"""),
            {**rule, "examples": json.dumps(rule["examples"]), "tips": json.dumps(rule["tips"])}
        )

    # Insert vocabulary
    for word in VOCABULARY_DATA:
        await db.execute(
            text("""INSERT INTO vocabulary (german, english, article, word_type, level, topic, example_sentence, example_translation, frequency_rank, synonyms, conjugations, tags)
                    VALUES (:german, :english, :article, :word_type, :level, :topic, :example_sentence, :example_translation, :frequency_rank, '[]'::json, '{}'::json, '[]'::json)"""),
            {"article": None, **word}
        )

    # Insert flashcard decks and flashcards
    for level in ["A1", "A2", "B1"]:
        result = await db.execute(
            text("""INSERT INTO flashcard_decks (title, description, level, card_count)
                    VALUES (:title, :description, :level, :count) RETURNING id"""),
            {"title": f"{level} Essential Flashcards", "description": f"Core vocabulary and grammar cards for {level} learners", "level": level, "count": sum(1 for f in FLASHCARD_DATA if f["level"] == level)}
        )
        deck_id = result.scalar()
        for card in FLASHCARD_DATA:
            if card["level"] == level:
                await db.execute(
                    text("""INSERT INTO flashcards (deck_id, front, back, level, topic, card_type, hint, tags)
                            VALUES (:deck_id, :front, :back, :level, :topic, :card_type, :hint, '[]'::json)"""),
                    {"deck_id": deck_id, "hint": None, **card}
                )

    # Insert mock exams
    for exam in MOCK_EXAM_DATA:
        await db.execute(
            text("""INSERT INTO mock_exams (title, level, description, duration_minutes, passing_score, is_ai_generated, is_published, is_premium)
                    VALUES (:title, :level, :description, :duration_minutes, :passing_score, :is_ai_generated, :is_published, :is_premium)"""),
            exam
        )

    await db.commit()
    print("Database seeded successfully!")


async def main():
    async with async_session_maker() as db:
        await seed_database(db)


if __name__ == "__main__":
    asyncio.run(main())
