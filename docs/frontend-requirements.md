# Hive Backend API Specification

> Generated from the feature-complete Hive frontend (Next.js 16, React 19).
> Target stack: Hono + Drizzle ORM + PostgreSQL + Zod + BullMQ + JWT (RS256).
> Every endpoint below is evidenced by actual frontend code.

---

## 1. TypeScript Entity-Relationship Diagram

```ts
// ── users ──
interface User {
  id: number;
  email: string;                  // unique
  passwordHash: string;
  role: "student" | "instructor" | "parent" | "admin";
  firstName: string;
  lastName: string;
  bio: string | null;
  phone: string | null;
  avatarUrl: string | null;
  specializationTags: string[];   // JSONB, instructor only
  interestTags: string[];         // JSONB, student only
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

```ts
// ── courses ──
interface Course {
  id: number;
  instructorId: number;           // FK → User.id
  communityId: number;            // FK → Community.id
  title: string;
  slug: string;                   // unique
  subtitle: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  visibility: "public" | "private";
  price: number;                  // kobo, 0 = free
  isFree: boolean;
  monthlyPrice: number | null;    // kobo
  coverImageUrl: string | null;
  sequentialAccess: boolean;
  dripContent: boolean;
  allowComments: boolean;
  allowDownloads: boolean;
  offerCertificate: boolean;
  minCompletionPercent: number;
  minQuizScorePercent: number;
  minAttendancePercent: number;
  status: "draft" | "published" | "archived";
  enrollmentCount: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

```ts
// ── modules ──
interface Module {
  id: number;
  courseId: number;               // FK → Course.id
  title: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
```

```ts
// ── lessons ──
interface Lesson {
  id: number;
  moduleId: number;               // FK → Module.id
  title: string;
  description: string | null;
  type: "video" | "pdf" | "live" | "quiz" | "assignment";
  duration: string;
  sortOrder: number;
  freePreview: boolean;
  status: "draft" | "published";
  videoUrl: string | null;
  pdfUrl: string | null;
  liveMeetingLink: string | null;
  liveMeetingDate: string | null;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
```

```ts
// ── quiz_questions ──
interface QuizQuestion {
  id: number;
  lessonId: number;               // FK → Lesson.id
  type: "multiple" | "truefalse" | "fillblank";
  text: string;
  options: string[] | null;       // JSONB
  correctAnswer: string;
  explanation: string | null;
  points: number;
  sortOrder: number;
}
```

```ts
// ── quiz_attempts ──
interface QuizAttempt {
  id: number;
  userId: number;                 // FK → User.id
  lessonId: number;               // FK → Lesson.id
  questionId: number;             // FK → QuizQuestion.id
  selectedAnswer: string | null;
  isCorrect: boolean;
  attemptedAt: string;
}
```

```ts
// ── assignment_submissions ──
interface AssignmentSubmission {
  id: number;
  userId: number;                 // FK → User.id
  lessonId: number;               // FK → Lesson.id
  text: string | null;
  fileUrls: string[];             // JSONB
  status: "pending" | "submitted" | "graded" | "returned";
  score: number | null;
  feedback: string | null;
  submittedAt: string | null;
  gradedAt: string | null;
}
```

```ts
// ── communities ──
interface Community {
  id: number;
  ownerId: number;                // FK → User.id
  name: string;
  slug: string;
  description: string;
  category: string;
  visibility: "public" | "private" | "invite-only";
  requiresApproval: boolean;
  isPaid: boolean;
  price: number | null;           // kobo
  coverImageUrl: string | null;
  memberCount: number;
  courseCount: number;
  averageRating: number;
  reviewCount: number;
  sequentialCourses: boolean;
  allowDownloads: boolean;
  maxConcurrentDevices: number;
  gracePeriodDays: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

```ts
// ── community_members ──
interface CommunityMember {
  id: number;
  communityId: number;            // FK → Community.id
  userId: number;                 // FK → User.id
  role: "owner" | "admin" | "member" | "guest";
  status: "active" | "blocked" | "pending";
  joinedAt: string;
  expiresAt: string | null;
}
```

```ts
// ── community_invites ──
interface CommunityInvite {
  id: number;
  communityId: number;            // FK → Community.id
  invitedBy: number;              // FK → User.id
  email: string;
  status: "pending" | "accepted" | "expired";
  sentAt: string;
  acceptedAt: string | null;
}
```

```ts
// ── enrollments ──
interface Enrollment {
  id: number;
  userId: number;                 // FK → User.id
  courseId: number;               // FK → Course.id
  enrolledById: number | null;    // FK → User.id (parent)
  progressPercent: number;
  completedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}
```

```ts
// ── lesson_progress ──
interface LessonProgress {
  id: number;
  enrollmentId: number;           // FK → Enrollment.id
  lessonId: number;               // FK → Lesson.id
  completed: boolean;
  lastPositionSeconds: number;
  completedAt: string | null;
  updatedAt: string;
}
```

```ts
// ── payments ──
interface Payment {
  id: number;
  userId: number;                 // FK → User.id
  enrollmentId: number | null;    // FK → Enrollment.id
  communityId: number | null;     // FK → Community.id
  amount: number;                 // kobo
  platformFee: number;            // kobo, 10%
  status: "success" | "failed" | "pending" | "refunded";
  method: string;
  reference: string;
  type: "enrollment" | "subscription" | "withdrawal";
  description: string;
  studentId: number | null;       // FK → User.id
  receiptUrl: string | null;
  createdAt: string;
}
```

```ts
// ── withdrawals ──
interface Withdrawal {
  id: number;
  instructorId: number;           // FK → User.id
  amount: number;                 // kobo
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: "pending" | "processing" | "completed" | "failed";
  reference: string;
  requestedAt: string;
  processedAt: string | null;
}
```

```ts
// ── reviews ──
interface Review {
  id: number;
  courseId: number;               // FK → Course.id
  userId: number;                 // FK → User.id
  rating: number;                 // 1-5
  title: string | null;
  comment: string;
  helpfulCount: number;
  helpfulByUserIds: number[];     // JSONB
  createdAt: string;
  updatedAt: string;
}
```

```ts
// ── instructor_replies ──
interface InstructorReply {
  id: number;
  reviewId: number;               // FK → Review.id
  instructorId: number;           // FK → User.id
  comment: string;
  createdAt: string;
}
```

```ts
// ── certificates ──
interface Certificate {
  id: number;
  userId: number;                 // FK → User.id
  courseId: number;               // FK → Course.id
  enrollmentId: number;           // FK → Enrollment.id
  code: string;                   // unique
  issuedAt: string;
  completionPercent: number;
  quizScorePercent: number;
  attendancePercent: number;
}
```

```ts
// ── messages ──
interface Message {
  id: number;
  conversationId: number;         // FK → Conversation.id
  senderId: number;               // FK → User.id
  text: string | null;
  attachmentType: "image" | "file" | null;
  attachmentName: string | null;
  attachmentSize: string | null;
  attachmentUrl: string | null;
  status: "sent" | "delivered" | "read";
  createdAt: string;
}
```

```ts
// ── conversations ──
interface Conversation {
  id: number;
  type: "direct" | "community";
  communityId: number | null;     // FK → Community.id
  name: string | null;
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}
```

```ts
// ── conversation_participants ──
interface ConversationParticipant {
  id: number;
  conversationId: number;         // FK → Conversation.id
  userId: number;                 // FK → User.id
  pinned: boolean;
  muted: boolean;
  lastReadAt: string;
}
```

```ts
// ── posts ──
interface Post {
  id: number;
  communityId: number;            // FK → Community.id
  authorId: number;               // FK → User.id
  content: string;
  type: "post" | "announcement";
  pinned: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}
```

```ts
// ── post_likes ──
interface PostLike {
  postId: number;                 // FK → Post.id
  userId: number;                 // FK → User.id
}

// ── post_comments ──
interface PostComment {
  id: number;
  postId: number;                 // FK → Post.id
  authorId: number;               // FK → User.id
  content: string;
  createdAt: string;
}
```

```ts
// ── notifications ──
interface Notification {
  id: number;
  userId: number;                 // FK → User.id
  type: string;
  title: string;
  body: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}
```

```ts
// ── notification_preferences ──
interface NotificationPreference {
  userId: number;                 // PK, FK → User.id
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
}
```

```ts
// ── sessions ──
interface Session {
  id: number;
  userId: number;                 // FK → User.id
  device: string;
  ip: string;
  location: string;
  refreshToken: string;
  lastActiveAt: string;
  expiresAt: string;
  createdAt: string;
}
```

```ts
// ── parent_child_links ──
interface ParentChildLink {
  id: number;
  parentId: number;               // FK → User.id
  childId: number;                // FK → User.id
  status: "active" | "pending" | "rejected";
  requestedAt: string;
  approvedAt: string | null;
}
```

```ts
// ── activity_logs ──
interface ActivityLog {
  id: number;
  userId: number | null;          // FK → User.id
  action: string;
  entity: string;
  entityId: number | null;
  metadata: Record<string, unknown>;  // JSONB
  ip: string;
  createdAt: string;
}
```

### Relationship Summary

| Relationship | Type | Via |
|---|---|---|
| User → Courses (instructor) | 1:N | Course.instructorId |
| User → Communities (owner) | 1:N | Community.ownerId |
| User ↔ Communities (member) | N:N | CommunityMember |
| User ↔ Courses (student) | N:N | Enrollment |
| Course → Modules | 1:N | Module.courseId |
| Module → Lessons | 1:N | Lesson.moduleId |
| Lesson → QuizQuestions | 1:N | QuizQuestion.lessonId |
| Community → Courses | 1:N | Course.communityId |
| Community → Posts | 1:N | Post.communityId |
| Post → Comments | 1:N | PostComment.postId |
| Post ↔ User (like) | N:N | PostLike |
| Course → Reviews | 1:N | Review.courseId |
| Review → InstructorReply | 1:1 | InstructorReply.reviewId |
| Enrollment → LessonProgress | 1:N | LessonProgress.enrollmentId |
| Parent ↔ Child | N:N | ParentChildLink |
| User → Conversations | N:N | ConversationParticipant |
| Conversation → Messages | 1:N | Message.conversationId |
| User → Payments | 1:N | Payment.userId |
| User → Withdrawals | 1:N | Withdrawal.instructorId |

---

## 2. API Endpoints

### 2.1 Auth

#### Register (initiate signup)
| | |
|---|---|
| Trigger | SignUpForm |
| Auth | Public |
| Method & Route | POST /api/v1/auth/register |
| Content-Type | application/json |

```ts
interface RegisterRequest {
  role: "student" | "instructor" | "parent";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```
Validation: role required/valid, firstName min 2 chars, lastName min 2 chars, valid email, password min 8 chars.

```ts
interface RegisterResponse {
  data: { message: string; expiresInSeconds: 60 };
}
```
> Note: 6-digit OTP emailed. No JWT issued yet. Navigate to OTP screen.

Error: 409 email already registered.

#### Verify OTP
| | |
|---|---|
| Trigger | VerifyOTPForm |
| Auth | Public |
| Method & Route | POST /api/v1/auth/verify-otp |

```ts
interface VerifyOtpRequest {
  email: string;
  otp: string;
  source: "signup" | "forgot-password";
}
```

```ts
interface VerifyOtpResponse {
  data: {
    accessToken: string;    // JWT RS256, 15min
    refreshToken: string;   // 7d
    user: { id: number; email: string; role: string; firstName: string; lastName: string; onboardingCompleted: boolean; };
  };
}
```
> Note: For `forgot-password` source, return a temp resetToken instead of JWT.

Error: 400 invalid/expired OTP.

#### Login
| | |
|---|---|
| Trigger | LoginForm |
| Auth | Public |
| Method & Route | POST /api/v1/auth/login |

```ts
interface LoginRequest {
  email: string;
  password: string;
  role: "student" | "instructor" | "parent" | "admin";
  remember: boolean;
}
```

```ts
interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: { id: number; email: string; role: string; firstName: string; lastName: string; onboardingCompleted: boolean; };
  };
}
```
> Note: `remember=true` → refresh token 30d instead of 7d.

Error: 401 invalid credentials, 403 role mismatch.

#### Refresh Token
| | |
|---|---|
| Auth | Public |
| Method & Route | POST /api/v1/auth/refresh |

```ts
interface RefreshRequest { refreshToken: string; }
interface RefreshResponse { data: { accessToken: string; refreshToken: string; }; }
```

#### Forgot Password
| | |
|---|---|
| Trigger | ForgotPasswordForm |
| Auth | Public |
| Method & Route | POST /api/v1/auth/forgot-password |

```ts
interface ForgotPasswordRequest { email: string; role: string; }
```
> Note: Always return 200 (prevents enumeration).

#### Reset Password
| | |
|---|---|
| Trigger | ResetPasswordForm |
| Auth | Reset token |
| Method & Route | POST /api/v1/auth/reset-password |

```ts
interface ResetPasswordRequest { resetToken: string; password: string; }
```
Validation: password min 8 chars.

#### Logout
| | |
|---|---|
| Auth | Authenticated |
| Method & Route | POST /api/v1/auth/logout |
> Note: Invalidate refresh token server-side.

#### Google OAuth
| | |
|---|---|
| Auth | Public |
| Route | GET /api/v1/auth/google → callback GET /api/v1/auth/google/callback |

#### Apple OAuth
| | |
|---|---|
| Auth | Public |
| Route | GET /api/v1/auth/apple → callback GET /api/v1/auth/apple/callback |

---

### 2.2 Users

#### Get current user
| | |
|---|---|
| Auth | Authenticated |
| Route | GET /api/v1/users/me |
```ts
interface GetMeResponse {
  data: { id: number; email: string; role: string; firstName: string; lastName: string; bio: string | null; phone: string | null; avatarUrl: string | null; specializationTags: string[]; interestTags: string[]; onboardingCompleted: boolean; createdAt: string; };
}
```

#### Update profile
| | |
|---|---|
| Auth | Authenticated |
| Route | PATCH /api/v1/users/me |
```ts
interface UpdateProfileRequest { firstName?: string; lastName?: string; bio?: string; phone?: string; }
```

#### Upload avatar
| | |
|---|---|
| Auth | Authenticated |
| Route | POST /api/v1/users/me/avatar |
| Content-Type | multipart/form-data |
```ts
interface UploadAvatarRequest { file: File; }
interface UploadAvatarResponse { data: { avatarUrl: string; }; }
```
Error: 413 too large, 422 invalid mime type.

#### Change password
| | |
|---|---|
| Auth | Authenticated |
| Route | POST /api/v1/users/me/password |
```ts
interface ChangePasswordRequest { currentPassword: string; newPassword: string; }
```
Error: 403 current password incorrect.

#### Delete account
| | |
|---|---|
| Auth | Authenticated |
| Route | POST /api/v1/users/me/delete |
```ts
interface DeleteAccountRequest { confirmation: string; }  // must equal "delete my account"
```
> Note: Soft-delete, retain 30 days per Nigerian law.

#### Complete onboarding
| | |
|---|---|
| Auth | Authenticated |
| Route | POST /api/v1/users/me/onboarding |
```ts
interface OnboardingRequest {
  avatarUrl?: string;
  bio?: string;
  specializationTags?: string[];
  interestTags?: string[];
  notifications: { email: boolean; sms: boolean; whatsapp: boolean; push: boolean; };
}
```

#### Notification preferences & Sessions
| | |
|---|---|
| Auth | Authenticated |
| Routes | PATCH /api/v1/users/me/notifications, GET /api/v1/users/me/sessions, DELETE /api/v1/users/me/sessions/:id, POST /api/v1/users/me/sessions/revoke-all |

---

### 2.3 Parent-Student Linking

| Route | Method | Description |
|---|---|---|
| /api/v1/parent/children/search?email= | GET | Search student by email |
| /api/v1/parent/children/link | POST | Send link request `{ childId: number }` |
| /api/v1/parent/children | GET | List linked children |
| /api/v1/parent/children/:linkId/respond | POST | Approve/reject `{ action: "approve"|"reject" }` |
| /api/v1/parent/children/:childId | GET | Child detail + enrollments |
| /api/v1/parent/children/:childId | DELETE | Unlink |

---

### 2.4 Courses

| Route | Method | Description |
|---|---|---|
| /api/v1/courses | GET | Instructor's courses |
| /api/v1/courses | POST | Create course |
| /api/v1/courses/:courseId | GET | Course detail (manage view) |
| /api/v1/courses/:courseId | PATCH | Update settings |
| /api/v1/courses/:courseId/cover | POST | Upload cover (multipart) |
| /api/v1/courses/:courseId/publish | POST | Publish (validates readiness) |
| /api/v1/courses/:courseId/archive | POST | Archive |
| /api/v1/courses/:courseId/modules | POST | Create module |
| /api/v1/courses/:courseId/modules/reorder | PATCH | Reorder `{ order: number[] }` |
| /api/v1/courses/:courseId/modules/:moduleId | PATCH/DELETE | Update/delete module |
| /api/v1/courses/:courseId/modules/:moduleId/lessons | POST | Create lesson |
| /api/v1/courses/:courseId/modules/:moduleId/lessons/:lessonId | PATCH/DELETE | Update/delete lesson |
| /api/v1/courses/:courseId/modules/:moduleId/lessons/:lessonId/attachment | POST | Upload attachment (multipart) |
| /api/v1/courses/:courseId/modules/:moduleId/lessons/reorder | PATCH | Reorder |
| /api/v1/courses/:courseId/modules/:moduleId/lessons/:lessonId/questions | GET/POST | Quiz questions |
| /api/v1/courses/:courseId/modules/:moduleId/lessons/:lessonId/questions/:qId | PATCH/DELETE | Update/delete question |
| /api/v1/courses/:courseId/assignments/:lessonId/submissions | GET | Assignment submissions |
| /api/v1/courses/:courseId/assignments/:lessonId/submissions/:subId/grade | PATCH | `{ score: number; feedback?: string }` |

---

### 2.5 Explore & Discovery

| Route | Method | Description |
|---|---|---|
| /api/v1/explore/courses?category=&difficulty=&price=&search= | GET | Public courses only |
| /api/v1/explore/communities?category=&price=&search= | GET | Browse communities |
| /api/v1/explore/courses/:slug | GET | Course landing page (with enrolled/completed/isMember flags) |
| /api/v1/explore/communities/:slug | GET | Community landing page (with isMember flag) |

---

### 2.6 Enrollments & Learning

| Route | Method | Description |
|---|---|---|
| /api/v1/enrollments | POST | Enroll `{ courseId; paymentReference?; childId? }` |
| /api/v1/enrollments/:courseId/learn | GET | Learning view (full curriculum + progress) |
| /api/v1/enrollments/:courseId/lessons/:lessonId/progress | POST | Auto-save `{ lastPositionSeconds; completed }` |
| /api/v1/enrollments/:courseId/lessons/:lessonId/quiz | POST | Submit `{ answers[] }` |
| /api/v1/enrollments/:courseId/lessons/:lessonId/assignment | POST | Submit (multipart) |
| /api/v1/enrollments/:courseId/completion | GET | Completion status |

---

### 2.7 Reviews

| Route | Method | Description |
|---|---|---|
| /api/v1/courses/:courseId/reviews | GET | List reviews |
| /api/v1/courses/:courseId/reviews | POST | Create `{ rating; title?; comment }` |
| /api/v1/courses/:courseId/reviews/:reviewId/helpful | POST | Toggle helpful |
| /api/v1/courses/:courseId/reviews/:reviewId/reply | POST | Instructor reply `{ comment }` |

---

### 2.8 Payments

| Route | Method | Description |
|---|---|---|
| /api/v1/payments | GET | Payment history |
| /api/v1/payments/subscriptions | GET | Active subscriptions |
| /api/v1/payments/initialize | POST | `{ courseId; childId?; referralCode? }` → Paystack auth URL |
| /api/v1/payments/verify | POST | Webhook/callback `{ reference }` |
| /api/v1/payments/:id/receipt | GET | PDF receipt |

---

### 2.9 Withdrawals

| Route | Method | Description |
|---|---|---|
| /api/v1/withdrawals/summary | GET | Total/available/month earnings |
| /api/v1/withdrawals/history | GET | Earnings + withdrawal history |
| /api/v1/withdrawals/analytics?period= | GET | Chart data |
| /api/v1/withdrawals/verify-bank | POST | `{ bankName; accountNumber; accountName }` |
| /api/v1/withdrawals | POST | Request `{ amount; bankName; accountNumber; accountName }` |
| /api/v1/withdrawals | GET | Withdrawal list |

---

### 2.10 Communities

| Route | Method | Description |
|---|---|---|
| /api/v1/communities | GET | Instructor's communities |
| /api/v1/communities/my | GET | Student's joined communities |
| /api/v1/communities | POST | Create community |
| /api/v1/communities/:slug/manage | GET | Manage view |
| /api/v1/communities/:slug | PATCH | Update settings |
| /api/v1/communities/:slug/cover | POST | Upload cover |
| /api/v1/communities/:slug/archive | POST | Archive |
| /api/v1/communities/:slug/members | GET | Member list |
| /api/v1/communities/:slug/members/:userId/approve | POST | Approve pending |
| /api/v1/communities/:slug/members/:userId/toggle-block | POST | Block/unblock |
| /api/v1/communities/:slug/members/:userId/role | PATCH | Change role |
| /api/v1/communities/:slug/invites | POST | `{ email }` |
| /api/v1/communities/:slug/invite-link | GET | Invite URL |
| /api/v1/communities/:slug/join | POST | `{ inviteCode?; paymentReference? }` |
| /api/v1/communities/:slug/courses | GET | Community's courses |
| /api/v1/communities/:slug/feed | GET | Feed posts |
| /api/v1/communities/:slug/feed | POST | Create post `{ content; type }` |
| /api/v1/communities/:slug/feed/:postId/like | POST | Toggle like |
| /api/v1/communities/:slug/feed/:postId/comments | POST | Comment `{ content }` |
| /api/v1/communities/:slug/feed/:postId/pin | POST | Pin/unpin |
| /api/v1/communities/:slug/feed/:postId | DELETE | Delete post |
| /api/v1/communities/:slug/analytics | GET | Analytics data |

---

### 2.11 Messages

| Route | Method | Description |
|---|---|---|
| /api/v1/messages/conversations | GET | List conversations |
| /api/v1/messages/conversations | POST | Start new `{ participantId }` |
| /api/v1/messages/conversations/:id | GET | Messages |
| /api/v1/messages/conversations/:id | POST | Send `{ text?; attachment? }` |
| /api/v1/messages/upload | POST | Upload attachment (multipart) |
| /api/v1/messages/conversations/:id/messages/:mid/react | POST | `{ reaction }` |
| /api/v1/messages/conversations/:id/toggle-mute | POST | Mute/unmute |
| /api/v1/messages/conversations/:id/toggle-pin | POST | Pin/unpin |
| /api/v1/messages/conversations/:id/read | POST | Mark read |

---

### 2.12 Certificates

| Route | Method | Auth | Description |
|---|---|---|---|
| /api/v1/certificates | GET | Authenticated | User's certificates |
| /api/v1/certificates/:code/preview | GET | Authenticated | Preview data |
| /api/v1/certificates/verify/:code | GET | Public | Verify certificate |

---

### 2.13 Admin

| Route | Method | Description |
|---|---|---|
| /api/v1/admin/dashboard | GET | Stats overview |
| /api/v1/admin/users | GET | User list (paginated) |
| /api/v1/admin/users/:userId | GET | User detail |
| /api/v1/admin/users/:userId/toggle-status | POST | Suspend/activate |
| /api/v1/admin/communities | GET | All communities |
| /api/v1/admin/payments | GET | All payments |
| /api/v1/admin/withdrawals/:id/process | POST | Process withdrawal |
| /api/v1/admin/logs | GET | Activity logs |

---

### 2.14 Search

| Route | Method | Description |
|---|---|---|
| /api/v1/search?q= | GET | Communities + courses + people |

---

## 3. Queues & Workers

| Queue | Jobs | Triggered by |
|---|---|---|
| EmailQueue | send-otp-email, send-welcome-email, send-password-reset-confirmation, send-community-invite, send-payment-receipt | Auth, community invites, payments |
| NotificationQueue | send-in-app-notification, send-push-notification, send-bulk-community-notification | Enrollment, review, comment, grading |
| WithdrawalQueue | process-withdrawal | Instructor withdrawal request |
| CertificateQueue | generate-certificate | Course completion |
| BillingQueue | process-subscriptions, expire-grace-period | Daily cron |

---

## 4. Open Questions

1. **Live class** — Google Meet integration only, or Zoom too? Auto-create meeting rooms?
2. **Drip content** — Each lesson gets `releaseAfterDays` from enrollment date?
3. **Referral codes** — Per-user, per-course, or global? Discount logic?
4. **Video hosting** — YouTube/Vimeo embeds or direct upload (Mux/Cloudflare Stream)?
5. **Push notifications** — Firebase Cloud Messaging? Device token registration endpoint needed.
6. **Admin creation** — Seed script or super-admin invite flow?
7. **Parent payment** — Parent gets own enrollment record or only child gets one?
8. **Course duplication** — Clone lesson/module/course endpoint needed?
9. **Paystack webhook** — IP whitelisting + secret hash validation?
10. **File storage** — Local disk, S3 (R2), or other? Signed URLs assumed.
