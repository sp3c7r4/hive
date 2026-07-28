"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleQuestionMarkIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  ArrowRight02Icon,
  RefreshIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import type { Lesson } from "./types";

/* ---------------------------------------------------------------- */
/*  Demo quiz data                                                   */
/* ---------------------------------------------------------------- */

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DEMO_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What does JSX stand for?",
    options: [
      "JavaScript XML",
      "Java Syntax Extension",
      "JavaScript Extension",
      "JSON XML",
    ],
    correctIndex: 0,
    explanation:
      "JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows you to write HTML-like code in your React components.",
  },
  {
    id: "q2",
    question: "Which hook is used to manage state in a functional component?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctIndex: 1,
    explanation:
      "useState is the React hook used to add state to functional components. It returns a state variable and a function to update it.",
  },
  {
    id: "q3",
    question: "What is the virtual DOM?",
    options: [
      "A direct copy of the browser's DOM",
      "A lightweight JavaScript representation of the actual DOM",
      "A browser API for rendering HTML",
      "The server-side version of React",
    ],
    correctIndex: 1,
    explanation:
      "The virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to compute the most efficient way to update the browser's DOM.",
  },
  {
    id: "q4",
    question: "Which of the following is NOT a React Hook?",
    options: ["useMemo", "useCallback", "useComponent", "useRef"],
    correctIndex: 2,
    explanation:
      "useComponent is not a React Hook. useMemo, useCallback, and useRef are all built-in React Hooks.",
  },
  {
    id: "q5",
    question: "What does the useEffect hook do?",
    options: [
      "Creates a new component",
      "Handles side effects in functional components",
      "Updates the component state",
      "Creates a ref for DOM elements",
    ],
    correctIndex: 1,
    explanation:
      "useEffect handles side effects in functional components — like data fetching, subscriptions, and manually changing the DOM.",
  },
];

/* ---------------------------------------------------------------- */
/*  Component                                                        */
/* ---------------------------------------------------------------- */

interface QuizLessonProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function QuizLesson({ lesson, onComplete }: QuizLessonProps) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState(false);

  /* Initialize answers */
  const initAnswers = useCallback(() => {
    const a: Record<string, number | null> = {};
    for (const q of DEMO_QUESTIONS) a[q.id] = null;
    return a;
  }, []);

  const selectAnswer = useCallback(
    (questionId: string, optionIndex: number) => {
      if (submitted || completed) return;
      setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    },
    [submitted, completed]
  );

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setShowResults(true);
  }, []);

  const score = Object.entries(answers).filter(([qid, ans]) => {
    const q = DEMO_QUESTIONS.find((dq) => dq.id === qid);
    return q && ans === q.correctIndex;
  }).length;

  const allAnswered = Object.values(answers).every((a) => a !== null);
  const passThreshold = Math.ceil(DEMO_QUESTIONS.length * 0.7);
  const passed = score >= passThreshold;

  const handleRetry = useCallback(() => {
    setAnswers(initAnswers());
    setSubmitted(false);
    setShowResults(false);
    setCurrentQuestion(0);
  }, [initAnswers]);

  const handleComplete = useCallback(() => {
    setCompleted(true);
    onComplete();
  }, [onComplete]);

  /* Not started */
  if (!started) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="text-center">
          <div className="size-16 sm:size-20 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon icon={CircleQuestionMarkIcon} size={32} className="sm:size-[40px] text-amber-500" />
          </div>
          <p className="text-[11px] sm:text-xs text-muted-foreground mb-1">Quiz</p>
          <h2 className="text-lg sm:text-xl font-bold">{lesson.title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 mb-6 max-w-sm mx-auto">
            Test your knowledge with {DEMO_QUESTIONS.length} questions.
            You need {passThreshold} correct answers ({Math.round((passThreshold / DEMO_QUESTIONS.length) * 100)}%) to pass.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Card className="p-4 sm:p-5 w-full max-w-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Questions</span>
                <span className="text-sm font-bold">{DEMO_QUESTIONS.length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Pass threshold</span>
                <span className="text-sm font-bold">{Math.round((passThreshold / DEMO_QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Duration</span>
                <span className="text-sm font-bold">{lesson.duration}</span>
              </div>
            </Card>

            <Button className="rounded-full" size="lg" onClick={() => setStarted(true)}>
              Start Quiz
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* Results screen */
  if (showResults && !completed) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="text-center">
          <div
            className={`size-16 sm:size-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              passed
                ? "bg-emerald-50 dark:bg-emerald-950/20"
                : "bg-rose-50 dark:bg-rose-950/20"
            }`}
          >
            <HugeiconsIcon
              icon={passed ? CheckmarkCircle02Icon : Cancel01Icon}
              size={36}
              className={`sm:size-[44px] ${passed ? "text-emerald-500" : "text-rose-500"}`}
            />
          </div>

          <h2 className="text-lg sm:text-xl font-bold">
            {passed ? "You passed!" : "Not quite there"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-2">
            You scored {score} out of {DEMO_QUESTIONS.length}
          </p>

          {/* Score bar */}
          <div className="max-w-xs mx-auto mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Score</span>
              <span className="text-xs font-bold tabular-nums">
                {Math.round((score / DEMO_QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div className="relative flex h-2.5 w-full items-center overflow-x-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  passed ? "bg-emerald-500" : "bg-rose-500"
                }`}
                style={{ width: `${(score / DEMO_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {!passed && (
              <Button variant="outline" className="rounded-full" onClick={handleRetry}>
                <HugeiconsIcon icon={RefreshIcon} size={15} className="mr-1.5" />
                Retry Quiz
              </Button>
            )}
            <Button className="rounded-full" onClick={handleComplete}>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} className="mr-1.5" />
              Mark as Complete
            </Button>
          </div>
        </div>

        {/* Question review */}
        <div className="space-y-3 mt-4">
          <h3 className="text-sm font-semibold">Review</h3>
          {DEMO_QUESTIONS.map((q, qi) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctIndex;
            return (
              <Card key={q.id} className="p-3 sm:p-4">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isCorrect
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={isCorrect ? Tick01Icon : Cancel01Icon}
                      size={11}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {qi + 1}. {q.question}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your answer:{" "}
                      <span className={isCorrect ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                        {userAnswer != null ? q.options[userAnswer] : "Not answered"}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Correct: {q.options[q.correctIndex]}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  /* Question view */
  const q = DEMO_QUESTIONS[currentQuestion];

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={CircleQuestionMarkIcon} size={15} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Quiz</p>
            <h2 className="text-sm font-bold">{lesson.title}</h2>
          </div>
        </div>
        <Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">
          {currentQuestion + 1} of {DEMO_QUESTIONS.length}
        </Badge>
      </div>

      {/* Progress */}
      <div className="relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full bg-muted">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / DEMO_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <Card className="p-4 sm:p-6">
        <p className="text-sm sm:text-base font-semibold leading-snug mb-5">
          {currentQuestion + 1}. {q.question}
        </p>

        <div className="space-y-2.5">
          {q.options.map((option, oi) => {
            const isSelected = answers[q.id] === oi;
            const isCorrectOption = submitted && oi === q.correctIndex;
            const isWrongSelection = submitted && isSelected && !isCorrectOption;

            return (
              <button
                key={oi}
                type="button"
                disabled={submitted}
                onClick={() => selectAnswer(q.id, oi)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                  isCorrectOption
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : isWrongSelection
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20"
                    : isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                } ${submitted ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                      isCorrectOption
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isWrongSelection
                        ? "border-rose-500 bg-rose-500 text-white"
                        : isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {isCorrectOption || isWrongSelection ? (
                      <HugeiconsIcon
                        icon={isCorrectOption ? Tick01Icon : Cancel01Icon}
                        size={12}
                      />
                    ) : (
                      String.fromCharCode(65 + oi)
                    )}
                  </span>
                  <span className={isCorrectOption ? "font-semibold text-emerald-700 dark:text-emerald-300" : ""}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit feedback */}
        {submitted && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs leading-relaxed ${
              answers[q.id] === q.correctIndex
                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300"
            }`}
          >
            <p className="font-semibold mb-0.5">
              {answers[q.id] === q.correctIndex ? "Correct!" : "Incorrect"}
            </p>
            <p>{q.explanation}</p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion((c) => c - 1)}
          className="rounded-full text-xs"
        >
          Previous
        </Button>

        <div className="flex items-center gap-1.5">
          {DEMO_QUESTIONS.map((_, qi) => (
            <button
              key={qi}
              type="button"
              onClick={() => !submitted && setCurrentQuestion(qi)}
              className={`size-2 rounded-full transition-all ${
                qi === currentQuestion
                  ? "bg-amber-500 scale-125"
                  : answers[DEMO_QUESTIONS[qi].id] != null
                  ? "bg-primary/60"
                  : "bg-muted-foreground/25"
              }`}
              aria-label={`Go to question ${qi + 1}`}
            />
          ))}
        </div>

        {currentQuestion < DEMO_QUESTIONS.length - 1 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentQuestion((c) => c + 1)}
            className="rounded-full text-xs"
          >
            Next
          </Button>
        ) : (
          !submitted && (
            <Button
              size="sm"
              className="rounded-full text-xs"
              disabled={!allAnswered}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )
        )}
      </div>

      {/* Submit all button at last question */}
      {currentQuestion === DEMO_QUESTIONS.length - 1 && !submitted && (
        <Button
          className="rounded-full w-full"
          disabled={!allAnswered}
          onClick={handleSubmit}
          size="lg"
        >
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="mr-1.5" />
          Submit Quiz
        </Button>
      )}
    </div>
  );
}
