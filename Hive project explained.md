# What Is Hive?

**Hive** is an online teaching and learning platform built for the Nigerian market. It's a space where instructors build teaching communities, sell courses, and earn money — while students learn, parents monitor their children's progress, and administrators keep the ecosystem healthy.

At its core: an instructor creates a **community** (like a mini-school or academy), builds **courses** inside it, and students join those communities to learn. Everything revolves around communities — they are the container, the marketplace, and the social hub.

---

## The Four Roles

| Role | In One Sentence |
|------|-----------------|
| **Instructor** | Builds teaching communities, creates courses, earns money, withdraws to bank. |
| **Student** | Joins communities, enrolls in courses, learns, takes quizzes, submits assignments, earns certificates. |
| **Parent** | Links to a student's account, monitors their grades, progress, and activity. |
| **Super Admin** | Manages the entire platform — users, payments, content, analytics. |

---

# Shared Flows (All Roles)

These flows are identical regardless of who you are.

## 🔐 Authentication

### Email + Password Sign Up ✅
```
Visit Hive → Click "Sign Up" → Select Role (Instructor / Student / Parent)
  → Enter: First Name, Last Name, Email, Password
  → Accept Terms of Service & Privacy Policy
  → Click "Create Account"
  → Email with a 6-digit OTP is sent
  → Enter OTP on the verification screen
  → If OTP correct → Account created → Redirected to Onboarding Wizard
  → If OTP wrong → Error shown, can retry
  → If OTP expired → Click "Resend Code" (cooldown timer prevents spam)
```

### Email + Password Log In ✅
```
Visit Hive → Click "Log In" → Enter Email + Password
  → If credentials correct AND MFA disabled → Redirected to Dashboard
  → If credentials correct AND MFA enabled → Redirected to MFA screen
  → If credentials wrong → Inline error ("Invalid email or password")
  → Option: "Remember me" checkbox to extend session duration
```

### Social Sign Up (Google / Facebook / Apple) ⚠️
```
Click "Sign Up" → Click "Continue with Google/Facebook/Apple"
  → OAuth popup opens → User authorizes
  → Back on Hive: still need to select a Role (Instructor / Student / Parent)
  → Account created → Redirected to Onboarding Wizard
```

### Social Log In (Google / Facebook) ⚠️
```
Click "Log In" → Click "Continue with Google/Facebook"
  → OAuth popup opens → User authorizes
  → If account exists → Redirected to Dashboard (or MFA if enabled)
  → If no account → Prompted to sign up with that social account
```

### Forgot Password Flow ✅
```
Click "Forgot Password?" on login screen
  → Enter Email → Click "Send Reset Code"
  → OTP sent to email
  → Enter OTP on verification screen
  → If OTP correct → Set New Password (with strength indicator) + Confirm Password
  → Click "Reset Password" → Redirected to Login with success message
```

### MFA (Multi-Factor Authentication) ⚠️
```
**Enabling MFA (from Settings):**
  Settings → Security → "Enable MFA"
    → QR code displayed → Scan with authenticator app (Google Authenticator, etc.)
    → Enter 6-digit code from app to confirm setup
    → MFA is now active. Recovery codes shown once (save these!)

**Logging in with MFA enabled:**
  Enter Email + Password → MFA screen appears
    → Enter 6-digit code from authenticator app
    → If correct → Dashboard
    → If wrong → Error with remaining attempts
    → Option: "Use a recovery code instead"

**Disabling MFA (from Settings):**
  Settings → Security → "Disable MFA"
    → Enter current 6-digit code to confirm
    → MFA disabled
```

### Log Out ✅
```
Click avatar (top right) → "Log Out" → Session ended, redirected to login
  → Option: "Log Out All Devices" (invalidates all sessions everywhere)
```

---

## 👤 Profile & Account (All Roles) ✅

### View & Edit Profile ✅
```
Sidebar → Settings → Profile
  → See: Avatar, Name, Email, Phone, Bio, Role-specific fields
  → Edit any field → Click "Save Changes"
  → Upload/Change Avatar: Click avatar → Select image → Crop → Upload
```

### Change Password ✅
```
Settings → Security → Change Password
  → Enter Current Password → Enter New Password → Confirm New Password
  → Click "Update Password"
```

### Notification Preferences ✅
```
Settings → Notifications
  → Toggle per channel: Email ON/OFF, SMS ON/OFF, WhatsApp ON/OFF, Push ON/OFF
  → Save
```

### View Active Sessions ✅
```
Settings → Security → Active Sessions
  → See list: Device/Browser, IP Location, Last Active timestamp
  → "Revoke" button per session
  → "Revoke all other sessions" button
```

### Delete Account ✅
```
Settings → Danger Zone → "Delete my account"
  → Confirmation modal with warning: "This is permanent, data removed after 30 days"
  → Re-enter password to confirm
  → Account soft-deleted (recoverable for 30 days per Nigerian data protection law)
```

---

## 💬 Messaging (All Roles) ✅

### Start a New Conversation ✅
```
Sidebar → Messages → Click "New Message"
  → Search for user by name or email
  → Select user from results
  → Conversation opens → Type message → Send
```

### Continue a Conversation ✅
```
Sidebar → Messages → Conversation list on the left
  → Shows all conversations sorted by most recent, with last message preview
  → Unread conversations have a badge
  → Click any conversation → Thread opens on the right
  → Send text, images, or files
  → See read receipts on sent messages
  → See typing indicator when other person is typing
```

### Delete a Message ✅
```
In conversation → Find message → Delete (only own messages)
```

### Community Group Chat ✅
```
Inside a community → Chat tab/panel
  → All members can send text, images, files
  → System messages for join/leave events
  → Mention other members with @username
  → Scroll back through history (paginated)
```

---

## 🔔 Notifications (All Roles) ✅

### Notification Bell (Top Bar) ✅
```
Bell icon in top bar (with unread count badge)
  → Click → Dropdown shows last 10 notifications
  → Each shows: icon (type), text, timestamp, read/unread indicator
  → "Mark all as read" link at top
  → "View all" link at bottom → Navigates to full Notifications page
```

### Full Notifications Page ✅
```
Click "View all" from dropdown -> Shows a drawer from the right of the screen shows all notifications
  → Full paginated list
  → Filter by type: Enrollment, Payment, Assignment, Quiz, Message, System
  → Filter by read/unread
  → Click any notification → Navigates to relevant page (e.g. click "Assignment graded" → opens that assignment)
  → "Mark all as read" button
```

---

## 🔍 Search (All Roles) ✅

### Global Search (Top Bar) ✅
```
Type in the search bar (available on every page)
  → As-you-type dropdown with categorized results:
    - Communities (top 3 matches)
    - Courses (top 3 matches)
    - People (top 3 matches)
  → Click a result → Navigate directly
  → "See all results for '{query}'" → Full search results page
```

### Full Search Results Page ✅
```
Tabs: All | Communities | Courses | People
  → Each tab has relevant filters (Courses: difficulty, price, etc.)
  → Results in card format
  → Paginated
```

---

# Instructor — Complete Flows

The instructor is a **teacher and business owner**. They create communities, build courses, manage students, and earn money.

## 🚀 Onboarding (First Time) ✅

```
After email verification → Onboarding Wizard starts
  → Step 1: Upload profile photo (with crop/preview)
  → Step 2: Write a short bio (describes teaching background)
  → Step 3: Select specialization tags (multi-select: "Web Development", "Graphic Design", etc. + custom input)
  → Step 4: Set notification preferences (Email, SMS, WhatsApp, Push toggles)
  → Click "Get Started" → Instructor Dashboard
```

## 📊 Dashboard ✅

```
After login → Instructor Dashboard shows:
  → Revenue Summary: Total Earnings (all time), This Month, Available for Withdrawal
  → Enrollment Trend Chart: new enrollments over last 30 days (daily/weekly toggle)
  → Active Students count: students who accessed a course in last 7 days
  → Recent Activity Feed: new enrollments, assignment submissions, reviews, payments (last 10)
  → Quick Actions: "Create Community" button, "Create Course" button
```

## 🏘️ Community Management ✅

### Create a Community ✅
```
Dashboard → "Create Community" (or sidebar → My Communities → "Create Community")
  → Fill form:
    - Community Name (e.g. "Design Academy")
    - Slug (auto-generated from name, editable, URL-friendly)
    - Description (rich text)
    - Cover Image (upload with crop/preview)
    - Category selector
    - Visibility: Public / Private / Invite-Only
    - Require Approval toggle (does joining need approval?)
    - Payment settings: Is this a paid community? If yes → monthly price in Naira
  → Click "Create" → Community exists → Redirected to Community Management Dashboard
```

### Edit Community Settings ✅
```
My Communities → Click community → Settings tab
  → Edit: name, slug, description, cover image, category
  → Change visibility (public/private/invite-only)
  → Toggle require-approval
  → Toggle payment required, set monthly price
  → Advanced: sequential courses toggle, allow downloads toggle, max concurrent devices, grace period days
  → Save Changes
```

### Manage Members ✅
```
My Communities → Click community → Members tab
  → See all members: avatar, name, email, role (owner/admin/member), status, joined date
  → Search and filter members
  → Per-member actions:
    - Change role: promote to Admin, demote to Member or Guest
    - Block / Unblock
    - Remove from community
  → Pending Members section (if approval required):
    - "Approve" or "Reject" per applicant
  → Invite Page:
    - Enter email(s) to send invites
    - Generate shareable invite link (copy to clipboard)
    - See sent invites with status: pending / accepted / expired
```

### View Community Analytics ✅
```
My Communities → Click community → Analytics tab
  → Member growth chart (over time)
  → Active members (last 7 days / 30 days)
  → Course enrollment breakdown (which courses are most popular)
  → Revenue summary (if paid community): earnings breakdown
```

### Archive a Community ✅
```
My Communities → Click community → Settings → Danger Zone → "Archive Community"
  → Confirmation prompt
  → Community archived (no longer visible to non-members, existing members can't join; existing students keep access)
```

## 📚 Course Building

### Create a Course ✅
```
My Communities → Click community → Courses tab → "Create Course" (or Dashboard → "Create Course" → Select community)
  → Course Metadata Form:
    - Title
    - Description (rich text editor)
    - Cover image (upload with crop/preview)
    - Category dropdown
    - Difficulty selector: Beginner / Intermediate / Advanced
    - Pricing Section:
      - "This course is free" toggle — if toggled off:
        - One-time price in Naira (e.g. ₦5,000)
        - OR Monthly subscription price (e.g. ₦2,000/month)
        - OR both
    - Settings:
      - Sequential access toggle ("Students must complete lessons in order")
      - Drip content toggle ("Release lessons on a schedule")
      - Allow comments toggle
      - Allow downloads toggle
    - Certificate Section:
      - "Offer certificate" toggle — if on:
        - Minimum completion % (e.g. 80%)
        - Minimum quiz score % (e.g. 70%)
        - Minimum live attendance % (e.g. 60%)
  → "Save Draft" → Course created as Draft (not visible to students)
  → OR "Publish" → Confirmation: "This will make the course visible to community members" → Published
```

### Edit Course Metadata ✅
```
My Communities → Click community → Course list → Click course → Settings tab
  → Edit any field from the creation form
  → "Save Draft" or "Publish"
```

### Build Course Structure (Modules & Lessons) ✅
```
My Communities → Click community → Course list → Click course → Curriculum tab
```

### Add Modules ✅
```
Curriculum tab → "Add Module"
  → Enter: Title, Description (optional)
  → Module created at bottom of list
  → Drag-and-drop to reorder modules
  → Inline edit title/description
  → Delete module (with confirmation)
```

### Add Lessons to a Module ✅
```
Click module to expand → "Add Lesson"
  → Select lesson type: Video | PDF | Live Class | Quiz | Assignment
  → Lesson created inside module
  → Drag-and-drop to reorder lessons (within and across modules)
  → Toggle "Free Preview" per lesson (visible to non-enrolled users)
```

### Lesson Editor — Video ✅
```
Click a Video lesson → Edit
  → Title, Description
  → Upload video (drag-and-drop or browse)
  → Upload progress bar → Processing status ("Transcoding…")
  → Resolutions generated: 360p ✓, 720p ✓, 1080p ✓, Audio Only ✓
  → Video preview player (once processed)
  → "Free Preview" toggle
  → Add attachments (supplementary PDFs, slides, etc.)
  → Save / Publish
```

### Lesson Editor — PDF ✅
```
Click a PDF lesson → Edit
  → Title, Description
  → Upload PDF (drag-and-drop or browse)
  → PDF preview (embedded viewer or thumbnail)
  → "Free Preview" toggle
  → Add attachments
  → Save / Publish
```

### Lesson Editor — Live Class ✅
```
Click a Live Class lesson → Edit
  → Title, Description
  → Date and time picker (with timezone display)
  → Duration (minutes)
  → Platform: Google Meet / Zoom / External link
  → Meeting link (auto-generated or manual)
  → "Free Preview" toggle
  → Save / Publish

After the class time passes → Return to lesson:
  → Upload recording
  → View attendance summary (number of attendees, average duration)
```

### Quiz Builder ✅
```
Add lesson → Select "Quiz" → Quiz Builder opens
  → Quiz Settings:
    - Title, Pass Score (%), Time Limit (minutes, optional)
    - Attempts Allowed (e.g. 2), Randomize Question Order toggle
    - Show Answers After Submission toggle
  → Add Questions:
    - "Add Question" → Select type: Multiple Choice / True-False / Fill in the Blank
    - Question text, Points per question
    - Multiple Choice: Add option rows, mark correct answer(s)
    - True-False: Select which is correct
    - Fill in Blank: Enter correct answer
    - Explanation (shown after submission if "show answers" is on)
  → Drag-and-drop reorder questions
  → Delete questions
  → Save Quiz
```

### Assignment Builder ✅
```
Add lesson → Select "Assignment" → Assignment Builder opens
  → Title, Instructions (rich text), Due Date (optional)
  → Maximum Score
  → Submission Type: File upload / Text / Both
  → If file upload: allowed file types (PDF, DOCX, images, etc.), max file size
  → Rubric (optional)
  → Save / Publish
```

### Grade Assignment Submissions ✅
```
My Courses → Click course → Assignments tab → Click assignment → Submissions
  → List of submissions: Student name, Submitted date, Status (pending/submitted/graded/returned), Score
  → Filter by status
  → Click submission to open detail:
    - Student info
    - Submitted text (rendered)
    - Submitted files (viewable/downloadable)
    - Score input (out of max)
    - Feedback text area
    - "Grade & Return" button
    - "Return for Revision" button (no score, returns with feedback)
  → Bulk action: Export submissions as ZIP
```

### Publish a Draft Course
```
Course in Draft status → Click "Publish"
  → Confirmation modal
  → Course is now visible to community members and searchable
```

### Archive a Course
```
Course Settings → "Archive Course"
  → Confirmation
  → Course hidden. Existing students keep access. No new enrollments.
```

## 👥 Community Feed (Social) ✅

### Create a Post ✅
```
Inside a community → Feed tab → "Create Post"
  → Text area (expandable)
  → Attach: images, files, links
  → "Post" → Appears in feed
```

### Manage Posts ✅
```
Feed → Own post → More menu (⋮)
  → Edit post
  → Delete post
  → Pin to top (owner/admin only — stays at top with "Pinned" indicator)
```

### Interact with Posts ✅
```
Feed → Any post
  → Like (toggle on/off, shows count)
  → Comment (opens comment thread, reply to others)
  → Post Announcements have distinct highlighted styling
```

## 💰 Earnings & Withdrawals

### View Earnings
```
Sidebar → Earnings
  → Balance Overview (stat cards):
    - Total Earnings (all time)
    - Available Balance (ready to withdraw)
    - Pending Balance (7-day waiting period)
    - Withdrawn Balance (lifetime total)
  → Note: 10% platform fee is deducted from every payment.
    Student pays ₦10,000 → Instructor gets ₦9,000
```

### Earnings History
```
Earnings page → History tab
  → Table: Date, Student Name, Course/Community, Gross Amount, Platform Fee, Net Amount, Status
  → Filter by date range and course
  → Sortable columns
```

### Analytics Dashboard
```
Earnings page → Analytics tab
  → Select period: 7 days / 30 days / 90 days / 1 year
  → Revenue trend chart
  → Per-course analytics: earnings, enrollments, completion rate
```

### Verify Bank Account
```
Earnings page → Withdraw → "Verify Bank Account"
  → Select Bank → Enter Account Number
  → System verifies account name with Paystack/Flutterwave
  → Account name auto-populates if verified
```

### Request Withdrawal
```
Earnings page → "Request Withdrawal"
  → Modal/form:
    - Amount to withdraw (must be ≤ Available Balance, in Naira)
    - "Withdraw all" shortcut
    - Bank Name, Account Number, Account Name
  → Submit → Withdrawal request created
  → Status: Pending → Processing (admin reviews) → Completed (money sent) / Failed
```

### Withdrawal History
```
Earnings page → Withdrawals tab
  → Table: Date, Amount, Fee, Net Amount, Status (Pending/Processing/Completed/Failed), Reference
  → Filter by status
```

## 🎓 Live Class (Hosting)

### Before Class ✅
```
Creator dashboard → Live lesson → Join as host
  → Meeting opens in Google Meet / Zoom / external link
```

### After Class
```
Lesson page → Upload recording (if recorded)
  → Recording becomes available to students
  → View attendance: who attended, how long, attendance %
```

---

# Student — Complete Flows

The student is a **learner**. They discover, enroll, learn, take assessments, and earn certificates.

## 🚀 Onboarding (First Time) ✅

```
After email verification → Onboarding Wizard starts
  → Step 1: Upload profile photo (optional, skippable)
  → Step 2: Select interests/categories (helps with course discovery)
  → Step 3: Set notification preferences (Email, SMS, WhatsApp, Push toggles)
  → Click "Get Started" → Student Dashboard
```

## 📊 Dashboard ✅

```
After login → Student Dashboard shows:
  → Welcome Banner: "Good morning, {firstName}" + learning streak ("5-day streak 🔥")
  → Continue Learning: Horizontal scroll of started-but-incomplete courses
      Each card: course title, instructor name, progress bar + %, "Resume" button
      Sorted by last accessed (most recent first)
  → Upcoming Live Classes: Next 3 scheduled live lessons
      Each: title, course name, date/time, "Join" button (active 15 min before start)
  → Recent Activity: Last 5 notifications (compact feed)
```

## 🔍 Discover & Explore ✅

### Browse Communities and Courses ✅
```
Sidebar → Explore / Discover
  → Toggle: Communities tab | Courses tab
  → Search bar (scoped to communities and courses)
  → Filters: Category, Difficulty (Beginner/Intermediate/Advanced), Price (Free/Paid), Rating
  → Community cards: cover image, name, category, member count, course count, visibility badge, "Join" button
  → Course cards: cover image, title, difficulty badge, rating (stars + count), price, instructor, enrollment count
  → Pagination or infinite scroll
```

### View Community Landing Page ✅
```
Click a community card →
  → Cover image banner
  → Community name, category tag
  → Instructor profile card: avatar, name, bio, specializations
  → Full description (rich text)
  → Stats: member count, course count, rating
  → Visibility badge
  → Course Preview List: titles, difficulty, free/paid indicator, lock icon on paid
  → Join CTA (varies by settings):
    - Public + free → "Join Now" (instant membership)
    - Public + paid → "Join for ₦X/month" (triggers payment flow)
    - Requires approval → "Request to Join" (pending approval)
    - Invite-only → "This community is invite-only" (no join button)
```

### View Course Landing (Sales) Page ✅
```
Click a course card →
  → Cover image
  → Title, subtitle/description, difficulty badge
  → Instructor card: avatar, name, rank badge, bio
  → Stats: enrollment count, average rating (stars), number of reviews
  → Curriculum Outline (expandable accordion):
    - Modules listed with their lessons as sub-items
    - Each lesson: title, type icon (video/PDF/live/quiz/assignment), duration, "Free Preview" badge if applicable
    - Lock icon if not enrolled (but titles and structure are always visible)
  → Reviews Section: top 3-5 reviews with "See all reviews" link
  → Certificate Badge (if offered): "Certificate included" + requirements summary
  → Enrollment CTA:
    - Free course → "Enroll for Free"
    - One-time payment → "Enroll for ₦X"
    - Subscription → "₦X/month"
    - Already enrolled → "Continue Learning"
    - Already completed → "Review Course" / "View Certificate"
```

## 💳 Payments & Enrollment

### Enroll in a Free Course
```
Course landing page → Click "Enroll for Free"
  → Instant enrollment → Redirected to learning view or "Start Learning"
```

### Enroll in a Paid Course or Join a Paid Community
```
Course/Community landing page → Click "Enroll for ₦X" / "Join for ₦X/month"
  → Checkout page:
    - Order summary: item name, type (one-time / subscription), price
    - Referral code input (optional) → "Apply" to get discount
    - Total amount
    - Payment gateway (Paystack/Flutterwave/Stripe)
  → Click "Pay Now"
    → Payment gateway popup opens (Paystack/Flutterwave hosted UI)
    → Enter card/bank details on gateway's secure page
    - Success → Redirected to Payment Success page
      → "You're enrolled!" / "Welcome to {community}!" message
      → Order details summary
      → "Start Learning" / "Go to Community" button
    - Failure → Error message with "Try Again" button
    - Cancel → Returned to checkout page
  → IMPORTANT: Only the payment gateway's confirmation (webhook) actually grants access.
    Frontend redirect alone does NOT create enrollment — this prevents fraud.
```

### View Payment History
```
Sidebar → Payments (or Settings → Payment History)
  → Table: Date, Description (course/community name), Amount, Status, Payment Method, Receipt link
  → Filter by date range, status
  → Sortable columns
```

### Manage Subscriptions
```
Sidebar → Payments → Subscriptions tab
  → List of active subscriptions: item name, billing amount, cycle (monthly/annual), next billing date, status
  → "Cancel" button → Confirmation: "Your access will continue until {next billing date}"
  → Grace period warning banner (if payment failed): "Your payment failed. Update within X days to keep access."
  → Expired/cancelled subscriptions section (collapsed by default)
```

## 📖 My Courses ✅

### View All Enrolled Courses ✅
```
Sidebar → My Courses
  → View toggle: Grid (cards) vs. List (compact rows)
  → Filter tabs: All | In Progress | Completed | Expired
  → Sort: Last Accessed, Title A-Z, Progress
  → Each course card: cover image, title, instructor, community, progress bar, last accessed date
  → "Resume" button → Jumps to last accessed lesson
  → Empty state: "Explore courses" CTA
```

## 🎯 Learning View (Taking a Course) ✅

### Enter the Learning View ✅
```
My Courses → Click course → Learning View opens
  → Layout:
    - Sidebar (collapsible): Curriculum tree — modules expandable, lessons listed
      - Current lesson highlighted
      - Completed lessons: checkmark ✓
      - Locked lessons: lock icon 🔒 (if sequential access)
      - Progress bar at top of sidebar
    - Main content area: Lesson content rendered here
    - Minimal top bar: Course title, progress %, back button, sidebar toggle
  → "Zen/Focus mode" possible: hide sidebar entirely, just content + next/prev buttons
```

### Video Lesson ✅
```
Learning View → Video lesson selected →
  → Video player (large, dominant):
    - Quality selector: 360p, 720p, 1080p, Audio Only (data saver)
    - Play/pause, seek bar, volume, fullscreen, playback speed
    - Progress auto-saved every 10-15 seconds
    - On return → resumes from last position
    - At 90%+ watched → auto-marks as complete, progress updated
  → Below player: lesson title, description, attachments (downloadable if allowed)
  → "Mark as Complete" button (manual — also auto at 90%)
  → Previous / Next lesson navigation buttons (show lesson title + type icon preview)
```

### PDF Lesson ✅
```
Learning View → PDF lesson selected →
  → Embedded PDF viewer (scroll or page-by-page)
  → Download button (if allowed by course settings)
  → Lesson title, description
  → "Mark as Complete" button
  → Previous / Next navigation
```

### Live Class Lesson ✅
```
**Before class:**
  → Countdown timer to start time
  → Lesson title, description, scheduled time
  → "Add to Calendar" button
  → "Join" button disabled until 15 minutes before start → then activates

**During class:**
  → Click "Join" → Meeting link opens (Google Meet/Zoom/external) in new tab or embedded
  → Attendance auto-tracked: join time recorded

**After class:**
  → Recording player (if instructor uploaded recording)
  → Attendance status: "You attended for X minutes"
  → "Mark as Complete" button
```

### Lesson Navigation (Next/Previous) ✅
```
Bottom of every lesson view →
  → "Previous Lesson" button (if not first lesson)
  → "Next Lesson" button — shows preview (title + type icon)
  → If next is locked (sequential access): lock icon + "Complete this lesson to unlock"
  → After last lesson of course → "Course Complete!" celebration
    → Options: View Certificate (if eligible), Leave a Review, Back to Course
```

## 📝 Assessments ✅

### Take a Quiz ✅
```
Learning View → Quiz lesson → Click "Start Quiz"
  → Quiz info bar: Title, time remaining (if timed), question count, total points
  → Question card: number, text, answer input
    - Multiple Choice: radio buttons
    - True/False: toggle
    - Fill in Blank: text input
  → Navigation: Previous / Next buttons, or question number strip for jumping
  → Question status: answered (filled dot), unanswered (empty dot), flagged (marked dot)
  → "Flag for review" per question
  → "Submit Quiz" → Confirmation modal: "Are you sure? You have X unanswered questions."
  → Timer behavior:
    - Countdown visible
    - Warning at 5 min and 1 min remaining
    - Auto-submit when timer expires

**Results (after submission):**
  → Score: earned points / total points, percentage
  → Pass/Fail indicator
  → If "show answers" enabled: full breakdown per question
    - Correct answer, your answer, correct/incorrect, explanation
  → If "show answers" disabled: only score shown, no breakdown
  → "Retry" button (if attempts remain)
  → "Back to Lesson" button
```

### Submit an Assignment ✅
```
Learning View → Assignment lesson →
  → Assignment title, instructions (rich text), due date (urgency indicator if close), max score
  → Submission area:
    - Text editor (if text submissions allowed)
    - File upload zone (drag-and-drop, shows file name + size + remove button)
    - Enforces allowed types and max size with clear errors
  → "Submit" → Confirmation modal → Submitted
  → After submission: status display (pending → graded)
    → See submitted files/text preview
    → See grade and feedback once instructor grades it
    → See "Returned for Revision" status if instructor sends back
```

### View Quiz/Assignment Attempts
```
Quiz/Assignment page → View all attempts
  → List: Date, Score, Status, Duration
  → Click attempt → View detailed results
```

## 💬 Community Interaction (As Member) ✅

### Community Feed ✅
```
Inside a joined community → Feed tab
  → Scroll through posts (reverse chronological)
  → Pinned posts stick to top
  → Announcements have distinct styling
  → "Create Post" button at top → Text + attachments → Post
```

### Interact ✅
```
Feed → Like a post (toggle, shows count)
  → Comment on a post (threaded, reply to others)
  → Edit/Delete own posts
```

## ⭐ Reviews ✅

### Leave a Course Review ✅
```
Course landing page (enrolled students who haven't reviewed yet) →
  → Star rating input (1-5, tappable)
  → Title (optional)
  → Comment text area
  → "Submit Review"
  → After submit: review appears in list, form replaced with "Edit" / "Delete" options
```

### View Course Reviews ✅
```
Course landing page → Reviews section →
  → Average rating (large number + stars + count)
  → Rating breakdown bar chart (5 stars: X%, 4 stars: X%, etc.)
  → Sort by: Most Recent, Highest Rated, Lowest Rated, Most Helpful
  → Review cards: avatar + name, stars, title, comment, date, "Helpful" button + count
  → Instructor replies (indented, with instructor badge)
  → "Flag" button (report inappropriate)
  → Pagination or "Load more"
```

### Mark Review as Helpful ✅
```
Reviews section → Click "Helpful" button on any review → Toggle on/off, count updates
```

## 🏆 Certificates ✅

### Claim Certificate
```
Course completion screen (when requirements met) →
  → "Claim Your Certificate" CTA appears
  → Certificate preview rendered:
    - Student name, Course name, Completion date, Instructor name, Certificate number
  → "Download PDF" button
  → "Share" button (generates public verification link)
```

### View All Certificates ✅
```
Sidebar → Certificates
  → Grid of certificate cards: course name, completion date, thumbnail preview
  → Actions per certificate: "View" and "Download"
  → Empty state: "Complete a course to earn your first certificate"
```

### Verify Certificate (Public) ✅
```
Anyone visits: hive.edu/verify/{verificationCode} (no login needed)
  → Certificate holder name, Course name, Instructor/Community, Completion date, Certificate number
  → "Verified ✓" badge
  → If invalid code → "Certificate not found"
```

## 👨‍👩‍👧 Parent-Student Linking

### Approve or Reject a Parent Link Request
```
Notification: "{Parent Name} wants to link to your account"
  → Click notification → See request details (parent name, relationship type)
  → "Approve" → Parent can now see your progress, grades, and activity
  → "Reject" → Parent cannot see anything
```

### View Linked Parents
```
Settings → Linked Accounts → Linked Parents tab
  → See all parents linked to your account
  → Per parent: name, relationship, link date
  → "Revoke Link" per parent → Parent loses access immediately
```

### Revoke a Parent Link
```
Settings → Linked Accounts → Find parent → "Revoke Link"
  → Confirmation → Link severed → Parent can no longer see your data
```

## 🔗 Referrals

### Share Referral Link
```
Sidebar → Referrals (or Settings → Referrals)
  → Unique referral code displayed with "Copy" button
  → Shareable link with "Copy" button
  → Share buttons: WhatsApp, Twitter/X, Email, generic
  → Rewards explanation: "You earn X% off when your referral enrolls"
  → Referral Stats: invites sent, signups, enrollments, total rewards earned
```

---

# Parent — Complete Flows

The parent is an **overseer**. They monitor a child's education without interfering in the learning experience.

## 🚀 Onboarding (First Time)

```
After email verification → Onboarding Wizard starts
  → Step 1: Upload profile photo (optional)
  → Step 2: Link student accounts (search by email or share invite link)
  → Step 3: Set notification preferences (Email, SMS, WhatsApp, Push toggles)
  → Click "Get Started" → Parent Dashboard
```

## 📊 Dashboard

```
After login → Parent Dashboard shows:
  → Linked Students Overview: Cards per linked student
    - Avatar, name, active courses count, current streak, last active timestamp
  → Quick Stats: Total courses across all children, completed, in progress
  → Pending Link Requests section (requests awaiting student approval)
  → Empty state (if no linked students): "Link your first student to start monitoring their progress"
```

## 👨‍👩‍👧 Student Linking

### Link to a Student
```
Dashboard → "Link a Student" (or sidebar → My Children → "Link Student")
  → Enter student's email address
  → Select relationship: Parent / Guardian / Sponsor / Other
  → "Send Request" → Student receives notification
  → Status: Pending (awaiting student approval)
  → Once student approves → Student appears on dashboard with full visibility
  → If student rejects → Request shows as rejected
```

### View Link Status
```
My Children page →
  → Active links: student name, relationship, courses, last active
  → Pending links: awaiting student approval
  → Rejected/expired links
```

### Revoke a Link
```
My Children → Find student → "Revoke Link"
  → Confirmation → Link severed → Can no longer see that student's data
```

## 📖 Monitoring a Student

### Student Detail View
```
Dashboard → Click a student card → Student Detail View
  → Student profile header: avatar, name, link status
  → Enrolled Courses list: per-course progress bars, course name, instructor
  → Recent Activity Timeline (chronological):
    - Lessons completed
    - Quizzes taken (with scores)
    - Assignments submitted (with grades)
    - Live classes attended
  → Scores Overview: average quiz scores, assignment grades per course
  → Learning Streak: current streak, longest streak, active days count
```

### View Student's Course Progress
```
Student Detail → Click a course →
  → Detailed progress: modules completed / total, lessons completed / total
  → Quiz scores per quiz
  → Assignment grades per assignment
  → Attendance records for live classes
```

**Important:** Parents can ONLY see data for students who have approved the link. If pending, show "Waiting for student approval."

## 💳 Payments (As Parent)

### Pay for a Student's Course
```
Same flow as Student "Enroll in a Paid Course" — but parent pays on behalf of linked student
  → At checkout: may specify which linked student the enrollment is for
```

### View Payment History
```
Sidebar → Payments
  → Table: date, description, student name (if for child), amount, status, receipt
```

---

# Super Admin — Complete Flows

The super admin is the **platform operator** with full control and visibility.

## 📊 Admin Dashboard

```
Login as admin → Admin Dashboard
  → Stat cards: Total Users, Total Communities, Total Courses, Total Revenue (all time), Revenue This Month, Active Users (7 days)
  → User growth chart (30/90 day toggle)
  → Revenue trend chart
  → Recent signups list (last 10)
  → Recent payments list (last 10)
  → Quick links to common admin tasks
```

## 👥 User Management

```
Sidebar → Users
  → Search: name, email
  → Filter: role (Instructor/Student/Parent/Admin), status (Active/Suspended/Deleted), date range
  → Table: Avatar, Name, Email, Role, Status, Joined date, Last active
  → Row actions per user:
    - View Profile: full detail, enrollments, payments, communities
    - Suspend: user cannot log in
    - Unsuspend: restore access
    - Delete: soft-delete (recoverable 30 days)
  → Click user → Full detail:
    - All enrollments
    - All payments
    - All communities (if instructor)
    - Activity log for this user
```

## 🏘️ Community Management (Admin)

```
Sidebar → Communities
  → Search and filter: name, status, visibility
  → Table: Name, Owner, Status, Member count, Course count, Revenue, Created date
  → Row actions:
    - View: full detail
    - Force-archive: take down a violating community
    - Contact owner: message the instructor
```

## 💰 Payment Management (Admin)

```
Sidebar → Payments
  → Table: Date, User, Amount, Status, Gateway, Reference, Course/Community
  → Filters: date range, status, gateway
  → Row actions:
    - View detail: full gateway response
    - Process refund
```

## 🏦 Withdrawal Queue (Admin)

```
Sidebar → Withdrawals
  → Table: Instructor name, Amount, Bank details, Status, Requested date
  → Filters: status (Pending/Processing/Completed/Failed)
  → Per withdrawal:
    - Approve → Status: Processing
    - Reject → Must enter reason → Instructor notified with reason
    - Mark as Processed → Status: Completed, money sent
```

## 📋 Activity Log Viewer (Admin)

```
Sidebar → Activity Logs
  → Searchable, filterable log of all significant platform actions
  → Each entry: Timestamp, User, Action description, Resource type, Resource link, IP address
  → Filter by: action type, user, date range
  → Used for: investigating issues, auditing behavior, resolving disputes
```

---

# Quick Reference: Every Action Per Role

## Instructor — Complete Action List

| # | Action |
|---|--------|
| 1 | Sign up with email + password |
| 2 | Sign up with Google / Facebook / Apple |
| 3 | Log in with email + password |
| 4 | Log in with Google / Facebook |
| 5 | Verify email with 6-digit OTP |
| 6 | Resend OTP |
| 7 | Forgot password → Request reset → Enter OTP → Set new password |
| 8 | Enable / Disable MFA |
| 9 | Complete onboarding wizard (photo, bio, specializations, notifications) |
| 10 | View instructor dashboard (revenue, trends, activity) |
| 11 | Create a community (name, slug, description, cover, category, visibility, payment settings) |
| 12 | Edit community settings (all fields, advanced toggles) |
| 13 | Upload community cover image |
| 14 | Archive a community |
| 15 | View community analytics (growth, engagement, revenue) |
| 16 | List own communities |
| 17 | View community members |
| 18 | Change member roles (promote to admin, demote) |
| 19 | Block / Unblock members |
| 20 | Remove members |
| 21 | Approve / Reject pending members |
| 22 | Invite people via email |
| 23 | Generate and share invite link |
| 24 | Create a course (metadata, pricing, settings, certificate rules) |
| 25 | Edit course metadata |
| 26 | Upload course cover image |
| 27 | Publish a draft course |
| 28 | Archive a course |
| 29 | Add / Edit / Delete / Reorder modules |
| 30 | Add / Edit / Delete / Reorder lessons |
| 31 | Create a Video lesson (upload, process, attachments) |
| 32 | Create a PDF lesson (upload, preview, attachments) |
| 33 | Create a Live Class lesson (schedule, platform, link) |
| 34 | Upload live class recording |
| 35 | View live class attendance |
| 36 | Build a Quiz (settings, questions, options, explanations) |
| 37 | Edit / Delete quiz |
| 38 | Build an Assignment (instructions, due date, rubric, submission type) |
| 39 | View assignment submissions |
| 40 | Grade a submission (score + feedback) |
| 41 | Return a submission for revision |
| 42 | Bulk export submissions as ZIP |
| 43 | Create community posts (text + attachments) |
| 44 | Edit / Delete own posts |
| 45 | Pin / Unpin posts |
| 46 | Like posts |
| 47 | Comment on posts |
| 48 | View earnings balance (total, available, pending, withdrawn) |
| 49 | View earnings history (filter, sort) |
| 50 | View revenue analytics (per period, per course) |
| 51 | Verify bank account |
| 52 | Request withdrawal |
| 53 | View withdrawal history |
| 54 | Join live class as host |
| 55 | Send direct messages to any user |
| 56 | Participate in community group chat |
| 57 | View notifications |
| 58 | Mark notifications read |
| 59 | Global search |
| 60 | View & edit profile |
| 61 | Change password |
| 62 | Manage notification preferences |
| 63 | View active sessions, revoke sessions |
| 64 | Refresh auth token |
| 65 | Log out / Log out all devices |
| 66 | Delete account |

## Student — Complete Action List

| # | Action |
|---|--------|
| 1 | Sign up with email + password |
| 2 | Sign up with Google / Facebook / Apple |
| 3 | Log in with email + password |
| 4 | Log in with Google / Facebook |
| 5 | Verify email with 6-digit OTP |
| 6 | Resend OTP |
| 7 | Forgot password → Request reset → Enter OTP → Set new password |
| 8 | Enable / Disable MFA |
| 9 | Complete onboarding wizard (photo, interests, notifications) |
| 10 | View student dashboard (streak, continue learning, upcoming live, activity) |
| 11 | Explore / Discover communities and courses (browse, search, filter) |
| 12 | View community landing page |
| 13 | View course landing page (curriculum preview) |
| 14 | Join a free community (instant) |
| 15 | Request to join a community (pending approval) |
| 16 | Join a paid community (checkout → payment) |
| 17 | Enroll in a free course (instant) |
| 18 | Enroll in a paid course (checkout → payment) |
| 19 | Apply referral code at checkout |
| 20 | Complete payment via Paystack/Flutterwave/Stripe |
| 21 | Leave a community |
| 22 | View all enrolled courses (grid/list, filter, sort) |
| 23 | Resume a course (jumps to last accessed lesson) |
| 24 | Enter learning view (curriculum sidebar + content) |
| 25 | Watch video lesson (play, pause, seek, quality change, speed control) |
| 26 | View PDF lesson |
| 27 | Join a live class (before/during/after) |
| 28 | Add live class to calendar |
| 29 | View live class recording |
| 30 | Mark lesson as complete (manual or auto at 90% video) |
| 31 | Navigate lessons (previous/next) |
| 32 | Take a quiz (start, answer, flag, submit) |
| 33 | View quiz results (score, breakdown if enabled) |
| 34 | Retry a quiz |
| 35 | Submit an assignment (text + files) |
| 36 | View assignment grade and feedback |
| 37 | Create community posts (text + attachments) |
| 38 | Edit / Delete own posts |
| 39 | Like posts in community feed |
| 40 | Comment on posts |
| 41 | Leave a course review (stars, title, comment) |
| 42 | Edit / Delete own review |
| 43 | Mark reviews as helpful |
| 44 | Claim certificate on course completion |
| 45 | Download certificate as PDF |
| 46 | Share certificate (public verification link) |
| 47 | View all certificates |
| 48 | Approve / Reject parent link request |
| 49 | View linked parents |
| 50 | Revoke a parent link |
| 51 | View and share referral link/code |
| 52 | View referral stats |
| 53 | View payment history |
| 54 | Manage subscriptions (view, cancel) |
| 55 | Send direct messages to any user |
| 56 | Participate in community group chat |
| 57 | View notifications |
| 58 | Mark notifications read / Mark all read |
| 59 | Global search |
| 60 | View & edit profile |
| 61 | Change password |
| 62 | Manage notification preferences |
| 63 | View active sessions, revoke sessions |
| 64 | Refresh auth token |
| 65 | Log out / Log out all devices |
| 66 | Delete account |

## Parent — Complete Action List

| # | Action |
|---|--------|
| 1 | Sign up with email + password |
| 2 | Sign up with Google / Facebook / Apple |
| 3 | Log in with email + password |
| 4 | Log in with Google / Facebook |
| 5 | Verify email with 6-digit OTP |
| 6 | Resend OTP |
| 7 | Forgot password → Request reset → Enter OTP → Set new password |
| 8 | Enable / Disable MFA |
| 9 | Complete onboarding wizard (photo, link students, notifications) |
| 10 | View parent dashboard (linked students overview, stats, pending requests) |
| 11 | Link to a student (enter email, select relationship) |
| 12 | View pending / active / rejected link requests |
| 13 | Revoke a student link |
| 14 | View student detail (courses, progress, activity timeline) |
| 15 | View student's course progress in detail |
| 16 | View student's quiz scores |
| 17 | View student's assignment grades |
| 18 | View student's learning streak |
| 19 | Pay for a student's course/community enrollment |
| 20 | Send direct messages |
| 21 | View notifications |
| 22 | Mark notifications read / Mark all read |
| 23 | Global search |
| 24 | View & edit profile |
| 25 | Change password |
| 26 | Manage notification preferences |
| 27 | View active sessions, revoke sessions |
| 28 | Refresh auth token |
| 29 | Log out / Log out all devices |
| 30 | Delete account |

## Super Admin — Complete Action List

| # | Action |
|---|--------|
| 1 | View admin dashboard (platform stats, charts, recent activity) |
| 2 | Search and filter all users |
| 3 | View any user's full profile, enrollments, payments, communities |
| 4 | Suspend / Unsuspend any user |
| 5 | Delete any user (soft-delete) |
| 6 | Search and filter all communities |
| 7 | View any community's full details |
| 8 | Force-archive any community |
| 9 | Contact any community owner |
| 10 | View all payments (search, filter by status/date/gateway) |
| 11 | View payment detail (full gateway response) |
| 12 | Process refunds |
| 13 | View withdrawal queue (filter by status) |
| 14 | Approve a withdrawal |
| 15 | Reject a withdrawal (with reason) |
| 16 | Mark withdrawal as processed |
| 17 | View activity logs (all platform actions, searchable, filterable) |
| 18 | View & edit own profile |
| 19 | Change password |
| 20 | Log out |
