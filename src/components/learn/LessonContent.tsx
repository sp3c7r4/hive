"use client";

import { VideoPlayer } from "./VideoPlayer";
import { PdfViewer } from "./PdfViewer";
import { LiveClass } from "./LiveClass";
import { QuizLesson } from "./QuizLesson";
import { AssignmentLesson } from "./AssignmentLesson";
import type { Lesson } from "./types";

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
