export interface CourseReview {
  id: string;
  author: { name: string; initials: string };
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  markedHelpful: boolean;
  instructorReply?: {
    comment: string;
    createdAt: string;
  };
}
