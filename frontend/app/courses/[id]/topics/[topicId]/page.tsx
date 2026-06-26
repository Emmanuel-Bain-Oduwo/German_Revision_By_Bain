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
