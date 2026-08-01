"use client";

import { AssignmentLesson } from "./AssignmentLesson";
import { LiveClass } from "./LiveClass";
import { PdfViewer } from "./PdfViewer";
import { QuizLesson } from "./QuizLesson";
import type { Lesson } from "./types";
import { VideoPlayer } from "./VideoPlayer";

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function LessonContent({ lesson, onComplete }: LessonContentProps) {
  switch (lesson.type) {
    case "video":
      return <VideoPlayer lesson={lesson} onComplete={onComplete} />;
    case "pdf":
      return <PdfViewer lesson={lesson} onComplete={onComplete} />;
    case "live":
      return <LiveClass lesson={lesson} onComplete={onComplete} />;
    case "quiz":
      return <QuizLesson lesson={lesson} onComplete={onComplete} />;
    case "assignment":
      return <AssignmentLesson lesson={lesson} onComplete={onComplete} />;
    default:
      return null;
  }
}
