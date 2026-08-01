export type EnrollmentStatus = "active" | "completed" | "cancelled";

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  completedAt: string | null;
}
