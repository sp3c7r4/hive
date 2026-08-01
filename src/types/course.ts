export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
  id: number;
  title: string;
  description: string | null;
  status: CourseStatus;
  communityId: number;
  instructorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  communityId: number;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  status?: CourseStatus;
}

export interface Module {
  id: number;
  title: string;
  position: number;
  courseId: number;
}

export interface CreateModuleInput {
  title: string;
  position?: number;
}

export interface Lesson {
  id: number;
  title: string;
  type: "video" | "quiz" | "assignment" | "live" | "pdf";
  moduleId: number;
  position: number;
}
