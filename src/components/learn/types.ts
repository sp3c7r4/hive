export type LessonType = "video" | "pdf" | "live" | "quiz" | "assignment";
export type LessonStatus = "completed" | "current" | "locked";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  status: LessonStatus;
  scheduledTime?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}
