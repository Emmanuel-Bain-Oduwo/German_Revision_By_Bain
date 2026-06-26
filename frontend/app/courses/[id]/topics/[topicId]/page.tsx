"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Zap, BookOpen,
  Volume2, ChevronRight, RotateCcw, Trophy, Star
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

interface VocabCard {
  german: string;
  english: string;
  example?: string;
  exampleTranslation?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface LessonSection {
  type: "intro" | "vocab" | "grammar" | "quiz";
  title: string;
  content?: string;
  vocab?: VocabCard[];
  grammar?: { rule: string; examples: { german: string; english: string }[] }[];
  questions?: QuizQuestion[];
}

interface TopicLesson {
  id: number;
  courseId: number;
  title: string;
  titleGerman: string;
  icon: string;
  xpReward: number;
  sections: LessonSection[];
}

const TOPIC_LESSONS: Record<string, TopicLesson> = {
  "1": {
    id: 1, courseId: 1, title: "Greetings & Introductions", titleGerman: "Begrüßungen",
    icon: "👋", xpReward: 40,
    sections: [
      {
        type: "intro", title: "Welcome to Greetings!",
        content: "In this lesson you'll learn how to greet people in German, introduce yourself, and say goodbye. These are the first words you'll use every single day in German-speaking countries.",
      },
      {
        type: "vocab", title: "Key Vocabulary",
        vocab: [
          { german: "Hallo", english: "Hello", example: "Hallo! Wie geht es Ihnen?", exampleTranslation: "Hello! How are you?" },
          { german: "Guten Morgen", english: "Good morning", example: "Guten Morgen, Herr Müller!", exampleTranslation: "Good morning, Mr. Müller!" },
          { german: "Guten Tag", english: "Good day / Hello", example: "Guten Tag! Ich bin Anna.", exampleTranslation: "Good day! I am Anna." },
          { german: "Guten Abend", english: "Good evening", example: "Guten Abend! Wie heißen Sie?", exampleTranslation: "Good evening! What is your name?" },
          { german: "Auf Wiedersehen", english: "Goodbye (formal)", example: "Auf Wiedersehen und danke!", exampleTranslation: "Goodbye and thank you!" },
          { german: "Tschüss", english: "Bye (informal)", example: "Tschüss! Bis morgen.", exampleTranslation: "Bye! See you tomorrow." },
          { german: "Wie heißen Sie?", english: "What is your name? (formal)", example: "Wie heißen Sie, bitte?", exampleTranslation: "What is your name, please?" },
          { german: "Ich heiße ...", english: "My name is ...", example: "Ich heiße Thomas Schmidt.", exampleTranslation: "My name is Thomas Schmidt." },
          { german: "Woher kommen Sie?", english: "Where are you from? (formal)", example: "Woher kommen Sie? – Ich komme aus Deutschland.", exampleTranslation: "Where are you from? – I am from Germany." },
          { german: "Freut mich!", english: "Nice to meet you!", example: "Ich bin Maria. – Freut mich!", exampleTranslation: "I am Maria. – Nice to meet you!" },
        ],
      },
      {
        type: "grammar", title: "Grammar: Verb 'sein' (to be)",
        grammar: [
          {
            rule: "The verb 'sein' (to be) is essential for introductions. It is irregular — memorise these forms:",
            examples: [
              { german: "Ich bin Anna.", english: "I am Anna." },
              { german: "Du bist nett.", english: "You are nice. (informal)" },
              { german: "Er/Sie/Es ist Lehrer.", english: "He/She/It is a teacher." },
              { german: "Wir sind aus Berlin.", english: "We are from Berlin." },
              { german: "Sie sind Herr Koch?", english: "You are Mr Koch? (formal)" },
            ],
          },
          {
            rule: "Use formal 'Sie' with strangers and in professional settings. Use informal 'du' with friends and family.",
            examples: [
              { german: "Wie heißen Sie? (formal)", english: "What is your name?" },
              { german: "Wie heißt du? (informal)", english: "What is your name?" },
            ],
          },
        ],
      },
      {
        type: "quiz", title: "Test Your Knowledge",
        questions: [
          { question: "How do you say 'Good morning' in German?", options: ["Guten Abend", "Guten Morgen", "Auf Wiedersehen", "Tschüss"], correct: 1, explanation: "'Guten Morgen' is used in the morning hours." },
          { question: "Which phrase means 'My name is ...'?", options: ["Wie heißen Sie?", "Woher kommen Sie?", "Ich heiße ...", "Freut mich!"], correct: 2, explanation: "'Ich heiße ...' literally means 'I am called ...'." },
          { question: "Fill in the blank: 'Ich ___ Anna.'", options: ["bist", "sind", "bin", "ist"], correct: 2, explanation: "'Ich bin' = I am. 'Sein' is irregular: ich bin, du bist, er/sie/es ist." },
          { question: "Which goodbye is formal?", options: ["Tschüss", "Ciao", "Auf Wiedersehen", "Bis später"], correct: 2, explanation: "'Auf Wiedersehen' (lit. 'Until we see each other again') is the formal farewell." },
          { question: "How do you ask 'Where are you from?' (formal)?", options: ["Wie heißen Sie?", "Woher kommen Sie?", "Wie geht es Ihnen?", "Was ist das?"], correct: 1, explanation: "'Woher kommen Sie?' uses 'woher' (from where) + 'kommen' (come) + formal 'Sie'." },
        ],
      },
    ],
  },
  "2": {
    id: 2, courseId: 1, title: "Numbers, Dates & Time", titleGerman: "Zahlen, Datum und Uhrzeit",
    icon: "🔢", xpReward: 40,
    sections: [
      { type: "intro", title: "Numbers, Dates & Time", content: "Mastering numbers is fundamental. You'll use them for prices, addresses, phone numbers, times, and dates. Let's build this essential skill step by step." },
      {
        type: "vocab", title: "Numbers 0–20",
        vocab: [
          { german: "null / eins / zwei", english: "0 / 1 / 2" },
          { german: "drei / vier / fünf", english: "3 / 4 / 5" },
          { german: "sechs / sieben / acht", english: "6 / 7 / 8" },
          { german: "neun / zehn", english: "9 / 10" },
          { german: "elf / zwölf", english: "11 / 12" },
          { german: "dreizehn / vierzehn / fünfzehn", english: "13 / 14 / 15" },
          { german: "sechzehn / siebzehn / achtzehn", english: "16 / 17 / 18" },
          { german: "neunzehn / zwanzig", english: "19 / 20" },
          { german: "dreißig / vierzig / fünfzig", english: "30 / 40 / 50" },
          { german: "hundert / tausend", english: "100 / 1000", example: "Es kostet zwanzig Euro.", exampleTranslation: "It costs twenty euros." },
        ],
      },
      {
        type: "vocab", title: "Time & Dates",
        vocab: [
          { german: "Wie viel Uhr ist es?", english: "What time is it?", example: "Es ist drei Uhr.", exampleTranslation: "It is three o'clock." },
          { german: "Es ist halb vier.", english: "It is half past three. (3:30)", example: "Wann beginnt der Kurs? – Um halb neun.", exampleTranslation: "When does the course begin? – At half past eight." },
          { german: "Montag / Dienstag", english: "Monday / Tuesday" },
          { german: "Mittwoch / Donnerstag", english: "Wednesday / Thursday" },
          { german: "Freitag / Samstag / Sonntag", english: "Friday / Saturday / Sunday" },
          { german: "Januar / Februar / März", english: "January / February / March" },
          { german: "April / Mai / Juni", english: "April / May / June" },
          { german: "Juli / August / September", english: "July / August / September" },
          { german: "Oktober / November / Dezember", english: "October / November / December" },
          { german: "Welches Datum ist heute?", english: "What is today's date?", example: "Heute ist der erste Januar.", exampleTranslation: "Today is the first of January." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Numbers & Time",
        questions: [
          { question: "What is 'fifteen' in German?", options: ["fünfzig", "fünfzehn", "fünf", "vierzig"], correct: 1 },
          { question: "'Es ist halb vier' means:", options: ["It is 4:30", "It is 3:30", "It is 4:00", "It is 3:00"], correct: 1, explanation: "'Halb vier' = half to four = 3:30. German half-hours count TO the next hour." },
          { question: "What is 'Wednesday' in German?", options: ["Dienstag", "Donnerstag", "Mittwoch", "Freitag"], correct: 2 },
          { question: "How do you say 100 in German?", options: ["tausend", "zehn", "hundert", "zwanzig"], correct: 2 },
          { question: "'Welches Datum ist heute?' means:", options: ["What time is it?", "What day is it?", "What is today's date?", "When is your birthday?"], correct: 2 },
        ],
      },
    ],
  },
  "3": {
    id: 3, courseId: 1, title: "Family & Personal Details", titleGerman: "Familie und Personen",
    icon: "👨‍👩‍👧", xpReward: 40,
    sections: [
      { type: "intro", title: "Family & Personal Details", content: "In this lesson you'll learn vocabulary for family members and how to talk about personal information like age, nationality, and occupation." },
      {
        type: "vocab", title: "Family Members",
        vocab: [
          { german: "die Familie", english: "the family", example: "Meine Familie ist groß.", exampleTranslation: "My family is big." },
          { german: "die Mutter / der Vater", english: "the mother / the father" },
          { german: "die Eltern", english: "the parents (plural)" },
          { german: "die Schwester / der Bruder", english: "the sister / the brother" },
          { german: "die Geschwister", english: "the siblings (plural)" },
          { german: "die Tochter / der Sohn", english: "the daughter / the son" },
          { german: "die Großmutter / der Großvater", english: "the grandmother / the grandfather", example: "Meine Großmutter heißt Helga.", exampleTranslation: "My grandmother is called Helga." },
          { german: "die Frau / der Mann", english: "the wife / the husband" },
          { german: "Wie alt sind Sie?", english: "How old are you? (formal)", example: "Ich bin dreißig Jahre alt.", exampleTranslation: "I am thirty years old." },
          { german: "Was sind Sie von Beruf?", english: "What is your occupation?", example: "Ich bin Ärztin.", exampleTranslation: "I am a doctor (f)." },
        ],
      },
      {
        type: "grammar", title: "Grammar: Possessive Pronouns",
        grammar: [
          {
            rule: "Use possessive pronouns to talk about family: mein (my), dein (your-informal), sein (his), ihr (her), unser (our), Ihr (your-formal).",
            examples: [
              { german: "Das ist mein Bruder.", english: "That is my brother." },
              { german: "Meine Schwester heißt Lisa.", english: "My sister is called Lisa." },
              { german: "Sein Vater kommt aus Polen.", english: "His father comes from Poland." },
              { german: "Unser Haus ist groß.", english: "Our house is big." },
            ],
          },
        ],
      },
      {
        type: "quiz", title: "Quiz: Family",
        questions: [
          { question: "What is 'the grandmother' in German?", options: ["die Mutter", "die Schwester", "die Großmutter", "die Tochter"], correct: 2 },
          { question: "'Wie alt sind Sie?' means:", options: ["Where are you from?", "What is your name?", "How old are you?", "What do you do?"], correct: 2 },
          { question: "Fill in: '___ Bruder heißt Max.' (My brother)", options: ["Sein", "Mein", "Ihr", "Dein"], correct: 1 },
          { question: "What is 'the siblings' in German?", options: ["die Eltern", "die Geschwister", "die Kinder", "die Familie"], correct: 1 },
          { question: "'Ich bin Ärztin.' means:", options: ["I am a teacher (f)", "I am a student", "I am a doctor (f)", "I am an engineer"], correct: 2 },
        ],
      },
    ],
  },
  "4": {
    id: 4, courseId: 1, title: "Food, Drink & Shopping", titleGerman: "Essen, Trinken und Einkaufen",
    icon: "🛒", xpReward: 40,
    sections: [
      { type: "intro", title: "Food, Drink & Shopping", content: "Food vocabulary is essential for daily life in Germany. Learn how to order in a restaurant, shop at a supermarket, and talk about your favourite foods." },
      {
        type: "vocab", title: "Food & Drink",
        vocab: [
          { german: "das Brot", english: "the bread", example: "Ich esse gern Brot.", exampleTranslation: "I like eating bread." },
          { german: "die Wurst", english: "the sausage" },
          { german: "der Käse", english: "the cheese" },
          { german: "das Fleisch", english: "the meat" },
          { german: "das Gemüse", english: "the vegetables" },
          { german: "das Obst", english: "the fruit" },
          { german: "das Wasser / der Saft", english: "the water / the juice" },
          { german: "der Kaffee / der Tee", english: "the coffee / the tea", example: "Ich trinke gern Kaffee.", exampleTranslation: "I like drinking coffee." },
          { german: "Was kostet das?", english: "How much does that cost?", example: "Was kostet das Brot? – Es kostet zwei Euro.", exampleTranslation: "How much is the bread? – It costs two euros." },
          { german: "Ich hätte gern ...", english: "I would like ...", example: "Ich hätte gern einen Kaffee, bitte.", exampleTranslation: "I would like a coffee, please." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Food & Shopping",
        questions: [
          { question: "What is 'the bread' in German?", options: ["das Fleisch", "die Wurst", "das Brot", "der Käse"], correct: 2 },
          { question: "'Was kostet das?' means:", options: ["Where is the market?", "How much does that cost?", "Do you have bread?", "I would like..."], correct: 1 },
          { question: "'Ich hätte gern ...' is used to:", options: ["Ask a price", "Say you don't like something", "Order something politely", "Say goodbye"], correct: 2 },
          { question: "What is 'the vegetables' in German?", options: ["das Obst", "das Gemüse", "die Wurst", "der Saft"], correct: 1 },
          { question: "'Ich esse gern Brot' means:", options: ["I don't eat bread", "I am eating bread now", "I like eating bread", "I want to buy bread"], correct: 2 },
        ],
      },
    ],
  },
  "5": {
    id: 5, courseId: 1, title: "Home & Living", titleGerman: "Wohnen und Zuhause",
    icon: "🏠", xpReward: 40,
    sections: [
      { type: "intro", title: "Home & Living", content: "Learn vocabulary for rooms, furniture, and how to describe where you live." },
      {
        type: "vocab", title: "Rooms & Home",
        vocab: [
          { german: "die Wohnung", english: "the flat/apartment", example: "Meine Wohnung ist klein.", exampleTranslation: "My flat is small." },
          { german: "das Haus", english: "the house" },
          { german: "das Zimmer", english: "the room" },
          { german: "die Küche", english: "the kitchen" },
          { german: "das Schlafzimmer", english: "the bedroom" },
          { german: "das Badezimmer", english: "the bathroom" },
          { german: "das Wohnzimmer", english: "the living room" },
          { german: "der Tisch / der Stuhl", english: "the table / the chair" },
          { german: "das Bett / der Schrank", english: "the bed / the wardrobe" },
          { german: "Wo wohnen Sie?", english: "Where do you live?", example: "Ich wohne in München.", exampleTranslation: "I live in Munich." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Home",
        questions: [
          { question: "What is 'the kitchen' in German?", options: ["das Zimmer", "die Küche", "das Bad", "der Keller"], correct: 1 },
          { question: "'Ich wohne in Berlin.' means:", options: ["I work in Berlin", "I live in Berlin", "I am from Berlin", "I visit Berlin"], correct: 1 },
          { question: "What is 'the bedroom' in German?", options: ["das Wohnzimmer", "das Badezimmer", "das Schlafzimmer", "das Esszimmer"], correct: 2 },
          { question: "'Meine Wohnung ist groß.' means:", options: ["My house is small", "My flat is big", "My room is nice", "My flat is cheap"], correct: 1 },
          { question: "What is 'the table' in German?", options: ["der Stuhl", "das Bett", "der Tisch", "der Schrank"], correct: 2 },
        ],
      },
    ],
  },
  "6": {
    id: 6, courseId: 1, title: "Articles: der, die, das", titleGerman: "Artikel",
    icon: "📝", xpReward: 50,
    sections: [
      { type: "intro", title: "German Articles", content: "German has three grammatical genders: masculine (der), feminine (die), and neuter (das). Learning the correct article with each noun is one of the most important habits to build from the start." },
      {
        type: "grammar", title: "The Three Articles",
        grammar: [
          {
            rule: "Every German noun has a gender. There are no absolute rules — you must learn the article with the noun. Tip: write every new noun with its article!",
            examples: [
              { german: "der Mann (masculine)", english: "the man" },
              { german: "die Frau (feminine)", english: "the woman" },
              { german: "das Kind (neuter)", english: "the child" },
              { german: "der Hund", english: "the dog" },
              { german: "die Katze", english: "the cat" },
              { german: "das Haus", english: "the house" },
            ],
          },
          {
            rule: "The indefinite article is ein/eine/ein (a/an). 'Kein/keine/kein' means 'no' or 'not a'.",
            examples: [
              { german: "Das ist ein Mann.", english: "That is a man." },
              { german: "Das ist eine Frau.", english: "That is a woman." },
              { german: "Das ist kein Kind.", english: "That is not a child." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Common Nouns with Articles",
        vocab: [
          { german: "der Hund", english: "the dog (m)" },
          { german: "die Katze", english: "the cat (f)" },
          { german: "das Buch", english: "the book (n)" },
          { german: "der Lehrer", english: "the teacher (m)" },
          { german: "die Lehrerin", english: "the teacher (f)" },
          { german: "das Auto", english: "the car (n)" },
          { german: "der Bahnhof", english: "the train station (m)" },
          { german: "die Stadt", english: "the city (f)" },
          { german: "das Land", english: "the country (n)" },
          { german: "der Kurs", english: "the course (m)" },
        ],
      },
      {
        type: "quiz", title: "Quiz: Articles",
        questions: [
          { question: "What is the correct article for 'Frau' (woman)?", options: ["der", "die", "das", "ein"], correct: 1 },
          { question: "What is the correct article for 'Kind' (child)?", options: ["der", "die", "das", "eine"], correct: 2 },
          { question: "Which is correct? ___ Hund ist groß.", options: ["Das", "Die", "Der", "Ein"], correct: 2, explanation: "'Hund' is masculine: der Hund." },
          { question: "'Das ist eine Katze.' means:", options: ["That is a dog", "That is a woman", "That is a cat", "That is a child"], correct: 2 },
          { question: "What does 'kein' indicate?", options: ["Definite article", "Feminine noun", "Negation (not a/no)", "Plural"], correct: 2 },
        ],
      },
    ],
  },
  "7": {
    id: 7, courseId: 1, title: "Present Tense Verbs", titleGerman: "Präsens",
    icon: "⚡", xpReward: 50,
    sections: [
      { type: "intro", title: "Present Tense (Präsens)", content: "The present tense in German is used for current actions, habits, and even future events. Regular verbs follow a predictable pattern — master this and you can conjugate hundreds of verbs!" },
      {
        type: "grammar", title: "Regular Verb Conjugation",
        grammar: [
          {
            rule: "Regular verbs take these endings: -e, -st, -t, -en, -t, -en. Remove the infinitive -en ending, then add these endings to the stem.",
            examples: [
              { german: "ich wohne (I live)", english: "wohnen → stem: wonh-" },
              { german: "du wohnst (you live)", english: "" },
              { german: "er/sie/es wohnt (he/she/it lives)", english: "" },
              { german: "wir wohnen (we live)", english: "" },
              { german: "ihr wohnt (you all live)", english: "" },
              { german: "sie/Sie wohnen (they/you-formal live)", english: "" },
            ],
          },
          {
            rule: "Common irregular verbs: haben (to have) and sein (to be) are essential and irregular.",
            examples: [
              { german: "ich habe / du hast / er hat", english: "I have / you have / he has" },
              { german: "ich bin / du bist / er ist", english: "I am / you are / he is" },
              { german: "Ich habe einen Hund.", english: "I have a dog." },
              { german: "Sie ist Lehrerin.", english: "She is a teacher." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Common Verbs",
        vocab: [
          { german: "wohnen", english: "to live", example: "Wo wohnst du?", exampleTranslation: "Where do you live?" },
          { german: "arbeiten", english: "to work", example: "Er arbeitet in Berlin.", exampleTranslation: "He works in Berlin." },
          { german: "lernen", english: "to learn/study", example: "Wir lernen Deutsch.", exampleTranslation: "We are learning German." },
          { german: "kommen", english: "to come", example: "Sie kommt aus Österreich.", exampleTranslation: "She comes from Austria." },
          { german: "spielen", english: "to play", example: "Die Kinder spielen.", exampleTranslation: "The children are playing." },
          { german: "trinken", english: "to drink" },
          { german: "essen", english: "to eat" },
          { german: "schreiben", english: "to write" },
          { german: "lesen", english: "to read" },
          { german: "sprechen", english: "to speak", example: "Ich spreche Deutsch und Englisch.", exampleTranslation: "I speak German and English." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Present Tense",
        questions: [
          { question: "'Wir ___ Deutsch.' (lernen)", options: ["lernst", "lernt", "lernen", "lerne"], correct: 2, explanation: "wir + -en ending → wir lernen." },
          { question: "Conjugate 'arbeiten' for 'er':", options: ["arbeitest", "arbeite", "arbeiten", "arbeitet"], correct: 3 },
          { question: "'Ich habe einen Hund.' means:", options: ["I want a dog", "I am a dog", "I have a dog", "I like dogs"], correct: 2 },
          { question: "What is the stem of 'wohnen'?", options: ["wohn-", "wohne-", "wohnen-", "woh-"], correct: 0 },
          { question: "'Sie kommt aus Österreich.' means:", options: ["She works in Austria", "She lives in Austria", "She comes from Austria", "She is going to Austria"], correct: 2 },
        ],
      },
    ],
  },
  "8": {
    id: 8, courseId: 1, title: "Negation: nicht & kein", titleGerman: "Verneinung",
    icon: "❌", xpReward: 40,
    sections: [
      { type: "intro", title: "Negation in German", content: "German uses two main words for negation: 'nicht' (not) and 'kein' (no/not a). Choosing the right one depends on what you're negating." },
      {
        type: "grammar", title: "nicht vs. kein",
        grammar: [
          {
            rule: "Use 'nicht' to negate verbs, adjectives, adverbs, and nouns with a definite article. It usually goes near the end of the clause.",
            examples: [
              { german: "Ich arbeite nicht.", english: "I don't work." },
              { german: "Das ist nicht richtig.", english: "That is not correct." },
              { german: "Ich kenne den Mann nicht.", english: "I don't know the man." },
            ],
          },
          {
            rule: "Use 'kein/keine/kein' to negate nouns that have an indefinite article (ein/eine) or no article. It replaces the article.",
            examples: [
              { german: "Ich habe kein Auto.", english: "I don't have a car. (das Auto)" },
              { german: "Das ist keine Katze.", english: "That is not a cat. (die Katze)" },
              { german: "Er hat keinen Hund.", english: "He doesn't have a dog. (der Hund → keinen in accusative)" },
              { german: "Ich habe keine Zeit.", english: "I have no time." },
            ],
          },
        ],
      },
      {
        type: "quiz", title: "Quiz: Negation",
        questions: [
          { question: "'Ich arbeite ___.' (I don't work)", options: ["kein", "keine", "nicht", "keinen"], correct: 2 },
          { question: "'Ich habe ___ Auto.' (I don't have a car — das Auto)", options: ["nicht", "kein", "keine", "keinen"], correct: 1, explanation: "das Auto → kein Auto (neuter)" },
          { question: "'Das ist ___ Katze.' (That is not a cat — die Katze)", options: ["kein", "keinen", "nicht", "keine"], correct: 3 },
          { question: "When do you use 'nicht'?", options: ["To negate nouns with no article", "To negate verbs and adjectives", "Only with plural nouns", "Before the subject"], correct: 1 },
          { question: "'Er hat keine Zeit.' means:", options: ["He has a lot of time", "He has no time", "He doesn't work", "He is not here"], correct: 1 },
        ],
      },
    ],
  },
  "9": {
    id: 9, courseId: 1, title: "Accusative Case", titleGerman: "Akkusativ",
    icon: "🎯", xpReward: 50,
    sections: [
      { type: "intro", title: "The Accusative Case (Akkusativ)", content: "German has four cases. The accusative is used for the direct object of a sentence — the thing being acted upon. Only masculine articles change in the accusative!" },
      {
        type: "grammar", title: "Accusative Articles",
        grammar: [
          {
            rule: "In the accusative, only the masculine definite article changes: der → den. The indefinite article ein → einen.",
            examples: [
              { german: "Ich sehe den Mann. (m)", english: "I see the man. (der → den)" },
              { german: "Ich sehe die Frau. (f)", english: "I see the woman. (die stays die)" },
              { german: "Ich sehe das Kind. (n)", english: "I see the child. (das stays das)" },
              { german: "Ich kaufe einen Apfel.", english: "I buy an apple. (ein → einen, masculine)" },
              { german: "Ich kaufe eine Zeitung.", english: "I buy a newspaper. (eine stays eine)" },
            ],
          },
          {
            rule: "Common accusative prepositions: durch (through), für (for), gegen (against), ohne (without), um (around/at).",
            examples: [
              { german: "Das Geschenk ist für meinen Vater.", english: "The gift is for my father." },
              { german: "Ich gehe durch den Park.", english: "I walk through the park." },
              { german: "Ohne einen Regenschirm gehe ich nicht.", english: "I don't go without an umbrella." },
            ],
          },
        ],
      },
      {
        type: "quiz", title: "Quiz: Accusative",
        questions: [
          { question: "'Ich sehe ___ Mann.' (accusative)", options: ["der", "die", "das", "den"], correct: 3, explanation: "Masculine article der → den in the accusative." },
          { question: "'Ich kaufe ___ Apfel.' (m, indefinite)", options: ["ein", "einen", "eine", "einem"], correct: 1 },
          { question: "Which article does NOT change in the accusative?", options: ["der (masculine)", "die (feminine)", "der (all genders)", "ein (masculine)"], correct: 1 },
          { question: "'Das Geschenk ist für ___ Mutter.' (f)", options: ["mein", "meinen", "meine", "meinem"], correct: 2 },
          { question: "Which preposition ALWAYS takes accusative?", options: ["mit", "aus", "für", "bei"], correct: 2 },
        ],
      },
    ],
  },
  "10": {
    id: 10, courseId: 1, title: "W-Questions", titleGerman: "W-Fragen",
    icon: "❓", xpReward: 40,
    sections: [
      { type: "intro", title: "W-Questions (W-Fragen)", content: "Question words starting with 'W' are essential for asking anything in German. Master these and you can ask for any information you need!" },
      {
        type: "vocab", title: "Question Words",
        vocab: [
          { german: "Wer?", english: "Who?", example: "Wer ist das?", exampleTranslation: "Who is that?" },
          { german: "Was?", english: "What?", example: "Was machst du?", exampleTranslation: "What are you doing?" },
          { german: "Wo?", english: "Where? (location)", example: "Wo wohnst du?", exampleTranslation: "Where do you live?" },
          { german: "Woher?", english: "Where from?", example: "Woher kommen Sie?", exampleTranslation: "Where are you from?" },
          { german: "Wohin?", english: "Where to?", example: "Wohin gehst du?", exampleTranslation: "Where are you going?" },
          { german: "Wann?", english: "When?", example: "Wann beginnt der Kurs?", exampleTranslation: "When does the course start?" },
          { german: "Wie?", english: "How?", example: "Wie heißen Sie?", exampleTranslation: "What is your name?" },
          { german: "Wie viel?", english: "How much?", example: "Wie viel kostet das?", exampleTranslation: "How much does that cost?" },
          { german: "Warum?", english: "Why?", example: "Warum lernst du Deutsch?", exampleTranslation: "Why are you learning German?" },
          { german: "Welche/r/s?", english: "Which?", example: "Welchen Kurs nimmst du?", exampleTranslation: "Which course are you taking?" },
        ],
      },
      {
        type: "quiz", title: "Quiz: W-Questions",
        questions: [
          { question: "Which word asks 'Where from?'", options: ["Wo?", "Wohin?", "Woher?", "Wann?"], correct: 2 },
          { question: "'Wann beginnt der Kurs?' means:", options: ["Where does the course start?", "Who starts the course?", "When does the course start?", "How does the course start?"], correct: 2 },
          { question: "Which word asks 'Why?'", options: ["Wie?", "Warum?", "Was?", "Wer?"], correct: 1 },
          { question: "'Wie viel kostet das?' means:", options: ["How old is that?", "How much does that cost?", "What is that?", "Who pays that?"], correct: 1 },
          { question: "'Wohin gehst du?' asks about:", options: ["Location", "Time", "Direction/destination", "Reason"], correct: 2 },
        ],
      },
    ],
  },
  "11": {
    id: 11, courseId: 1, title: "Colours, Clothes & Weather", titleGerman: "Farben, Kleidung und Wetter",
    icon: "🌤️", xpReward: 40,
    sections: [
      { type: "intro", title: "Colours, Clothes & Weather", content: "This topic covers everyday descriptive vocabulary — colours, clothing items, and weather expressions essential for daily conversation." },
      {
        type: "vocab", title: "Colours & Clothes",
        vocab: [
          { german: "rot / blau / grün", english: "red / blue / green" },
          { german: "gelb / schwarz / weiß", english: "yellow / black / white" },
          { german: "das T-Shirt / die Hose", english: "the T-shirt / the trousers", example: "Ich trage eine blaue Hose.", exampleTranslation: "I am wearing blue trousers." },
          { german: "das Kleid / der Rock", english: "the dress / the skirt" },
          { german: "der Mantel / die Jacke", english: "the coat / the jacket" },
          { german: "die Schuhe (pl)", english: "the shoes" },
          { german: "Wie ist das Wetter?", english: "What is the weather like?", example: "Es ist sonnig.", exampleTranslation: "It is sunny." },
          { german: "Es regnet.", english: "It is raining." },
          { german: "Es schneit.", english: "It is snowing." },
          { german: "Es ist kalt / warm / heiß.", english: "It is cold / warm / hot." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Colours, Clothes & Weather",
        questions: [
          { question: "What is 'blue' in German?", options: ["rot", "grün", "blau", "gelb"], correct: 2 },
          { question: "'Es regnet.' means:", options: ["It is snowing", "It is raining", "It is sunny", "It is windy"], correct: 1 },
          { question: "What is 'the jacket' in German?", options: ["der Mantel", "das Kleid", "die Jacke", "die Hose"], correct: 2 },
          { question: "'Ich trage ein rotes T-Shirt.' means:", options: ["I like red T-shirts", "I am wearing a red T-shirt", "I want a red T-shirt", "I have a red T-shirt"], correct: 1 },
          { question: "'Es ist kalt.' means:", options: ["It is warm", "It is cold", "It is hot", "It is cloudy"], correct: 1 },
        ],
      },
    ],
  },
  "12": {
    id: 12, courseId: 1, title: "A1 Goethe Exam Practice", titleGerman: "Goethe A1 Prüfungsvorbereitung",
    icon: "🏆", xpReward: 90,
    sections: [
      { type: "intro", title: "A1 Exam Practice", content: "The Goethe-Zertifikat A1 tests reading (Lesen), listening (Hören), writing (Schreiben), and speaking (Sprechen). This practice session focuses on the reading and writing components with exam-style questions." },
      {
        type: "vocab", title: "Key Exam Phrases",
        vocab: [
          { german: "Bitte ergänzen Sie.", english: "Please complete / fill in." },
          { german: "Kreuzen Sie an.", english: "Put a cross / tick." },
          { german: "Richtig oder Falsch?", english: "True or False?" },
          { german: "Lesen Sie den Text.", english: "Read the text." },
          { german: "Schreiben Sie einen Satz.", english: "Write a sentence." },
          { german: "Hören Sie zu.", english: "Listen." },
          { german: "Sprechen Sie nach.", english: "Repeat after me." },
          { german: "Entschuldigung!", english: "Excuse me!" },
          { german: "Ich verstehe das nicht.", english: "I don't understand that." },
          { german: "Können Sie das wiederholen?", english: "Can you repeat that?" },
        ],
      },
      {
        type: "quiz", title: "A1 Exam-Style Questions",
        questions: [
          { question: "A friend says: 'Ich heiße Petra. Ich komme aus Wien.' Where is Petra from?", options: ["Berlin", "Wien (Vienna)", "München", "Hamburg"], correct: 1 },
          { question: "Sign reads: 'Geöffnet: Mo–Fr 9–18 Uhr'. Is the shop open on Sunday?", options: ["Yes, all day", "Yes, in the morning", "No, closed on Sunday", "Only in the evening"], correct: 2, explanation: "Mo–Fr = Monday to Friday. Sunday (Sonntag) is not listed." },
          { question: "'Ich habe keine Geschwister.' This person has:", options: ["Many siblings", "One sibling", "No siblings", "Two siblings"], correct: 2 },
          { question: "Maria writes: 'Ich wohne in einer kleinen Wohnung. Sie hat drei Zimmer.' How many rooms?", options: ["One", "Two", "Three", "Four"], correct: 2 },
          { question: "Tom says 'Ich trinke gern Kaffee, aber ich esse kein Fleisch.' What does Tom NOT eat?", options: ["Coffee", "Bread", "Meat", "Vegetables"], correct: 2 },
        ],
      },
    ],
  },

  // ── A2 Topics ──────────────────────────────────────────────────────────────

  "13": {
    id: 13, courseId: 2, title: "Modal Verbs", titleGerman: "Modalverben",
    icon: "🔧", xpReward: 50,
    sections: [
      {
        type: "intro", title: "Modal Verbs (Modalverben)",
        content: "Modal verbs express ability, permission, obligation, or desire. They are always paired with a main verb in the infinitive, which goes to the END of the sentence. There are six core modal verbs in German — mastering them unlocks a huge range of expression.",
      },
      {
        type: "grammar", title: "The Six Modal Verbs",
        grammar: [
          {
            rule: "können (can/to be able to) — ich kann, du kannst, er/sie/es kann, wir können, ihr könnt, sie/Sie können",
            examples: [
              { german: "Ich kann Deutsch sprechen.", english: "I can speak German." },
              { german: "Kannst du mir helfen?", english: "Can you help me?" },
              { german: "Er kann nicht kommen.", english: "He cannot come." },
            ],
          },
          {
            rule: "müssen (must/have to), wollen (want to), sollen (should/supposed to), dürfen (may/allowed to), möchten (would like to)",
            examples: [
              { german: "Ich muss jetzt gehen.", english: "I have to go now." },
              { german: "Sie will Ärztin werden.", english: "She wants to become a doctor." },
              { german: "Du sollst pünktlich sein.", english: "You should be on time." },
              { german: "Hier darf man nicht rauchen.", english: "One may not smoke here." },
              { german: "Ich möchte einen Kaffee, bitte.", english: "I would like a coffee, please." },
            ],
          },
          {
            rule: "Word order: the modal verb takes position 2 (conjugated), and the infinitive of the main verb goes to the END of the clause.",
            examples: [
              { german: "Ich kann heute nicht arbeiten.", english: "I cannot work today." },
              { german: "Wir müssen das Formular ausfüllen.", english: "We must fill in the form." },
              { german: "Darf ich bitte die Rechnung haben?", english: "May I have the bill, please?" },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Key Phrases with Modals",
        vocab: [
          { german: "Kann ich Ihnen helfen?", english: "Can I help you?", example: "Kann ich Ihnen helfen? – Ja, bitte!", exampleTranslation: "Can I help you? – Yes, please!" },
          { german: "Ich muss das lernen.", english: "I have to learn that." },
          { german: "Darf ich reinkommen?", english: "May I come in?" },
          { german: "Er soll um 9 Uhr hier sein.", english: "He is supposed to be here at 9." },
          { german: "Wir wollen nach Berlin fahren.", english: "We want to travel to Berlin." },
          { german: "Ich möchte bitte zahlen.", english: "I would like to pay, please." },
          { german: "Du musst das nicht machen.", english: "You don't have to do that." },
          { german: "Kann man hier parken?", english: "Can one park here?" },
          { german: "Sie darf das Auto benutzen.", english: "She is allowed to use the car." },
          { german: "Wollen Sie mitkommen?", english: "Do you want to come along?", example: "Wollen Sie mitkommen? – Gerne!", exampleTranslation: "Do you want to come along? – With pleasure!" },
        ],
      },
      {
        type: "quiz", title: "Quiz: Modal Verbs",
        questions: [
          { question: "Where does the infinitive go when using a modal verb?", options: ["Position 1", "Position 2", "At the end", "After the subject"], correct: 2, explanation: "The modal verb takes position 2 (conjugated), and the main verb infinitive goes to the end." },
          { question: "'Ich ___ Deutsch sprechen.' (I can speak German)", options: ["muss", "will", "kann", "darf"], correct: 2 },
          { question: "'Hier darf man nicht rauchen.' means:", options: ["One must smoke here", "One may not smoke here", "One wants to smoke here", "One can smoke here"], correct: 1 },
          { question: "Which modal means 'would like to' (polite)?", options: ["wollen", "müssen", "möchten", "sollen"], correct: 2 },
          { question: "'Wir müssen das Formular ausfüllen.' Correct word order?", options: ["müssen goes to the end", "ausfüllen goes to position 2", "müssen is position 2, ausfüllen is at the end", "Both verbs go to the end"], correct: 2 },
        ],
      },
    ],
  },

  "14": {
    id: 14, courseId: 2, title: "Perfect Tense (Perfekt)", titleGerman: "Perfekt",
    icon: "⏪", xpReward: 60,
    sections: [
      {
        type: "intro", title: "The Perfect Tense (Perfekt)",
        content: "The Perfekt is the main past tense used in spoken German. It's formed with a helper verb (haben or sein) + the past participle (Partizip II). You'll use it constantly in everyday conversation to talk about things that happened.",
      },
      {
        type: "grammar", title: "Forming the Perfekt",
        grammar: [
          {
            rule: "Most verbs use 'haben' as the helper. Regular participles: ge- + stem + -t. Irregular participles must be memorised.",
            examples: [
              { german: "kaufen → gekauft", english: "to buy → bought" },
              { german: "Ich habe das Buch gekauft.", english: "I bought / have bought the book." },
              { german: "lernen → gelernt", english: "to learn → learnt" },
              { german: "Wir haben Deutsch gelernt.", english: "We learnt German." },
              { german: "arbeiten → gearbeitet", english: "to work → worked" },
            ],
          },
          {
            rule: "Verbs of motion/change of state use 'sein' as the helper. Key 'sein' verbs: gehen, fahren, kommen, fliegen, laufen, bleiben, sein, werden.",
            examples: [
              { german: "Ich bin nach Berlin gefahren.", english: "I drove/went to Berlin." },
              { german: "Sie ist heute früh aufgestanden.", english: "She got up early today." },
              { german: "Wir sind ins Kino gegangen.", english: "We went to the cinema." },
              { german: "Er ist in Hamburg geblieben.", english: "He stayed in Hamburg." },
            ],
          },
          {
            rule: "Common irregular past participles: essen→gegessen, trinken→getrunken, schreiben→geschrieben, sehen→gesehen, nehmen→genommen, sprechen→gesprochen",
            examples: [
              { german: "Ich habe Pizza gegessen.", english: "I ate pizza." },
              { german: "Hast du Wasser getrunken?", english: "Did you drink water?" },
              { german: "Er hat einen Brief geschrieben.", english: "He wrote a letter." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Past Tense Expressions",
        vocab: [
          { german: "gestern", english: "yesterday", example: "Gestern habe ich viel gearbeitet.", exampleTranslation: "Yesterday I worked a lot." },
          { german: "letzte Woche", english: "last week" },
          { german: "letztes Jahr", english: "last year" },
          { german: "vor zwei Tagen", english: "two days ago" },
          { german: "am Wochenende", english: "at the weekend", example: "Am Wochenende bin ich ins Kino gegangen.", exampleTranslation: "At the weekend I went to the cinema." },
          { german: "schon einmal", english: "before / already once", example: "Ich bin schon einmal in Wien gewesen.", exampleTranslation: "I have been to Vienna before." },
          { german: "noch nie", english: "never before" },
          { german: "früher", english: "in the past / earlier" },
          { german: "damals", english: "back then / at that time" },
          { german: "zuerst ... dann ...", english: "first ... then ...", example: "Zuerst habe ich gegessen, dann bin ich spazieren gegangen.", exampleTranslation: "First I ate, then I went for a walk." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Perfekt",
        questions: [
          { question: "Which helper verb does 'fahren' (to drive) use in the Perfekt?", options: ["haben", "sein", "werden", "wollen"], correct: 1, explanation: "Verbs of motion use 'sein': ich bin gefahren." },
          { question: "What is the Partizip II of 'kaufen'?", options: ["gekaufen", "kaufte", "gekauft", "kaufend"], correct: 2 },
          { question: "'Ich habe Pizza gegessen.' The Partizip II of 'essen' is:", options: ["gegessen", "geessen", "gegessen", "aß"], correct: 0 },
          { question: "Correct: 'Wir ___ ins Kino gegangen.'", options: ["haben", "sind", "sein", "hatten"], correct: 1 },
          { question: "'Hast du Deutsch gelernt?' means:", options: ["Are you learning German?", "Do you learn German?", "Did you learn German?", "Will you learn German?"], correct: 2 },
        ],
      },
    ],
  },

  "15": {
    id: 15, courseId: 2, title: "Dative Case", titleGerman: "Dativ",
    icon: "📦", xpReward: 60,
    sections: [
      {
        type: "intro", title: "The Dative Case (Dativ)",
        content: "The dative case marks the indirect object — the person or thing that receives something. It's also required after certain prepositions and verbs. Only masculine and neuter change article in the dative.",
      },
      {
        type: "grammar", title: "Dative Articles & Prepositions",
        grammar: [
          {
            rule: "Dative articles: der → dem (m), die → der (f), das → dem (n), die (pl) → den + noun gets -n ending. Indefinite: ein → einem (m/n), eine → einer (f).",
            examples: [
              { german: "Ich gebe dem Mann das Buch. (m)", english: "I give the man the book." },
              { german: "Sie hilft der Frau. (f)", english: "She helps the woman." },
              { german: "Er dankt dem Kind. (n)", english: "He thanks the child." },
              { german: "Ich schreibe meiner Mutter einen Brief.", english: "I write my mother a letter." },
            ],
          },
          {
            rule: "Dative prepositions (always dative): aus, bei, mit, nach, seit, von, zu, gegenüber. Memory trick: 'aus bei mit nach seit von zu' — learn these as a fixed list!",
            examples: [
              { german: "Ich fahre mit dem Bus.", english: "I travel by bus." },
              { german: "Sie kommt aus der Schweiz.", english: "She comes from Switzerland." },
              { german: "Ich wohne seit einem Jahr in Berlin.", english: "I have been living in Berlin for a year." },
              { german: "Wir gehen zu dem/zum Bahnhof.", english: "We're going to the station." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Verbs that take Dative",
        vocab: [
          { german: "helfen + Dativ", english: "to help (someone)", example: "Kannst du mir helfen?", exampleTranslation: "Can you help me?" },
          { german: "danken + Dativ", english: "to thank (someone)", example: "Ich danke dir sehr.", exampleTranslation: "I thank you very much." },
          { german: "gehören + Dativ", english: "to belong to", example: "Das Buch gehört meinem Bruder.", exampleTranslation: "The book belongs to my brother." },
          { german: "gefallen + Dativ", english: "to please / to like", example: "Das gefällt mir sehr.", exampleTranslation: "I like that very much. (lit. That pleases me.)" },
          { german: "geben + Dativ", english: "to give (to someone)", example: "Er gibt seiner Mutter Blumen.", exampleTranslation: "He gives his mother flowers." },
          { german: "zeigen + Dativ", english: "to show (someone)" },
          { german: "mit dem Bus / Zug / Auto", english: "by bus / train / car" },
          { german: "seit + Dativ", english: "since / for (time)", example: "Ich lerne seit zwei Jahren Deutsch.", exampleTranslation: "I have been learning German for two years." },
          { german: "bei + Dativ", english: "at / with (location/person)", example: "Ich wohne bei meinen Eltern.", exampleTranslation: "I live with my parents." },
          { german: "nach Hause / zu Hause", english: "going home / at home" },
        ],
      },
      {
        type: "quiz", title: "Quiz: Dative",
        questions: [
          { question: "Fill in: 'Ich fahre mit ___ Bus.' (der Bus, dative)", options: ["den", "dem", "der", "des"], correct: 1 },
          { question: "Which preposition ALWAYS takes the dative?", options: ["durch", "für", "mit", "gegen"], correct: 2, explanation: "'mit' is a dative preposition. durch/für/gegen take accusative." },
          { question: "'Das gefällt mir.' means:", options: ["I do that", "I like that", "That is mine", "I need that"], correct: 1 },
          { question: "Fill in: 'Sie hilft ___ Frau.' (die Frau, dative)", options: ["die", "den", "dem", "der"], correct: 3 },
          { question: "'Ich lerne seit zwei Jahren Deutsch.' — 'seit' takes which case?", options: ["Accusative", "Nominative", "Dative", "Genitive"], correct: 2 },
        ],
      },
    ],
  },

  "16": {
    id: 16, courseId: 2, title: "Separable Verbs", titleGerman: "Trennbare Verben",
    icon: "✂️", xpReward: 50,
    sections: [
      {
        type: "intro", title: "Separable Verbs (Trennbare Verben)",
        content: "Many German verbs have a separable prefix (an-, auf-, aus-, ein-, mit-, vor-, zurück-, etc.). In a main clause, the prefix splits off and moves to the END of the sentence. In the Perfekt, the ge- goes between the prefix and the stem.",
      },
      {
        type: "grammar", title: "How Separable Verbs Work",
        grammar: [
          {
            rule: "In a main clause (present tense): conjugated verb is in position 2, the prefix goes to the END.",
            examples: [
              { german: "aufstehen → Ich stehe um 7 Uhr auf.", english: "to get up → I get up at 7 o'clock." },
              { german: "anrufen → Er ruft seine Mutter an.", english: "to call → He calls his mother." },
              { german: "einkaufen → Wir kaufen heute ein.", english: "to shop → We are shopping today." },
              { german: "mitkommen → Kommst du mit?", english: "to come along → Are you coming along?" },
            ],
          },
          {
            rule: "In the Perfekt: the prefix + ge + stem + -t/en. The prefix does NOT separate in the Partizip II.",
            examples: [
              { german: "aufstehen → aufgestanden", english: "got up" },
              { german: "anrufen → angerufen", english: "called (on phone)" },
              { german: "einkaufen → eingekauft", english: "shopped" },
              { german: "Ich habe heute eingekauft.", english: "I did the shopping today." },
            ],
          },
          {
            rule: "With a modal verb: the separable verb stays together as a full infinitive at the end.",
            examples: [
              { german: "Ich muss jetzt aufstehen.", english: "I have to get up now." },
              { german: "Kannst du morgen mitkommen?", english: "Can you come along tomorrow?" },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Common Separable Verbs",
        vocab: [
          { german: "aufstehen", english: "to get up", example: "Ich stehe um 6 Uhr auf.", exampleTranslation: "I get up at 6 o'clock." },
          { german: "anrufen", english: "to call (phone)", example: "Ruf mich bitte an!", exampleTranslation: "Please call me!" },
          { german: "einkaufen", english: "to go shopping" },
          { german: "mitkommen", english: "to come along" },
          { german: "ausgehen", english: "to go out", example: "Wir gehen heute Abend aus.", exampleTranslation: "We are going out this evening." },
          { german: "anfangen", english: "to start/begin", example: "Wann fängt der Film an?", exampleTranslation: "When does the film start?" },
          { german: "zurückkommen", english: "to come back", example: "Wann kommst du zurück?", exampleTranslation: "When are you coming back?" },
          { german: "vorbereiten", english: "to prepare" },
          { german: "einladen", english: "to invite", example: "Er lädt uns zum Essen ein.", exampleTranslation: "He is inviting us to dinner." },
          { german: "aufmachen / zumachen", english: "to open / to close" },
        ],
      },
      {
        type: "quiz", title: "Quiz: Separable Verbs",
        questions: [
          { question: "Where does the prefix go in a main clause (present tense)?", options: ["Position 1", "After the subject", "Position 2", "At the end"], correct: 3 },
          { question: "'Er ruft seine Mutter ___.' (anrufen)", options: ["an", "auf", "aus", "ein"], correct: 0 },
          { question: "Partizip II of 'einkaufen':", options: ["eingekauft", "geinkauft", "einkaufen", "kaufte ein"], correct: 0 },
          { question: "'Wann fängt der Kurs an?' means:", options: ["Where does the course take place?", "When does the course start?", "How long is the course?", "Who starts the course?"], correct: 1 },
          { question: "With a modal verb: 'Ich muss jetzt ___.' (aufstehen)", options: ["stehe auf", "auf stehe", "aufstehen", "stehen auf"], correct: 2, explanation: "With a modal, the separable verb stays as a full infinitive at the end." },
        ],
      },
    ],
  },

  "17": {
    id: 17, courseId: 2, title: "Adjective Endings", titleGerman: "Adjektivendungen",
    icon: "🎨", xpReward: 60,
    sections: [
      {
        type: "intro", title: "Adjective Endings (Adjektivendungen)",
        content: "When an adjective comes before a noun in German, it must take an ending that matches the noun's gender, case, and whether the article is definite, indefinite, or absent. This is one of the trickier parts of German — but there's a pattern!",
      },
      {
        type: "grammar", title: "Adjective Endings after Definite Articles",
        grammar: [
          {
            rule: "After der/die/das (definite articles), the adjective usually takes -e or -en. Nominative singular: -e for all genders. Everything else: -en.",
            examples: [
              { german: "der alte Mann (m, nom)", english: "the old man" },
              { german: "die junge Frau (f, nom)", english: "the young woman" },
              { german: "das kleine Kind (n, nom)", english: "the small child" },
              { german: "Ich sehe den alten Mann. (m, acc)", english: "I see the old man." },
              { german: "Er hilft der jungen Frau. (f, dat)", english: "He helps the young woman." },
            ],
          },
          {
            rule: "After ein/eine/ein (indefinite articles), the adjective must show the gender itself in nominative and accusative neuter/feminine.",
            examples: [
              { german: "ein alter Mann (m, nom)", english: "an old man" },
              { german: "eine junge Frau (f, nom)", english: "a young woman" },
              { german: "ein kleines Kind (n, nom)", english: "a small child" },
              { german: "Ich habe einen neuen Job.", english: "I have a new job." },
              { german: "Das ist eine schöne Stadt.", english: "That is a beautiful city." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Common Adjectives",
        vocab: [
          { german: "groß / klein", english: "big / small", example: "Sie hat eine große Wohnung.", exampleTranslation: "She has a big flat." },
          { german: "alt / neu", english: "old / new" },
          { german: "gut / schlecht", english: "good / bad" },
          { german: "schön / hässlich", english: "beautiful / ugly" },
          { german: "teuer / billig / günstig", english: "expensive / cheap / affordable", example: "Das ist ein günstiges Restaurant.", exampleTranslation: "That is an affordable restaurant." },
          { german: "interessant / langweilig", english: "interesting / boring" },
          { german: "einfach / schwierig", english: "easy / difficult" },
          { german: "lecker", english: "tasty / delicious", example: "Das war ein leckeres Essen!", exampleTranslation: "That was a delicious meal!" },
          { german: "freundlich / unhöflich", english: "friendly / unfriendly" },
          { german: "müde / hungrig / durstig", english: "tired / hungry / thirsty" },
        ],
      },
      {
        type: "quiz", title: "Quiz: Adjective Endings",
        questions: [
          { question: "'Das ist ein ___ Mann.' (alt, masculine nominative after indefinite article)", options: ["alte", "altem", "alter", "alten"], correct: 2, explanation: "After 'ein' in masculine nominative, the adjective takes -er to show the gender." },
          { question: "'Sie hat eine ___ Wohnung.' (groß, feminine nominative after indefinite article)", options: ["große", "großen", "großem", "großer"], correct: 0 },
          { question: "'Ich sehe den ___ Mann.' (alt, masculine accusative after definite article)", options: ["alte", "alten", "alter", "altem"], correct: 1, explanation: "After definite article in accusative (and all other cases except nom. sing.), use -en." },
          { question: "'Das war ein ___ Essen!' (lecker, neuter nominative)", options: ["leckeren", "leckere", "leckerer", "leckeres"], correct: 3 },
          { question: "After 'die' (definite, feminine, nominative), what ending does the adjective take?", options: ["-en", "-er", "-em", "-e"], correct: 3 },
        ],
      },
    ],
  },

  "18": {
    id: 18, courseId: 2, title: "Comparative & Superlative", titleGerman: "Komparativ und Superlativ",
    icon: "📊", xpReward: 50,
    sections: [
      {
        type: "intro", title: "Comparative & Superlative",
        content: "To compare things in German, you add -er to the adjective (comparative) and am …-sten for the superlative. Many common adjectives have irregular forms — these are worth memorising.",
      },
      {
        type: "grammar", title: "Forming Comparative & Superlative",
        grammar: [
          {
            rule: "Comparative: adjective + -er. Superlative (predicate): am + adjective + -sten. Many one-syllable adjectives also add an umlaut.",
            examples: [
              { german: "schnell → schneller → am schnellsten", english: "fast → faster → fastest" },
              { german: "alt → älter → am ältesten", english: "old → older → oldest" },
              { german: "groß → größer → am größten", english: "big → bigger → biggest" },
              { german: "kalt → kälter → am kältesten", english: "cold → colder → coldest" },
            ],
          },
          {
            rule: "Irregular forms — these must be memorised:",
            examples: [
              { german: "gut → besser → am besten", english: "good → better → best" },
              { german: "viel → mehr → am meisten", english: "much/many → more → most" },
              { german: "gern → lieber → am liebsten", english: "gladly → preferably → most preferably" },
              { german: "hoch → höher → am höchsten", english: "high → higher → highest" },
            ],
          },
          {
            rule: "Comparisons: A ist …er als B (A is …er than B). A ist genauso … wie B (A is as … as B).",
            examples: [
              { german: "Berlin ist größer als Hamburg.", english: "Berlin is bigger than Hamburg." },
              { german: "Deutsch ist schwieriger als Englisch.", english: "German is harder than English." },
              { german: "Er ist genauso alt wie ich.", english: "He is as old as I am." },
            ],
          },
        ],
      },
      {
        type: "quiz", title: "Quiz: Comparative & Superlative",
        questions: [
          { question: "Comparative of 'groß':", options: ["größen", "am größten", "größer", "großer"], correct: 2 },
          { question: "Superlative of 'gut':", options: ["am gutest", "am besten", "am gutsten", "besser"], correct: 1 },
          { question: "'Berlin ist ___ als Hamburg.' (groß)", options: ["am größten", "größer", "große", "am größer"], correct: 1 },
          { question: "Comparative of 'viel':", options: ["vieler", "vielst", "mehr", "am meisten"], correct: 2 },
          { question: "'Er ist genauso alt ___ ich.' means:", options: ["He is older than me", "He is younger than me", "He is as old as me", "He is the oldest"], correct: 2 },
        ],
      },
    ],
  },

  "19": {
    id: 19, courseId: 2, title: "Travel & Transport", titleGerman: "Reisen und Verkehr",
    icon: "✈️", xpReward: 50,
    sections: [
      {
        type: "intro", title: "Travel & Transport",
        content: "Travel vocabulary is essential for life in a German-speaking country and for the Goethe A2 exam. You'll learn how to buy tickets, ask for directions, and describe journeys.",
      },
      {
        type: "vocab", title: "Transport Vocabulary",
        vocab: [
          { german: "der Zug / die U-Bahn / der Bus", english: "the train / the underground / the bus", example: "Ich fahre mit dem Zug nach München.", exampleTranslation: "I travel to Munich by train." },
          { german: "das Flugzeug / das Schiff", english: "the aeroplane / the ship" },
          { german: "der Bahnhof / der Flughafen", english: "the train station / the airport" },
          { german: "die Haltestelle", english: "the (bus/tram) stop" },
          { german: "das Ticket / die Fahrkarte", english: "the ticket" },
          { german: "einfache Fahrt / Hin- und Rückfahrt", english: "single / return ticket", example: "Eine Fahrkarte nach Berlin, bitte. Einfache Fahrt.", exampleTranslation: "A ticket to Berlin please. Single." },
          { german: "der Anschluss", english: "the connection (transport)" },
          { german: "umsteigen", english: "to change (train/bus)", example: "Sie müssen in Frankfurt umsteigen.", exampleTranslation: "You have to change in Frankfurt." },
          { german: "Wo ist ...? / Wie komme ich zu ...?", english: "Where is ...? / How do I get to ...?" },
          { german: "geradeaus / links / rechts", english: "straight ahead / left / right", example: "Gehen Sie geradeaus und dann links.", exampleTranslation: "Go straight ahead and then left." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Travel & Transport",
        questions: [
          { question: "What is 'the train station' in German?", options: ["der Flughafen", "die Haltestelle", "der Bahnhof", "das Gleis"], correct: 2 },
          { question: "'Einfache Fahrt' means:", options: ["Return ticket", "Single ticket", "Platform ticket", "Season ticket"], correct: 1 },
          { question: "'Sie müssen in Frankfurt umsteigen.' means:", options: ["You must travel to Frankfurt", "You have to change in Frankfurt", "You arrived in Frankfurt", "You missed your connection"], correct: 1 },
          { question: "How do you say 'straight ahead' in German?", options: ["links", "rechts", "geradeaus", "zurück"], correct: 2 },
          { question: "'Wie komme ich zum Bahnhof?' means:", options: ["Where is the next bus stop?", "How do I get to the train station?", "When does the train leave?", "How much is a ticket?"], correct: 1 },
        ],
      },
    ],
  },

  "20": {
    id: 20, courseId: 2, title: "Health & Body", titleGerman: "Gesundheit und Körper",
    icon: "🏥", xpReward: 50,
    sections: [
      {
        type: "intro", title: "Health & Body",
        content: "Being able to describe symptoms and talk about health is vital in any language. This lesson covers body parts, common ailments, and how to talk to a doctor or pharmacist in German.",
      },
      {
        type: "vocab", title: "Body & Health Vocabulary",
        vocab: [
          { german: "der Kopf / der Bauch / der Rücken", english: "the head / the stomach / the back", example: "Ich habe Kopfschmerzen.", exampleTranslation: "I have a headache." },
          { german: "die Schmerzen (pl)", english: "the pain(s)" },
          { german: "Ich bin krank.", english: "I am ill.", example: "Ich bin krank und muss zum Arzt.", exampleTranslation: "I am ill and have to go to the doctor." },
          { german: "der Arzt / die Ärztin", english: "the doctor (m/f)" },
          { german: "die Apotheke", english: "the pharmacy", example: "Wo ist die nächste Apotheke?", exampleTranslation: "Where is the nearest pharmacy?" },
          { german: "das Medikament / die Tablette", english: "the medicine / the tablet" },
          { german: "Ich habe Fieber.", english: "I have a temperature/fever." },
          { german: "Mir ist schlecht.", english: "I feel sick/nauseous." },
          { german: "Ich habe mich verletzt.", english: "I have hurt/injured myself." },
          { german: "Seit wann haben Sie die Schmerzen?", english: "Since when have you had the pain?", example: "Seit gestern habe ich Bauchschmerzen.", exampleTranslation: "I have had stomach ache since yesterday." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Health & Body",
        questions: [
          { question: "'Ich habe Kopfschmerzen.' means:", options: ["I have a stomach ache", "I have a headache", "I have back pain", "I have a fever"], correct: 1 },
          { question: "What is 'the pharmacy' in German?", options: ["das Krankenhaus", "der Arzt", "die Apotheke", "die Klinik"], correct: 2 },
          { question: "'Mir ist schlecht.' means:", options: ["I am ill", "I feel sick/nauseous", "I have a temperature", "I am tired"], correct: 1 },
          { question: "'Seit wann haben Sie die Schmerzen?' asks:", options: ["How severe is the pain?", "Where does it hurt?", "Since when have you had the pain?", "What medicine do you take?"], correct: 2 },
          { question: "'Ich bin krank.' means:", options: ["I am tired", "I am cold", "I am ill", "I am hungry"], correct: 2 },
        ],
      },
    ],
  },

  "21": {
    id: 21, courseId: 2, title: "Work & Professions", titleGerman: "Arbeit und Berufe",
    icon: "💼", xpReward: 50,
    sections: [
      {
        type: "intro", title: "Work & Professions",
        content: "Talking about work and professions is a core topic in everyday German and in the Goethe exam. Learn job titles, workplace vocabulary, and how to describe your working life.",
      },
      {
        type: "vocab", title: "Professions & Work",
        vocab: [
          { german: "der Arzt / die Ärztin", english: "doctor (m/f)" },
          { german: "der Lehrer / die Lehrerin", english: "teacher (m/f)", example: "Ich bin Lehrerin von Beruf.", exampleTranslation: "I am a teacher by profession." },
          { german: "der Ingenieur / die Ingenieurin", english: "engineer (m/f)" },
          { german: "der Verkäufer / die Verkäuferin", english: "salesperson (m/f)" },
          { german: "der Bürokaufmann / die Bürokauffrau", english: "office administrator (m/f)" },
          { german: "der Chef / die Chefin", english: "the boss (m/f)" },
          { german: "die Stelle / der Job", english: "the position / the job", example: "Ich suche eine neue Stelle.", exampleTranslation: "I am looking for a new position." },
          { german: "Vollzeit / Teilzeit", english: "full-time / part-time" },
          { german: "das Gehalt / der Lohn", english: "the salary / the wage" },
          { german: "Was sind Sie von Beruf?", english: "What is your profession?", example: "Was sind Sie von Beruf? – Ich bin Ingenieur.", exampleTranslation: "What do you do? – I am an engineer." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Work & Professions",
        questions: [
          { question: "How do you say 'I am a teacher (f) by profession'?", options: ["Ich bin Lehrer von Beruf.", "Ich bin Lehrerin von Beruf.", "Ich arbeite als Schule.", "Ich habe eine Lehrerin."], correct: 1 },
          { question: "What does 'Teilzeit' mean?", options: ["Full-time", "Overtime", "Part-time", "Self-employed"], correct: 2 },
          { question: "'Ich suche eine neue Stelle.' means:", options: ["I have a new job", "I lost my job", "I am looking for a new position", "I start a new job"], correct: 2 },
          { question: "What is 'the salary' in German?", options: ["der Job", "die Stelle", "das Gehalt", "der Chef"], correct: 2 },
          { question: "'Was sind Sie von Beruf?' means:", options: ["Where do you work?", "What is your profession?", "When do you work?", "Do you work full-time?"], correct: 1 },
        ],
      },
    ],
  },

  "22": {
    id: 22, courseId: 2, title: "Subordinate Clauses: weil, dass, wenn", titleGerman: "Nebensätze",
    icon: "🔗", xpReward: 60,
    sections: [
      {
        type: "intro", title: "Subordinate Clauses (Nebensätze)",
        content: "Subordinate clauses let you give reasons, report speech, and express conditions. The key rule: in a subordinate clause, the conjugated verb goes to the END. The three most important conjunctions at A2 are: weil (because), dass (that), and wenn (when/if).",
      },
      {
        type: "grammar", title: "weil, dass, wenn + verb-final",
        grammar: [
          {
            rule: "weil (because) — the conjugated verb moves to the END of the subordinate clause.",
            examples: [
              { german: "Ich lerne Deutsch, weil es interessant ist.", english: "I'm learning German because it is interesting." },
              { german: "Er bleibt zu Hause, weil er krank ist.", english: "He stays at home because he is ill." },
              { german: "Sie kommt nicht, weil sie arbeiten muss.", english: "She isn't coming because she has to work." },
            ],
          },
          {
            rule: "dass (that) — used to report thoughts, feelings, and statements. Verb goes to the end.",
            examples: [
              { german: "Ich denke, dass Deutsch schwer ist.", english: "I think that German is difficult." },
              { german: "Er sagt, dass er morgen kommt.", english: "He says that he is coming tomorrow." },
              { german: "Ich freue mich, dass du hier bist.", english: "I am glad that you are here." },
            ],
          },
          {
            rule: "wenn (when / if) — used for conditions and repeated/habitual events. Verb goes to the end.",
            examples: [
              { german: "Wenn ich Zeit habe, lese ich gern.", english: "When I have time, I like to read." },
              { german: "Ruf mich an, wenn du ankommst.", english: "Call me when you arrive." },
              { german: "Wenn es regnet, bleibe ich zu Hause.", english: "If it rains, I stay at home." },
            ],
          },
        ],
      },
      {
        type: "quiz", title: "Quiz: Subordinate Clauses",
        questions: [
          { question: "In a subordinate clause with 'weil', where does the verb go?", options: ["Position 1", "Position 2", "At the end", "After the conjunction"], correct: 2 },
          { question: "Correct: 'Ich lerne Deutsch, weil es interessant ___.'", options: ["ist", "ist es", "es ist", "es ist."], correct: 0, explanation: "In the subordinate clause the verb 'ist' goes to the very end." },
          { question: "'Ich denke, dass er morgen ___.' (kommen)", options: ["kommt", "kommen", "er kommt", "morgen kommt"], correct: 0 },
          { question: "'Wenn es regnet, ___ ich zu Hause.' (bleiben)", options: ["ich bleibe", "bleibe ich", "bleiben", "bleibt"], correct: 1, explanation: "When the subordinate clause comes first, the main clause verb goes to position 1 — creating inversion: 'bleibe ich'." },
          { question: "Which conjunction means 'because'?", options: ["wenn", "dass", "weil", "aber"], correct: 2 },
        ],
      },
    ],
  },

  "23": {
    id: 23, courseId: 2, title: "Two-way Prepositions", titleGerman: "Wechselpräpositionen",
    icon: "↔️", xpReward: 50,
    sections: [
      {
        type: "intro", title: "Two-way Prepositions (Wechselpräpositionen)",
        content: "Nine prepositions can take either accusative or dative depending on meaning. The key rule: accusative = movement/direction (Wohin?), dative = location/position (Wo?). The nine are: an, auf, hinter, in, neben, über, unter, vor, zwischen.",
      },
      {
        type: "grammar", title: "Accusative vs Dative with Two-way Preps",
        grammar: [
          {
            rule: "Accusative → movement/direction (Wohin? — Where to?). Dative → location/state (Wo? — Where?).",
            examples: [
              { german: "Ich lege das Buch auf den Tisch. (acc — Wohin?)", english: "I put the book on the table." },
              { german: "Das Buch liegt auf dem Tisch. (dat — Wo?)", english: "The book is lying on the table." },
              { german: "Er geht in die Schule. (acc — Wohin?)", english: "He goes into school." },
              { german: "Er ist in der Schule. (dat — Wo?)", english: "He is at school." },
            ],
          },
          {
            rule: "Contractions: in + dem = im, in + das = ins, an + dem = am, an + das = ans.",
            examples: [
              { german: "Ich bin im Supermarkt.", english: "I am in the supermarket. (in + dem)" },
              { german: "Wir gehen ins Kino.", english: "We are going to the cinema. (in + das)" },
              { german: "Das Bild hängt an der Wand.", english: "The picture hangs on the wall." },
              { german: "Er hängt das Bild an die Wand.", english: "He hangs the picture on the wall." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Useful Location & Direction Phrases",
        vocab: [
          { german: "auf dem Tisch / auf den Tisch", english: "on the table (location) / onto the table (direction)" },
          { german: "in der Küche / in die Küche", english: "in the kitchen / into the kitchen" },
          { german: "vor dem Haus / vor das Haus", english: "in front of the house / to in front of the house" },
          { german: "neben dem Bett / neben das Bett", english: "next to the bed / next to (movement)" },
          { german: "zwischen dem Stuhl und dem Tisch", english: "between the chair and the table" },
          { german: "über der Tür / über die Tür", english: "above the door / over the door (movement)" },
          { german: "unter dem Bett", english: "under the bed" },
          { german: "hinter dem Haus", english: "behind the house" },
          { german: "Wo ist die Katze? — Sie sitzt auf dem Sofa.", english: "Where is the cat? — It's sitting on the sofa." },
          { german: "Wohin geht er? — Er geht in den Park.", english: "Where is he going? — He's going to the park." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Two-way Prepositions",
        questions: [
          { question: "'Ich lege das Buch ___ Tisch.' (auf, movement onto → accusative, der Tisch)", options: ["dem", "der", "den", "das"], correct: 2, explanation: "Movement/direction → accusative: auf den Tisch." },
          { question: "'Das Buch liegt ___ Tisch.' (auf, location → dative)", options: ["den", "dem", "der", "das"], correct: 1 },
          { question: "'Wir gehen ins Kino.' 'ins' is a contraction of:", options: ["in + das", "in + dem", "in + die", "in + der"], correct: 0 },
          { question: "Which question word signals accusative with two-way prepositions?", options: ["Wo?", "Woher?", "Wohin?", "Wann?"], correct: 2 },
          { question: "'Er ist im Supermarkt.' 'im' is a contraction of:", options: ["in + das", "in + die", "in + dem", "in + den"], correct: 2 },
        ],
      },
    ],
  },

  "24": {
    id: 24, courseId: 2, title: "A2 Goethe Exam Practice", titleGerman: "Goethe A2 Prüfungsvorbereitung",
    icon: "🏆", xpReward: 110,
    sections: [
      {
        type: "intro", title: "A2 Exam Practice",
        content: "The Goethe-Zertifikat A2 has four parts: Lesen (reading), Hören (listening), Schreiben (writing), and Sprechen (speaking). This practice session focuses on reading comprehension and language use — the style of questions you'll face on the real exam.",
      },
      {
        type: "vocab", title: "Exam Strategies & Key Phrases",
        vocab: [
          { german: "Lesen Sie den Text und kreuzen Sie an.", english: "Read the text and tick/cross." },
          { german: "Richtig / Falsch / Nicht im Text", english: "True / False / Not in the text" },
          { german: "Welche Überschrift passt?", english: "Which heading fits?" },
          { german: "Ergänzen Sie die Lücken.", english: "Fill in the gaps." },
          { german: "Schreiben Sie eine E-Mail.", english: "Write an email." },
          { german: "Ich würde gern wissen, ob …", english: "I would like to know if …" },
          { german: "Könnten Sie mir bitte … sagen?", english: "Could you please tell me …?" },
          { german: "Vielen Dank für Ihre Nachricht.", english: "Thank you very much for your message." },
          { german: "Mit freundlichen Grüßen", english: "Kind regards (formal letter/email sign-off)" },
          { german: "Ich freue mich auf Ihre Antwort.", english: "I look forward to your reply." },
        ],
      },
      {
        type: "quiz", title: "A2 Exam-Style Questions",
        questions: [
          {
            question: "Notice: 'Kurs: Deutsch für Anfänger. Beginn: 5. März, 18:30 Uhr. Ort: Volkshochschule, Raum 12. Kosten: 80 €.' When does the course start?",
            options: ["5 March at 8:30 am", "5 March at 6:30 pm", "12 March at 18:00", "March, room 80"],
            correct: 1, explanation: "18:30 Uhr = 6:30 pm.",
          },
          {
            question: "Email: 'Liebe Anna, ich kann leider morgen nicht kommen, weil ich krank bin. Kannst du mir die Hausaufgaben schicken?' Why can't the person come?",
            options: ["They forgot", "They are working", "They are ill", "They have no time"],
            correct: 2, explanation: "'weil ich krank bin' = because I am ill.",
          },
          {
            question: "Ad: 'Zu vermieten: 3-Zimmer-Wohnung, 75 m², 2. OG, Balkon, Keller, Tiefgarage. 950 € Kaltmiete.' How many rooms does the flat have?",
            options: ["2", "3", "75", "4"],
            correct: 1,
          },
          {
            question: "'Ich lerne Deutsch, ___ es für meinen Job wichtig ist.' (because)",
            options: ["dass", "wenn", "weil", "aber"],
            correct: 2,
          },
          {
            question: "Thomas says: 'Ich bin letztes Jahr nach Deutschland gefahren und habe viele Städte besucht.' What tense is used and what did Thomas do?",
            options: ["Present — he is travelling now", "Perfect — he travelled to Germany last year", "Future — he will travel", "Imperfect — he used to travel"],
            correct: 1, explanation: "'bin gefahren' and 'habe besucht' are Perfekt (past). 'letztes Jahr' = last year.",
          },
        ],
      },
    ],
  },

  // ── B1 Topics ──────────────────────────────────────────────────────────────

  "25": {
    id: 25, courseId: 3, title: "Simple Past (Präteritum)", titleGerman: "Präteritum",
    icon: "📜", xpReward: 60,
    sections: [
      {
        type: "intro", title: "Simple Past (Präteritum)",
        content: "The Präteritum is the written past tense — used in novels, news articles, fairy tales, and formal writing. It is also used in speech for 'sein' and the modal verbs. You MUST master it for B1 reading and writing tasks.",
      },
      {
        type: "grammar", title: "Forming the Präteritum",
        grammar: [
          {
            rule: "Regular (weak) verbs: stem + -te endings: -te, -test, -te, -ten, -tet, -ten.",
            examples: [
              { german: "kaufen → ich kaufte, du kauftest, er kaufte", english: "to buy → I bought, you bought, he bought" },
              { german: "lernen → wir lernten, ihr lerntet, sie lernten", english: "to learn → we learnt, you learnt, they learnt" },
              { german: "arbeiten → ich arbeitete (stem ends in -t, add -ete)", english: "to work → I worked" },
            ],
          },
          {
            rule: "Irregular (strong) verbs change their stem vowel — these must be memorised. Key irregular forms:",
            examples: [
              { german: "sein → ich war, du warst, er war, wir waren", english: "to be → I was, you were, he was, we were" },
              { german: "haben → ich hatte, du hattest, er hatte", english: "to have → I had, you had, he had" },
              { german: "gehen → ich ging, du gingst, er ging", english: "to go → I went" },
              { german: "kommen → ich kam, du kamst, er kam", english: "to come → I came" },
              { german: "fahren → ich fuhr, du fuhrst, er fuhr", english: "to drive → I drove" },
              { german: "sehen → ich sah, du sahst, er sah", english: "to see → I saw" },
              { german: "sprechen → ich sprach, du sprachst, er sprach", english: "to speak → I spoke" },
              { german: "nehmen → ich nahm, du nahmst, er nahm", english: "to take → I took" },
            ],
          },
          {
            rule: "Modal verbs in Präteritum (common in speech too): können→konnte, müssen→musste, wollen→wollte, dürfen→durfte, sollen→sollte, mögen→mochte.",
            examples: [
              { german: "Ich konnte nicht schlafen.", english: "I could not sleep." },
              { german: "Er musste früh aufstehen.", english: "He had to get up early." },
              { german: "Sie wollte Ärztin werden.", english: "She wanted to become a doctor." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Time Markers for Narrative",
        vocab: [
          { german: "damals", english: "back then / at that time", example: "Damals war das Leben einfacher.", exampleTranslation: "Back then life was simpler." },
          { german: "früher", english: "in the past / formerly" },
          { german: "plötzlich", english: "suddenly", example: "Plötzlich klingelte das Telefon.", exampleTranslation: "Suddenly the phone rang." },
          { german: "danach / anschließend", english: "afterwards / subsequently" },
          { german: "zuerst / dann / schließlich", english: "first / then / finally" },
          { german: "als Kind", english: "as a child", example: "Als Kind wohnte ich in München.", exampleTranslation: "As a child I lived in Munich." },
          { german: "im Jahr 2010", english: "in the year 2010" },
          { german: "vor langer Zeit", english: "a long time ago" },
          { german: "eines Tages", english: "one day" },
          { german: "seitdem", english: "since then" },
        ],
      },
      {
        type: "quiz", title: "Quiz: Präteritum",
        questions: [
          { question: "Präteritum of 'sein' for 'wir':", options: ["sind", "seien", "waren", "wären"], correct: 2 },
          { question: "Präteritum of 'kaufen' for 'ich':", options: ["kaufte", "kaufete", "habe gekauft", "kauf"], correct: 0 },
          { question: "Präteritum of 'gehen' for 'er':", options: ["gehte", "ist gegangen", "geht", "ging"], correct: 3 },
          { question: "'Ich konnte nicht schlafen.' Which modal verb is this?", options: ["wollen", "müssen", "können", "dürfen"], correct: 2 },
          { question: "When is Präteritum preferred over Perfekt in speech?", options: ["For all verbs always", "For sein, haben, and modal verbs", "Only in Southern Germany", "Only for regular verbs"], correct: 1 },
        ],
      },
    ],
  },

  "26": {
    id: 26, courseId: 3, title: "Passive Voice (Passiv)", titleGerman: "Passiv",
    icon: "🔄", xpReward: 70,
    sections: [
      {
        type: "intro", title: "Passive Voice (Passiv)",
        content: "The passive shifts the focus from the actor to the action or the object being acted upon. It's widely used in German formal writing, instructions, and news. The passive is formed with 'werden' + Partizip II.",
      },
      {
        type: "grammar", title: "Forming the Passive",
        grammar: [
          {
            rule: "Present passive (Präsens Passiv): werden (conjugated) + Partizip II at the end.",
            examples: [
              { german: "Das Auto wird repariert.", english: "The car is being repaired." },
              { german: "Die Tür wird geöffnet.", english: "The door is being opened." },
              { german: "Die Briefe werden geschrieben.", english: "The letters are being written." },
              { german: "Das Essen wird gekocht.", english: "The food is being cooked." },
            ],
          },
          {
            rule: "Past passive (Präteritum Passiv): wurde (conjugated) + Partizip II.",
            examples: [
              { german: "Das Auto wurde repariert.", english: "The car was repaired." },
              { german: "Das Gebäude wurde 1900 gebaut.", english: "The building was built in 1900." },
              { german: "Die E-Mail wurde gestern geschickt.", english: "The email was sent yesterday." },
            ],
          },
          {
            rule: "To mention the agent (by whom), use 'von + Dativ'.",
            examples: [
              { german: "Das Buch wurde von Goethe geschrieben.", english: "The book was written by Goethe." },
              { german: "Der Kuchen wird von meiner Mutter gebacken.", english: "The cake is being baked by my mother." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Passive in Context",
        vocab: [
          { german: "Es wird gebaut.", english: "Construction is taking place. (lit. It is being built.)" },
          { german: "Hier wird nicht geraucht.", english: "No smoking here. (lit. It is not smoked here.)" },
          { german: "Das darf nicht vergessen werden.", english: "That must not be forgotten." },
          { german: "Die Regeln werden erklärt.", english: "The rules are being explained." },
          { german: "Der Antrag muss ausgefüllt werden.", english: "The form must be filled in." },
          { german: "Das Paket wurde geliefert.", english: "The parcel was delivered." },
          { german: "Die Prüfung wird vorbereitet.", english: "The exam is being prepared." },
          { german: "Er wurde befördert.", english: "He was promoted." },
          { german: "Das Problem wurde gelöst.", english: "The problem was solved." },
          { german: "Deutsch wird weltweit gesprochen.", english: "German is spoken worldwide." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Passiv",
        questions: [
          { question: "Present passive of 'reparieren' (das Auto):", options: ["Das Auto repariert.", "Das Auto wird repariert.", "Das Auto wurde repariert.", "Das Auto ist repariert."], correct: 1 },
          { question: "Past passive: 'Das Gebäude ___ 1900 ___.' (bauen)", options: ["wird / gebaut", "wurde / gebaut", "war / gebaut", "hat / gebaut"], correct: 1 },
          { question: "How do you express the agent in a passive sentence?", options: ["mit + Akkusativ", "für + Akkusativ", "von + Dativ", "durch + Genitiv"], correct: 2 },
          { question: "'Das Buch wurde von Goethe geschrieben.' Active equivalent:", options: ["Goethe schrieb das Buch.", "Das Buch schrieb Goethe.", "Von Goethe das Buch schrieb.", "Goethe hat das Buch."], correct: 0 },
          { question: "'Der Antrag muss ausgefüllt werden.' means:", options: ["The form was filled in.", "The form is being filled in.", "The form must be filled in.", "The form can be filled in."], correct: 2 },
        ],
      },
    ],
  },

  "27": {
    id: 27, courseId: 3, title: "Konjunktiv II (würde)", titleGerman: "Konjunktiv II",
    icon: "💭", xpReward: 70,
    sections: [
      {
        type: "intro", title: "Konjunktiv II",
        content: "The Konjunktiv II is used to express wishes, hypothetical situations, polite requests, and unreal conditions. The most common way to form it is with 'würde + infinitive'. However, key verbs like sein, haben, and the modals use their own Konjunktiv II forms.",
      },
      {
        type: "grammar", title: "Forming Konjunktiv II",
        grammar: [
          {
            rule: "würde + infinitive — used for most verbs to express hypothetical or polite meaning.",
            examples: [
              { german: "Ich würde gern nach Japan reisen.", english: "I would like to travel to Japan." },
              { german: "Würden Sie mir bitte helfen?", english: "Would you please help me?" },
              { german: "Das würde ich nie machen.", english: "I would never do that." },
            ],
          },
          {
            rule: "Own Konjunktiv II forms (do NOT use würde with these): sein→wäre, haben→hätte, können→könnte, müssen→müsste, dürfen→dürfte, sollen→sollte, wollen→wollte.",
            examples: [
              { german: "Wenn ich reich wäre, würde ich reisen.", english: "If I were rich, I would travel." },
              { german: "Ich hätte gern mehr Zeit.", english: "I would like to have more time." },
              { german: "Das könnte schwierig sein.", english: "That could be difficult." },
              { german: "Du solltest mehr schlafen.", english: "You should sleep more." },
            ],
          },
          {
            rule: "Unreal conditional: Wenn + Konjunktiv II … , würde/Konj.II … The wenn-clause verb goes to the end.",
            examples: [
              { german: "Wenn ich Zeit hätte, würde ich mehr lesen.", english: "If I had time, I would read more." },
              { german: "Wenn das Wetter schöner wäre, gingen wir spazieren.", english: "If the weather were nicer, we would go for a walk." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Wishes & Polite Requests",
        vocab: [
          { german: "Ich würde gern ...", english: "I would like to ...", example: "Ich würde gern einen Tisch reservieren.", exampleTranslation: "I would like to reserve a table." },
          { german: "Könnten Sie bitte ...?", english: "Could you please ...?" },
          { german: "Dürfte ich ...?", english: "Might I ...? / May I ...?" },
          { german: "Ich wünschte, ...", english: "I wish ...", example: "Ich wünschte, ich wäre in Berlin.", exampleTranslation: "I wish I were in Berlin." },
          { german: "An deiner Stelle würde ich ...", english: "In your position I would ...", example: "An deiner Stelle würde ich den Arzt anrufen.", exampleTranslation: "If I were you, I would call the doctor." },
          { german: "Das wäre toll!", english: "That would be great!" },
          { german: "Wenn ich könnte, würde ich ...", english: "If I could, I would ..." },
          { german: "Es wäre schön, wenn ...", english: "It would be nice if ..." },
          { german: "Hätten Sie einen Moment Zeit?", english: "Would you have a moment?" },
          { german: "Das müsste klappen.", english: "That should work out." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Konjunktiv II",
        questions: [
          { question: "Konjunktiv II of 'sein' for 'ich':", options: ["wäre", "würde sein", "war", "sei"], correct: 0 },
          { question: "'Wenn ich Zeit ___, würde ich mehr lesen.' (haben)", options: ["hätte", "habe", "hatte", "würde haben"], correct: 0, explanation: "haben → hätte in Konjunktiv II. Do not use 'würde haben'." },
          { question: "Polite: 'Würden Sie mir bitte helfen?' means:", options: ["You must help me.", "Can you help me now?", "Would you please help me?", "You should help me."], correct: 2 },
          { question: "'Das könnte schwierig sein.' means:", options: ["That is definitely difficult.", "That was difficult.", "That could be difficult.", "That must be difficult."], correct: 2 },
          { question: "Which is correct for an unreal condition?", options: ["Wenn ich reich bin, reise ich.", "Wenn ich reich wäre, würde ich reisen.", "Wenn ich reich würde sein, reise ich.", "Wenn ich wäre reich, ich würde reisen."], correct: 1 },
        ],
      },
    ],
  },

  "28": {
    id: 28, courseId: 3, title: "Relative Clauses", titleGerman: "Relativsätze",
    icon: "🔗", xpReward: 70,
    sections: [
      {
        type: "intro", title: "Relative Clauses (Relativsätze)",
        content: "Relative clauses add information about a noun using relative pronouns (der, die, das — similar to the definite articles). The verb goes to the END of the relative clause. They are essential for more complex, natural-sounding German.",
      },
      {
        type: "grammar", title: "Relative Pronouns & Word Order",
        grammar: [
          {
            rule: "Relative pronouns match the gender of the noun they refer to, but their case depends on their role in the relative clause. They are identical to der/die/das except dative plural (denen) and genitive forms.",
            examples: [
              { german: "Der Mann, der dort steht, ist mein Lehrer. (m, nom)", english: "The man who is standing there is my teacher." },
              { german: "Die Frau, die ich kenne, heißt Petra. (f, acc)", english: "The woman (whom) I know is called Petra." },
              { german: "Das Buch, das ich lese, ist sehr interessant. (n, nom)", english: "The book (that) I am reading is very interesting." },
              { german: "Der Mann, dem ich helfe, ist krank. (m, dat)", english: "The man whom I am helping is ill." },
            ],
          },
          {
            rule: "The relative clause is a subordinate clause — the verb goes to the end. The relative clause is always separated by commas.",
            examples: [
              { german: "Ich habe einen Freund, der in Berlin wohnt.", english: "I have a friend who lives in Berlin." },
              { german: "Das Restaurant, das wir besucht haben, war teuer.", english: "The restaurant (that) we visited was expensive." },
              { german: "Die Leute, mit denen ich arbeite, sind nett.", english: "The people with whom I work are nice." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Relative Clause Patterns",
        vocab: [
          { german: "..., der/die/das ... ist.", english: "... who/that is ...", example: "Das ist die Stadt, die ich liebe.", exampleTranslation: "That is the city that I love." },
          { german: "..., den/die/das ich kenne.", english: "... that/whom I know." },
          { german: "..., dem/der/dem ich helfe.", english: "... whom I am helping. (dat)" },
          { german: "..., mit dem/der ich arbeite.", english: "... with whom I work." },
          { german: "..., der/die/das mir gefällt.", english: "... that I like." },
          { german: "..., was mich überrascht hat.", english: "... which surprised me. (was — refers to whole clause or indefinite pronoun)" },
          { german: "jemand, der ...", english: "someone who ..." },
          { german: "alles, was ...", english: "everything that ..." },
          { german: "nichts, was ...", english: "nothing that ..." },
          { german: "das Einzige, was ...", english: "the only thing that ..." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Relative Clauses",
        questions: [
          { question: "'Der Mann, ___ dort steht, ist mein Lehrer.' (masculine, nominative)", options: ["den", "dem", "der", "das"], correct: 2 },
          { question: "'Das Buch, ___ ich lese, ist gut.' (neuter, accusative)", options: ["der", "den", "dem", "das"], correct: 3 },
          { question: "Where does the verb go in a relative clause?", options: ["Position 2", "Position 1", "At the end", "After the relative pronoun"], correct: 2 },
          { question: "'Die Leute, mit ___ ich arbeite, sind nett.' (dative plural)", options: ["die", "den", "denen", "deren"], correct: 2 },
          { question: "'Ich habe einen Freund, der in Berlin wohnt.' The relative pronoun 'der' refers to:", options: ["ich", "einen Freund", "Berlin", "wohnt"], correct: 1 },
        ],
      },
    ],
  },

  "29": {
    id: 29, courseId: 3, title: "Infinitive with zu", titleGerman: "Infinitiv mit zu",
    icon: "➡️", xpReward: 60,
    sections: [
      {
        type: "intro", title: "Infinitive with zu",
        content: "Many German verbs, adjectives, and nouns are followed by an infinitive with 'zu'. This construction links two actions together. With separable verbs, 'zu' goes between the prefix and the verb stem.",
      },
      {
        type: "grammar", title: "Infinitive with zu — Rules",
        grammar: [
          {
            rule: "zu + infinitive after verbs like versuchen, vergessen, beginnen, aufhören, vorhaben, empfehlen, hoffen, planen.",
            examples: [
              { german: "Ich versuche, Deutsch zu lernen.", english: "I am trying to learn German." },
              { german: "Er vergisst immer, die Tür zu schließen.", english: "He always forgets to close the door." },
              { german: "Sie beginnt, Klavier zu spielen.", english: "She is beginning to play the piano." },
              { german: "Ich habe vor, nach Deutschland zu ziehen.", english: "I plan to move to Germany." },
            ],
          },
          {
            rule: "With separable verbs: prefix + zu + stem (all written as one word).",
            examples: [
              { german: "aufräumen → aufzuräumen", english: "to tidy up" },
              { german: "Vergiss nicht, dein Zimmer aufzuräumen!", english: "Don't forget to tidy up your room!" },
              { german: "anrufen → anzurufen", english: "to call" },
              { german: "Er versprach, mich anzurufen.", english: "He promised to call me." },
            ],
          },
          {
            rule: "After adjectives with 'es ist … zu': Es ist wichtig/schwierig/möglich/interessant zu + infinitive.",
            examples: [
              { german: "Es ist wichtig, gesund zu essen.", english: "It is important to eat healthily." },
              { german: "Es ist schwierig, Deutsch zu lernen.", english: "It is difficult to learn German." },
              { german: "Es ist schön, hier zu sein.", english: "It is nice to be here." },
            ],
          },
        ],
      },
      {
        type: "quiz", title: "Quiz: Infinitiv mit zu",
        questions: [
          { question: "'Ich versuche, Deutsch ___ lernen.'", options: ["zu", "um zu", "ohne", "statt"], correct: 0 },
          { question: "Infinitive with zu of separable verb 'aufräumen':", options: ["zu aufräumen", "aufräumen zu", "aufzuräumen", "zu räumen auf"], correct: 2 },
          { question: "'Er vergisst immer, die Tür zu schließen.' means:", options: ["He always forgets to open the door", "He always forgets to close the door", "He always closes the door", "He never closes the door"], correct: 1 },
          { question: "'Es ist wichtig, gesund zu essen.' means:", options: ["It was important to eat healthily", "It is impossible to eat healthily", "It is important to eat healthily", "Eating healthily is not important"], correct: 2 },
          { question: "Which verb is NOT followed by 'zu + infinitive'?", options: ["versuchen", "vergessen", "können", "hoffen"], correct: 2, explanation: "Modal verbs (können, müssen, etc.) take a plain infinitive without 'zu'." },
        ],
      },
    ],
  },

  "30": {
    id: 30, courseId: 3, title: "Genitive Case", titleGerman: "Genitiv",
    icon: "🏛️", xpReward: 60,
    sections: [
      {
        type: "intro", title: "The Genitive Case (Genitiv)",
        content: "The genitive expresses possession or belonging — it's the equivalent of 'of' or apostrophe-s in English. While spoken German often replaces it with 'von + dative', the genitive is essential for reading, writing, and the B1 exam.",
      },
      {
        type: "grammar", title: "Genitive Articles & Noun Endings",
        grammar: [
          {
            rule: "Genitive articles: der → des (m), die → der (f), das → des (n), die → der (pl). Masculine and neuter nouns add -s or -es.",
            examples: [
              { german: "das Auto des Mannes (m)", english: "the man's car" },
              { german: "das Haus der Frau (f)", english: "the woman's house" },
              { german: "der Name des Kindes (n)", english: "the child's name" },
              { german: "die Meinung der Leute (pl)", english: "the people's opinion" },
            ],
          },
          {
            rule: "Genitive prepositions (always genitive): wegen (because of), trotz (despite), während (during), außerhalb (outside of), innerhalb (inside of), statt (instead of).",
            examples: [
              { german: "Wegen des schlechten Wetters blieben wir zu Hause.", english: "Because of the bad weather we stayed at home." },
              { german: "Trotz des Regens ging er spazieren.", english: "Despite the rain he went for a walk." },
              { german: "Während des Unterrichts darf man nicht telefonieren.", english: "During the lesson one may not make phone calls." },
              { german: "Statt des Kaffees trank sie Tee.", english: "Instead of the coffee she drank tea." },
            ],
          },
        ],
      },
      {
        type: "vocab", title: "Genitive in Use",
        vocab: [
          { german: "wegen + Genitiv", english: "because of", example: "Wegen des Staus kam er zu spät.", exampleTranslation: "Because of the traffic jam he arrived late." },
          { german: "trotz + Genitiv", english: "despite", example: "Trotz der Kälte ging sie joggen.", exampleTranslation: "Despite the cold she went jogging." },
          { german: "während + Genitiv", english: "during" },
          { german: "das Ende des Films", english: "the end of the film" },
          { german: "die Hauptstadt des Landes", english: "the capital of the country" },
          { german: "der Beginn des Semesters", english: "the start of the semester" },
          { german: "die Qualität der Produkte", english: "the quality of the products" },
          { german: "außerhalb der Stadt", english: "outside of the city" },
          { german: "innerhalb einer Stunde", english: "within an hour" },
          { german: "statt + Genitiv (instead of)", english: "instead of", example: "Statt des Busses nahm sie das Taxi.", exampleTranslation: "Instead of the bus she took the taxi." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Genitiv",
        questions: [
          { question: "'Das Auto ___ Mannes.' (des/der, masculine genitive)", options: ["der", "dem", "des", "den"], correct: 2 },
          { question: "'Wegen ___ schlechten Wetters ...' (das Wetter, genitive)", options: ["dem", "des", "der", "den"], correct: 1 },
          { question: "Which preposition takes the genitive?", options: ["mit", "aus", "trotz", "bei"], correct: 2 },
          { question: "'Trotz des Regens ging er spazieren.' means:", options: ["Because of the rain he stayed home", "Despite the rain he went for a walk", "During the rain he walked", "Without rain he walked"], correct: 1 },
          { question: "Genitive of 'die Frau':", options: ["dem Frau", "der Frau", "des Frau", "die Frau"], correct: 1 },
        ],
      },
    ],
  },

  "31": {
    id: 31, courseId: 3, title: "Society & Current Affairs", titleGerman: "Gesellschaft und Aktualität",
    icon: "🌍", xpReward: 60,
    sections: [
      {
        type: "intro", title: "Society & Current Affairs",
        content: "B1 requires you to discuss social topics, express opinions, and understand authentic texts. This lesson builds the vocabulary and phrases needed to talk about society, politics, and current affairs in German.",
      },
      {
        type: "vocab", title: "Society Vocabulary",
        vocab: [
          { german: "die Gesellschaft", english: "society", example: "In unserer Gesellschaft gibt es viele Probleme.", exampleTranslation: "In our society there are many problems." },
          { german: "die Umwelt / der Klimawandel", english: "the environment / climate change" },
          { german: "die Arbeitslosigkeit", english: "unemployment" },
          { german: "die Integration / die Migration", english: "integration / migration" },
          { german: "die Gleichberechtigung", english: "equal rights / gender equality" },
          { german: "das Gesundheitswesen", english: "the healthcare system" },
          { german: "die Bildung / das Bildungssystem", english: "education / the education system", example: "Das Bildungssystem in Deutschland ist regional unterschiedlich.", exampleTranslation: "The education system in Germany varies by region." },
          { german: "die Regierung / das Parlament", english: "the government / parliament" },
          { german: "wählen / die Wahl", english: "to vote / the election" },
          { german: "die Digitalisierung", english: "digitalisation", example: "Die Digitalisierung verändert die Arbeitswelt.", exampleTranslation: "Digitalisation is changing the world of work." },
        ],
      },
      {
        type: "vocab", title: "Expressing Opinions",
        vocab: [
          { german: "Ich bin der Meinung, dass ...", english: "I am of the opinion that ...", example: "Ich bin der Meinung, dass mehr für den Klimaschutz getan werden muss.", exampleTranslation: "I am of the opinion that more must be done for climate protection." },
          { german: "Meiner Ansicht nach ...", english: "In my view ..." },
          { german: "Einerseits ... andererseits ...", english: "On the one hand ... on the other hand ..." },
          { german: "Ich stimme zu / Ich stimme nicht zu.", english: "I agree / I disagree." },
          { german: "Das halte ich für wichtig.", english: "I consider that to be important." },
          { german: "Man sollte / Man müsste ...", english: "One should / One would have to ..." },
          { german: "Es gibt Vor- und Nachteile.", english: "There are advantages and disadvantages." },
          { german: "Auf der einen Seite ... auf der anderen Seite ...", english: "On the one side ... on the other side ..." },
          { german: "Das Problem ist, dass ...", english: "The problem is that ..." },
          { german: "Eine Lösung wäre, ...", english: "One solution would be ..." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Society & Opinions",
        questions: [
          { question: "What does 'die Gleichberechtigung' mean?", options: ["unemployment", "equal rights", "digitalisation", "healthcare"], correct: 1 },
          { question: "'Meiner Ansicht nach ...' introduces:", options: ["a fact", "a question", "your opinion", "a definition"], correct: 2 },
          { question: "'Einerseits ... andererseits ...' is used to:", options: ["give examples", "present two sides of an argument", "ask for clarification", "express agreement"], correct: 1 },
          { question: "What does 'die Digitalisierung verändert die Arbeitswelt' mean?", options: ["Digitalisation destroys jobs", "Digitalisation is changing the world of work", "Digital work is important", "The working world invented digitalisation"], correct: 1 },
          { question: "'Es gibt Vor- und Nachteile.' means:", options: ["It is very difficult.", "There are only advantages.", "There are advantages and disadvantages.", "The problem is solved."], correct: 2 },
        ],
      },
    ],
  },

  "32": {
    id: 32, courseId: 3, title: "Environment & Nature", titleGerman: "Umwelt und Natur",
    icon: "🌱", xpReward: 60,
    sections: [
      {
        type: "intro", title: "Environment & Nature",
        content: "Environmental topics appear frequently in B1 reading and speaking tasks. Learn the key vocabulary for nature, ecological problems, and sustainable living to handle these texts confidently.",
      },
      {
        type: "vocab", title: "Environment Vocabulary",
        vocab: [
          { german: "die Umwelt schützen", english: "to protect the environment", example: "Wir müssen die Umwelt schützen.", exampleTranslation: "We must protect the environment." },
          { german: "der Klimawandel / die Erderwärmung", english: "climate change / global warming" },
          { german: "die erneuerbaren Energien", english: "renewable energies", example: "Solar- und Windenergie sind erneuerbare Energien.", exampleTranslation: "Solar and wind energy are renewable energies." },
          { german: "der CO₂-Ausstoß", english: "CO₂ emissions" },
          { german: "recyceln / der Müll", english: "to recycle / the rubbish/waste" },
          { german: "die Mülltrennung", english: "waste separation/sorting" },
          { german: "der Treibhauseffekt", english: "the greenhouse effect" },
          { german: "die Abholzung", english: "deforestation" },
          { german: "umweltfreundlich / nachhaltig", english: "environmentally friendly / sustainable", example: "Ich versuche, nachhaltig zu leben.", exampleTranslation: "I try to live sustainably." },
          { german: "öffentliche Verkehrsmittel nutzen", english: "to use public transport", example: "Nutze öffentliche Verkehrsmittel statt des Autos.", exampleTranslation: "Use public transport instead of the car." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Environment",
        questions: [
          { question: "What is 'die Mülltrennung'?", options: ["recycling plant", "waste separation", "CO₂ reduction", "renewable energy"], correct: 1 },
          { question: "'Umweltfreundlich' means:", options: ["environmentally harmful", "environmentally friendly", "sustainable", "natural"], correct: 1 },
          { question: "'Die erneuerbaren Energien' includes:", options: ["coal and oil", "nuclear energy", "solar and wind energy", "diesel and petrol"], correct: 2 },
          { question: "'Wir müssen die Umwelt schützen.' means:", options: ["We are destroying the environment", "We must study the environment", "We must protect the environment", "We pollute the environment"], correct: 2 },
          { question: "What does 'nachhaltig' mean?", options: ["cheap", "modern", "sustainable", "digital"], correct: 2 },
        ],
      },
    ],
  },

  "33": {
    id: 33, courseId: 3, title: "Expressing Opinions", titleGerman: "Meinungen äußern",
    icon: "💬", xpReward: 60,
    sections: [
      {
        type: "intro", title: "Expressing Opinions (Meinungen äußern)",
        content: "The B1 speaking exam requires you to express and justify opinions, agree or disagree politely, and react to others' views. This lesson gives you all the tools to do this fluently and confidently.",
      },
      {
        type: "vocab", title: "Opinion & Discussion Phrases",
        vocab: [
          { german: "Ich finde, dass ...", english: "I think / find that ...", example: "Ich finde, dass Sport wichtig für die Gesundheit ist.", exampleTranslation: "I think that sport is important for health." },
          { german: "Meiner Meinung nach ...", english: "In my opinion ..." },
          { german: "Ich bin davon überzeugt, dass ...", english: "I am convinced that ..." },
          { german: "Das sehe ich anders.", english: "I see that differently." },
          { german: "Da haben Sie recht.", english: "You are right about that." },
          { german: "Das stimmt, aber ...", english: "That is true, but ..." },
          { german: "Ich bin damit einverstanden.", english: "I agree with that." },
          { german: "Ich bezweifle, dass ...", english: "I doubt that ..." },
          { german: "Zum Beispiel ...", english: "For example ..." },
          { german: "Das hängt davon ab, ob ...", english: "That depends on whether ..." },
        ],
      },
      {
        type: "vocab", title: "Structuring Your Argument",
        vocab: [
          { german: "Erstens / Zweitens / Drittens", english: "Firstly / Secondly / Thirdly", example: "Erstens ist es billiger, zweitens ist es schneller.", exampleTranslation: "Firstly it is cheaper, secondly it is faster." },
          { german: "Außerdem / Darüber hinaus", english: "Moreover / Furthermore" },
          { german: "Im Gegensatz dazu ...", english: "In contrast to that ..." },
          { german: "Deshalb / Deswegen / Daher", english: "Therefore / That is why / Hence" },
          { german: "Obwohl ...", english: "Although ...", example: "Obwohl es teuer ist, kaufe ich es.", exampleTranslation: "Although it is expensive, I am buying it." },
          { german: "Zusammenfassend kann man sagen, dass ...", english: "In summary one can say that ..." },
          { german: "Auf der einen Seite ... auf der anderen Seite ...", english: "On the one hand ... on the other hand ..." },
          { german: "Ich würde empfehlen, ...", english: "I would recommend ..." },
          { german: "Es kommt darauf an.", english: "It depends." },
          { german: "Was mich besonders interessiert / stört ist ...", english: "What particularly interests / bothers me is ..." },
        ],
      },
      {
        type: "quiz", title: "Quiz: Expressing Opinions",
        questions: [
          { question: "'Das sehe ich anders.' means:", options: ["I agree completely.", "I see that differently.", "That is correct.", "I don't understand."], correct: 1 },
          { question: "Which phrase introduces a counter-argument?", options: ["Ich finde, dass ...", "Das stimmt, aber ...", "Erstens ...", "Meiner Meinung nach ..."], correct: 1 },
          { question: "'Deshalb' means:", options: ["Although", "Furthermore", "Therefore", "In contrast"], correct: 2 },
          { question: "'Obwohl es teuer ist, kaufe ich es.' — 'obwohl' sends the verb to:", options: ["Position 1", "Position 2", "The end of the clause", "After the subject"], correct: 2 },
          { question: "How do you say 'In my opinion' in German?", options: ["Ich denke so.", "Meiner Meinung nach", "Das ist meine Idee.", "Ich glaube vielleicht."], correct: 1 },
        ],
      },
    ],
  },

  "34": {
    id: 34, courseId: 3, title: "Goethe B1: Lesen (Reading)", titleGerman: "Lesen",
    icon: "📖", xpReward: 80,
    sections: [
      {
        type: "intro", title: "B1 Reading (Lesen)",
        content: "The Goethe B1 Lesen section has 3 parts: matching headings to texts, reading a longer article and answering true/false/not mentioned, and reading short notices to find information. This lesson trains the key strategies and vocabulary.",
      },
      {
        type: "vocab", title: "Reading Strategy Vocabulary",
        vocab: [
          { german: "die Überschrift", english: "the heading / headline", example: "Welche Überschrift passt zum Text?", exampleTranslation: "Which heading fits the text?" },
          { german: "der Abschnitt", english: "the paragraph/section" },
          { german: "sinngemäß / inhaltlich", english: "according to meaning / in terms of content" },
          { german: "Richtig / Falsch / Nicht im Text", english: "True / False / Not mentioned in the text" },
          { german: "der Kerngedanke", english: "the main idea / key point" },
          { german: "laut dem Text ...", english: "according to the text ..." },
          { german: "Es steht im Text, dass ...", english: "It says in the text that ..." },
          { german: "der Verfasser / die Verfasserin", english: "the author (m/f)" },
          { german: "zusammenfassen", english: "to summarise", example: "Fassen Sie den Text zusammen.", exampleTranslation: "Summarise the text." },
          { german: "der Hauptgedanke", english: "the main thought/idea" },
        ],
      },
      {
        type: "quiz", title: "B1 Reading Practice",
        questions: [
          {
            question: "Text: 'Der Verein wurde 1998 gegründet. Er hat heute über 500 Mitglieder und organisiert jeden Monat kulturelle Veranstaltungen.' When was the club founded?",
            options: ["2008", "1998", "500 years ago", "This year"],
            correct: 1,
          },
          {
            question: "Heading options: A) Gesund essen B) Sport und Fitness C) Reisen im Urlaub. Text: 'Experten empfehlen täglich 30 Minuten Bewegung. Schon ein Spaziergang hilft.' Best heading?",
            options: ["A", "B", "C", "None fits"],
            correct: 1, explanation: "The text is about movement and exercise → B) Sport und Fitness.",
          },
          {
            question: "Text: 'Die Bibliothek ist montags geschlossen. Di–Fr 9–18 Uhr, Sa 10–14 Uhr.' Statement: 'The library is open on Saturday afternoon.' True/False/Not mentioned?",
            options: ["True", "False", "Not mentioned in the text"],
            correct: 1, explanation: "Saturday (Sa) is open 10–14 Uhr. 14 Uhr = 2 pm = not 'afternoon'. False.",
          },
          {
            question: "Ad: 'Sprachkurs Englisch B2. Voraussetzung: B1-Kenntnisse. Beginn: Oktober. Unkostenbeitrag: 120 €.' Who is this course for?",
            options: ["Complete beginners", "People with B1 English knowledge", "German speakers only", "Free for everyone"],
            correct: 1,
          },
          {
            question: "'Nicht im Text' means the statement is:",
            options: ["True according to the text", "False according to the text", "Neither confirmed nor denied by the text", "Wrong German"],
            correct: 2, explanation: "'Nicht im Text' = the text neither confirms nor denies the statement — it simply isn't mentioned.",
          },
        ],
      },
    ],
  },

  "35": {
    id: 35, courseId: 3, title: "Goethe B1: Hören (Listening)", titleGerman: "Hören",
    icon: "🎧", xpReward: 80,
    sections: [
      {
        type: "intro", title: "B1 Listening (Hören)",
        content: "The Goethe B1 Hören section has 4 parts: formal announcements, conversations, a longer interview/discussion, and short dialogues. This lesson covers key strategies, frequent listening vocabulary, and practice questions.",
      },
      {
        type: "vocab", title: "Listening Context Vocabulary",
        vocab: [
          { german: "die Durchsage", english: "the announcement (public/official)", example: "Achtung, eine Durchsage: Zug 42 hat Verspätung.", exampleTranslation: "Attention, an announcement: Train 42 is delayed." },
          { german: "die Verspätung", english: "the delay" },
          { german: "der Sprecher / die Sprecherin", english: "the speaker (m/f)" },
          { german: "die Meinung äußern", english: "to express an opinion" },
          { german: "zustimmen / widersprechen", english: "to agree / to disagree" },
          { german: "die Veranstaltung", english: "the event" },
          { german: "der Termin", english: "the appointment / date" },
          { german: "vereinbaren", english: "to arrange / agree on", example: "Wir möchten einen Termin vereinbaren.", exampleTranslation: "We would like to arrange an appointment." },
          { german: "die Uhrzeit / der Ort", english: "the time / the place" },
          { german: "das Formular ausfüllen", english: "to fill in the form" },
        ],
      },
      {
        type: "vocab", title: "Exam Strategies for Listening",
        vocab: [
          { german: "Lies die Fragen vor dem Hören.", english: "Read the questions before listening." },
          { german: "Schlüsselwörter unterstreichen", english: "Underline key words (in the questions)." },
          { german: "Zahlen und Daten notieren", english: "Note down numbers and dates." },
          { german: "Du hörst den Text zweimal.", english: "You hear the text twice." },
          { german: "Beim ersten Hören: Hauptidee erfassen.", english: "On the first listen: grasp the main idea." },
          { german: "Beim zweiten Hören: Details prüfen.", english: "On the second listen: check the details." },
          { german: "Keine Antwort auslassen!", english: "Don't leave any answer blank!" },
          { german: "die Falle", english: "the trap (distractor in a listening task)", example: "Vorsicht vor Fallen — sie nennen beide Optionen, wählen aber eine.", exampleTranslation: "Beware of traps — they mention both options but choose one." },
          { german: "der Kontext", english: "the context" },
          { german: "sinnvoll / passend", english: "sensible / fitting / appropriate" },
        ],
      },
      {
        type: "quiz", title: "B1 Listening Practice (Text-based)",
        questions: [
          {
            question: "Announcement: 'Der Zug nach Hamburg fährt heute nicht von Gleis 3, sondern von Gleis 7 ab.' Which platform?",
            options: ["Platform 3", "Platform 7", "Platform 37", "The train is cancelled"],
            correct: 1,
          },
          {
            question: "Dialogue: A says 'Sollen wir uns um 14 oder um 16 Uhr treffen?' B says 'Halb drei wäre mir lieber.' What time does B prefer?",
            options: ["14:00", "14:30", "15:30", "16:00"],
            correct: 1, explanation: "'Halb drei' = 2:30 pm = 14:30. B prefers 14:30.",
          },
          {
            question: "What is the best strategy for the first listen in a B1 Hören task?",
            options: ["Write down every word", "Grasp the main idea", "Check grammar", "Translate everything"],
            correct: 1,
          },
          {
            question: "Interview: 'Ich arbeite seit zehn Jahren als Lehrerin und finde meinen Job toll, auch wenn er manchmal stressig ist.' How does she feel about her job overall?",
            options: ["She hates it", "She finds it easy", "She likes it despite the stress", "She wants to change career"],
            correct: 2,
          },
          {
            question: "What does 'die Falle' mean in a listening exam context?",
            options: ["A trap / distractor answer", "A difficult word", "A missing answer", "A wrong question"], correct: 0,
          },
        ],
      },
    ],
  },

  "36": {
    id: 36, courseId: 3, title: "Goethe B1: Schreiben (Writing)", titleGerman: "Schreiben",
    icon: "✍️", xpReward: 80,
    sections: [
      {
        type: "intro", title: "B1 Writing (Schreiben)",
        content: "The B1 Schreiben exam has two tasks: writing a forum post/comment (about 80 words) and writing a semi-formal letter or email (about 100 words). You must address all bullet points given, use appropriate register, and structure your text clearly.",
      },
      {
        type: "vocab", title: "Formal Letter / Email Phrases",
        vocab: [
          { german: "Sehr geehrte Damen und Herren,", english: "Dear Sir/Madam, (formal, unknown recipient)" },
          { german: "Sehr geehrter Herr [Name],", english: "Dear Mr [Name], (formal, known recipient)" },
          { german: "Sehr geehrte Frau [Name],", english: "Dear Ms [Name], (formal, known recipient)" },
          { german: "Mit freundlichen Grüßen,", english: "Kind regards, (formal sign-off)" },
          { german: "Liebe/r [Name],", english: "Dear [Name], (semi-formal/friendly)" },
          { german: "Viele Grüße / Herzliche Grüße,", english: "Best wishes / Warm regards," },
          { german: "Ich schreibe Ihnen bezüglich ...", english: "I am writing to you regarding ..." },
          { german: "Ich würde mich freuen, von Ihnen zu hören.", english: "I would be pleased to hear from you." },
          { german: "Könnten Sie mir bitte mitteilen, ob ...?", english: "Could you please let me know whether ...?" },
          { german: "Ich bedanke mich für Ihre Hilfe.", english: "I thank you for your help." },
        ],
      },
      {
        type: "vocab", title: "Forum Post & Discussion Phrases",
        vocab: [
          { german: "Ich habe den Beitrag von ... gelesen und ...", english: "I have read the post by ... and ..." },
          { german: "Ich stimme zu, dass ...", english: "I agree that ..." },
          { german: "Ich sehe das etwas anders.", english: "I see that a little differently." },
          { german: "Meiner Erfahrung nach ...", english: "In my experience ..." },
          { german: "Ein gutes Beispiel dafür ist ...", english: "A good example of this is ..." },
          { german: "Ich würde vorschlagen, dass ...", english: "I would suggest that ..." },
          { german: "Das Thema ist sehr aktuell.", english: "The topic is very current/relevant." },
          { german: "Abschließend möchte ich sagen, dass ...", english: "In conclusion I would like to say that ..." },
          { german: "Ich hoffe, dass meine Meinung nützlich ist.", english: "I hope that my opinion is useful." },
          { german: "Was denken Sie darüber?", english: "What do you think about it?" },
        ],
      },
      {
        type: "quiz", title: "B1 Writing Practice",
        questions: [
          { question: "What is the correct formal opening for a letter to an unknown company?", options: ["Liebe Firma,", "Hallo,", "Sehr geehrte Damen und Herren,", "Guten Tag alle,"], correct: 2 },
          { question: "Correct formal sign-off for a letter:", options: ["Tschüss!", "Bis bald,", "Mit freundlichen Grüßen,", "Herzlichst,"], correct: 2 },
          { question: "In the B1 Schreiben, approximately how long should your letter/email be?", options: ["20 words", "50 words", "100 words", "300 words"], correct: 2 },
          { question: "'Könnten Sie mir bitte mitteilen, ob ...?' is used to:", options: ["Give information", "Politely request information", "Say goodbye", "Agree with someone"], correct: 1 },
          { question: "What must you do with ALL bullet points given in the writing task?", options: ["Choose two to address", "Ignore them and write freely", "Address all of them", "Only use them for ideas"], correct: 2 },
        ],
      },
    ],
  },

  "37": {
    id: 37, courseId: 3, title: "Goethe B1: Sprechen (Speaking)", titleGerman: "Sprechen",
    icon: "🎤", xpReward: 80,
    sections: [
      {
        type: "intro", title: "B1 Speaking (Sprechen)",
        content: "The Goethe B1 Sprechen exam has two parts: discussing a topic together with a partner (you both express opinions and make a joint decision), and presenting something individually. Fluency, interaction, and vocabulary range all count.",
      },
      {
        type: "vocab", title: "Discussion & Interaction Phrases",
        vocab: [
          { german: "Was meinen Sie dazu?", english: "What do you think about that?", example: "Das ist meine Meinung. Was meinen Sie dazu?", exampleTranslation: "That is my opinion. What do you think about that?" },
          { german: "Ich bin Ihrer Meinung.", english: "I agree with you. (formal)" },
          { german: "Könnten wir uns vielleicht auf ... einigen?", english: "Could we perhaps agree on ...?" },
          { german: "Das finde ich auch / nicht.", english: "I also think that / I don't think that." },
          { german: "Das ist ein guter Punkt.", english: "That is a good point." },
          { german: "Darf ich kurz etwas hinzufügen?", english: "May I quickly add something?" },
          { german: "Ich würde lieber ... wählen, weil ...", english: "I would rather choose ... because ..." },
          { german: "Was schlagen Sie vor?", english: "What do you suggest?" },
          { german: "Ich bin nicht sicher, ob ...", english: "I am not sure whether ..." },
          { german: "Lassen Sie uns zusammenfassen.", english: "Let us summarise." },
        ],
      },
      {
        type: "vocab", title: "Filler & Repair Phrases",
        vocab: [
          { german: "Ich meine, ...", english: "I mean, ..." },
          { german: "Also, ...", english: "Well, / So, ..." },
          { german: "Wie sagt man das auf Deutsch?", english: "How do you say that in German?" },
          { german: "Ich meinte eigentlich ...", english: "What I actually meant was ..." },
          { german: "Könnten Sie das bitte wiederholen?", english: "Could you please repeat that?" },
          { german: "Entschuldigung, ich habe das nicht verstanden.", english: "Sorry, I didn't understand that." },
          { german: "Das ist eine gute Frage.", english: "That is a good question." },
          { german: "Einen Moment bitte, ich überlege ...", english: "One moment please, I'm thinking ..." },
          { german: "sozusagen", english: "so to speak / as it were" },
          { german: "Das kommt darauf an.", english: "That depends." },
        ],
      },
      {
        type: "quiz", title: "Quiz: B1 Speaking",
        questions: [
          { question: "Your partner suggests an idea you like. Best response:", options: ["Nein, das stimmt nicht.", "Das ist ein guter Punkt.", "Ich verstehe Sie nicht.", "Bitte wiederholen Sie."], correct: 1 },
          { question: "'Könnten wir uns vielleicht auf ... einigen?' is used to:", options: ["Disagree strongly", "Ask for repetition", "Propose a joint decision", "End the conversation"], correct: 2 },
          { question: "You don't know a word in German. Best filler:", options: ["Stop speaking", "Use English", "Wie sagt man das auf Deutsch?", "Say nothing"], correct: 2 },
          { question: "Part 1 of B1 Sprechen requires you to:", options: ["Read a text aloud", "Discuss a topic and reach a joint decision with your partner", "Write an email", "Describe a picture silently"], correct: 1 },
          { question: "'Darf ich kurz etwas hinzufügen?' means:", options: ["Could you please repeat that?", "May I quickly add something?", "I disagree with you.", "Let us summarise."], correct: 1 },
        ],
      },
    ],
  },

  "38": {
    id: 38, courseId: 3, title: "Full B1 Mock Exam", titleGerman: "Vollständige B1 Prüfung",
    icon: "🏆", xpReward: 110,
    sections: [
      {
        type: "intro", title: "Full B1 Mock Exam",
        content: "This is your final practice session before the Goethe B1 exam. It contains exam-style questions across all four skills: Lesen, Hören (text-based), Schreiben, and Sprechen. Take your time and apply everything you have learnt.",
      },
      {
        type: "vocab", title: "Essential B1 Exam Tips",
        vocab: [
          { german: "Lies alle Aufgaben zuerst durch.", english: "Read all tasks through first." },
          { german: "Achte auf Schlüsselwörter.", english: "Pay attention to key words." },
          { german: "Beantworte alle Fragen.", english: "Answer all questions." },
          { german: "Überprüfe deine Grammatik.", english: "Check your grammar." },
          { german: "Schreibe vollständige Sätze.", english: "Write complete sentences." },
          { german: "Nutze einen vielfältigen Wortschatz.", english: "Use a varied vocabulary." },
          { german: "Bleibe beim Thema.", english: "Stay on topic." },
          { german: "Verwalte deine Zeit gut.", english: "Manage your time well." },
          { german: "Nicht im Text = weder bestätigt noch verneint.", english: "Not in text = neither confirmed nor denied." },
          { german: "Viel Erfolg!", english: "Good luck!" },
        ],
      },
      {
        type: "quiz", title: "B1 Mock Exam — Mixed Questions",
        questions: [
          {
            question: "Text: 'Maria arbeitet seit fünf Jahren bei einer Berliner IT-Firma. Obwohl ihr Gehalt gut ist, möchte sie sich beruflich verändern, weil sie eine neue Herausforderung sucht.' Why does Maria want to change jobs?",
            options: ["Her salary is too low", "She is moving to a new city", "She is looking for a new challenge", "She was made redundant"],
            correct: 2, explanation: "'weil sie eine neue Herausforderung sucht' = because she is looking for a new challenge.",
          },
          {
            question: "Fill in: 'Das Projekt wurde ___ dem Team erfolgreich abgeschlossen.' (by — passive agent)",
            options: ["für", "mit", "von", "durch"],
            correct: 2, explanation: "Passive agent: von + Dativ.",
          },
          {
            question: "'Wenn ich mehr Freizeit ___, würde ich öfter reisen.' (haben, Konjunktiv II)",
            options: ["hätte", "habe", "hatte", "würde haben"],
            correct: 0,
          },
          {
            question: "Notice: 'Achtung! Ab dem 1. Juli gelten neue Öffnungszeiten: Mo–Fr 8–17 Uhr (bisher 9–18 Uhr). Samstag weiterhin 10–14 Uhr.' What changes from 1 July?",
            options: ["Saturday hours change", "The shop closes permanently", "Weekday opening hours change to 8–17", "Nothing changes"],
            correct: 2,
          },
          {
            question: "You are in the B1 Sprechen exam. Your partner says: 'Ich finde, wir sollten Option A wählen.' You prefer Option B. Best response:",
            options: ["Nein.", "Das stimmt, aber ich würde lieber Option B wählen, weil sie flexibler ist.", "Ich verstehe Sie nicht.", "Option A ist falsch."],
            correct: 1, explanation: "Acknowledge their point ('Das stimmt'), then politely disagree with a reason — exactly what examiners want to hear.",
          },
        ],
      },
    ],
  },
};

function getFallbackLesson(topicId: string, courseId: string): TopicLesson {
  return {
    id: Number(topicId), courseId: Number(courseId),
    title: "Lesson Coming Soon", titleGerman: "Lektion kommt bald",
    icon: "📚", xpReward: 40,
    sections: [
      { type: "intro", title: "Coming Soon", content: "This lesson is currently being developed. Please check back soon for full content. In the meantime, try the lessons that are already available!" },
    ],
  };
}

type SectionStep = { sectionIdx: number; subStep: number };

export default function TopicLessonPage() {
  const { id: courseId, topicId } = useParams<{ id: string; topicId: string }>();
  const router = useRouter();
  const lesson: TopicLesson = TOPIC_LESSONS[topicId] || getFallbackLesson(topicId, courseId);

  const [step, setStep] = useState<SectionStep>({ sectionIdx: 0, subStep: 0 });
  const [flipped, setFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const section = lesson.sections[step.sectionIdx];

  const totalSections = lesson.sections.length;

  const progressPct = finished ? 100 : Math.round((step.sectionIdx / totalSections) * 100);

  useEffect(() => { setFlipped(false); setSelectedAnswer(null); }, [step]);

  function advance() {
    const s = lesson.sections[step.sectionIdx];
    if (s.type === "vocab") {
      const cards = s.vocab!;
      if (step.subStep < cards.length - 1) { setStep({ ...step, subStep: step.subStep + 1 }); return; }
    }
    if (s.type === "grammar") {
      const rules = s.grammar!;
      if (step.subStep < rules.length - 1) { setStep({ ...step, subStep: step.subStep + 1 }); return; }
    }
    const nextIdx = step.sectionIdx + 1;
    if (nextIdx >= totalSections) { setFinished(true); setXpEarned(lesson.xpReward); return; }
    setStep({ sectionIdx: nextIdx, subStep: 0 });
  }

  function handleQuizAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const q = section.questions![step.subStep];
    setQuizResults((prev) => [...prev, idx === q.correct]);
  }

  function advanceQuiz() {
    const questions = section.questions!;
    if (step.subStep < questions.length - 1) { setStep({ ...step, subStep: step.subStep + 1 }); return; }
    advance();
  }

  if (finished) {
    const correct = quizResults.filter(Boolean).length;
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <div className="hidden lg:block"><Sidebar /></div>
          <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white rounded-3xl shadow-lg p-10 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Complete!</h2>
              <p className="text-gray-500 mb-6">Great work on <strong>{lesson.title}</strong></p>
              <div className="flex justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">+{xpEarned}</div>
                  <div className="text-xs text-gray-500 mt-1">XP earned</div>
                </div>
                {quizResults.length > 0 && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">{correct}/{quizResults.length}</div>
                    <div className="text-xs text-gray-500 mt-1">Quiz score</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => { setStep({ sectionIdx: 0, subStep: 0 }); setFinished(false); setQuizResults([]); setXpEarned(0); }} className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Restart Lesson
                </button>
                <Link href={`/courses/${courseId}`} className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" /> Back to Course
                </Link>
                {/* Next topic shortcut — go to next topic id */}
                {lesson.id < (lesson.courseId === 1 ? 12 : lesson.courseId === 2 ? 24 : 38) && (
                  <Link href={`/courses/${courseId}/topics/${lesson.id + 1}`} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2">
                    Next Topic <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <div className="hidden lg:block"><Sidebar /></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Link href={`/courses/${courseId}`} className="p-2 rounded-xl hover:bg-gray-200 transition-colors text-gray-500">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{lesson.icon}</span>
                  <h1 className="font-bold text-gray-900">{lesson.title}</h1>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div className="bg-brand-500 h-2 rounded-full" animate={{ width: `${progressPct}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
                <Zap className="w-4 h-4" />+{lesson.xpReward} XP
              </div>
            </div>

            {/* Section label */}
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-4 uppercase tracking-wide">
              <span>Section {step.sectionIdx + 1} of {totalSections}</span>
              <span>·</span>
              <span>{section.title}</span>
            </div>

            {/* Intro section */}
            {section.type === "intro" && (
              <motion.div key={`intro-${step.sectionIdx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{section.content}</p>
                <button onClick={advance} className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2">
                  Start Learning <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Vocab flashcard */}
            {section.type === "vocab" && section.vocab && (
              <motion.div key={`vocab-${step.sectionIdx}-${step.subStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                <div className="text-center text-xs text-gray-400 mb-3">{step.subStep + 1} / {section.vocab.length}</div>
                <div className="relative cursor-pointer" onClick={() => setFlipped(!flipped)} style={{ perspective: 1000 }}>
                  <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.4 }} style={{ transformStyle: "preserve-3d", position: "relative" }}>
                    {/* Front */}
                    <div style={{ backfaceVisibility: "hidden" }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center min-h-[220px] flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-gray-900 mb-2">{section.vocab[step.subStep].german}</p>
                      <p className="text-sm text-gray-400">Tap to reveal</p>
                    </div>
                    {/* Back */}
                    <div style={{ backfaceVisibility: "hidden", rotateY: "180deg", position: "absolute", top: 0, left: 0, right: 0 }} className="bg-brand-50 rounded-3xl shadow-sm border border-brand-100 p-10 text-center min-h-[220px] flex flex-col items-center justify-center">
                      <p className="text-2xl font-bold text-brand-700 mb-3">{section.vocab[step.subStep].english}</p>
                      {section.vocab[step.subStep].example && (
                        <div className="mt-2 text-sm text-gray-600 italic">
                          <p>{section.vocab[step.subStep].example}</p>
                          <p className="text-gray-400 mt-1">{section.vocab[step.subStep].exampleTranslation}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="flex gap-3 mt-6">
                  {step.subStep > 0 && (
                    <button onClick={() => setStep({ ...step, subStep: step.subStep - 1 })} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  )}
                  <button onClick={advance} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2">
                    {step.subStep < section.vocab.length - 1 ? <><span>Next Card</span><ArrowRight className="w-4 h-4" /></> : <><span>Continue</span><ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Grammar section */}
            {section.type === "grammar" && section.grammar && (
              <motion.div key={`grammar-${step.sectionIdx}-${step.subStep}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                {section.grammar.length > 1 && (
                  <div className="text-xs text-gray-400 mb-4">{step.subStep + 1} / {section.grammar.length}</div>
                )}
                <p className="text-gray-700 font-medium mb-5 leading-relaxed">{section.grammar[step.subStep].rule}</p>
                <div className="space-y-3">
                  {section.grammar[step.subStep].examples.map((ex, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-semibold text-gray-900 sm:min-w-[250px]">{ex.german}</span>
                      {ex.english && <span className="text-gray-500 text-sm">{ex.english}</span>}
                    </div>
                  ))}
                </div>
                <button onClick={advance} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2">
                  {step.subStep < section.grammar.length - 1 ? <><span>Next Rule</span><ArrowRight className="w-4 h-4" /></> : <><span>Continue</span><ChevronRight className="w-4 h-4" /></>}
                </button>
              </motion.div>
            )}

            {/* Quiz section */}
            {section.type === "quiz" && section.questions && (
              <motion.div key={`quiz-${step.sectionIdx}-${step.subStep}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="text-xs text-gray-400 mb-4">Question {step.subStep + 1} of {section.questions.length}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">{section.questions[step.subStep].question}</h3>
                <div className="space-y-3 mb-6">
                  {section.questions[step.subStep].options.map((opt, i) => {
                    const q = section.questions![step.subStep];
                    const isSelected = selectedAnswer === i;
                    const isCorrect = i === q.correct;
                    const revealed = selectedAnswer !== null;
                    return (
                      <button key={i} onClick={() => handleQuizAnswer(i)} disabled={revealed}
                        className={cn("w-full text-left p-4 rounded-xl border-2 transition-all font-medium",
                          !revealed ? "border-gray-200 hover:border-brand-300 hover:bg-brand-50" :
                            isCorrect ? "border-green-400 bg-green-50 text-green-800" :
                              isSelected ? "border-red-400 bg-red-50 text-red-800" :
                                "border-gray-100 bg-gray-50 text-gray-400"
                        )}>
                        <div className="flex items-center gap-3">
                          <span className={cn("w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0",
                            !revealed ? "border-gray-300 text-gray-500" :
                              isCorrect ? "border-green-500 bg-green-500 text-white" :
                                isSelected ? "border-red-500 bg-red-500 text-white" : "border-gray-200 text-gray-300"
                          )}>
                            {revealed ? (isCorrect ? <CheckCircle2 className="w-4 h-4" /> : isSelected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                          </span>
                          {opt}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && (
                  <div className="mb-4">
                    {section.questions[step.subStep].explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                        💡 {section.questions[step.subStep].explanation}
                      </div>
                    )}
                    <button onClick={advanceQuiz} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2">
                      {step.subStep < section.questions.length - 1 ? <><span>Next Question</span><ArrowRight className="w-4 h-4" /></> : <><span>Finish Lesson</span><Trophy className="w-4 h-4" /></>}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
