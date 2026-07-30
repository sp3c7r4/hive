"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Settings01Icon,
  BookOpen01Icon,
  UserGroupIcon,
  Add01Icon,
  Image01Icon,
  Cancel01Icon,
  Delete01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  Attachment01Icon,
  PlayIcon,
  Upload01Icon,
  CheckmarkCircle02Icon,
  Calendar03Icon,
  Clock01Icon,
  File01Icon,
  LiveStreaming01Icon,
  CircleQuestionMarkIcon,
  AssignmentsIcon,
  Copy01Icon,
  Alert01Icon,
  Globe02Icon,
  LockIcon,
} from "@hugeicons/core-free-icons";

/* ---------------------------------------------------------------- */
/*  Types & data                                                    */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";
type Tab = "curriculum" | "grading" | "settings";
type Difficulty = "beginner" | "intermediate" | "advanced";
type LessonType = "video" | "pdf" | "live" | "quiz" | "assignment";

type Lesson = {
  id: string;
  title: string;
  description?: string;
  duration: string;
  type: LessonType;
  status: "published" | "draft";
  freePreview: boolean;
  hasAttachment?: boolean;
};

type Module = { id: string; title: string; description?: string; expanded: boolean; lessons: Lesson[] };

const COURSE = {
  title: "React for Designers",
  description: "Learn React fundamentals through hands-on projects.",
  category: "Development",
  difficulty: "beginner" as Difficulty,
  isFree: true, oneTimePrice: "", monthlyPrice: "",
  sequentialAccess: true, dripContent: false, allowComments: true, allowDownloads: true,
  offerCertificate: true, minCompletion: "80", minQuizScore: "70", minAttendance: "60",
  status: "published", enrollmentCount: 342,
};

const INITIAL_MODULES: Module[] = [
  { id: "mod1", title: "Getting Started", expanded: true, lessons: [
    { id: "l1", title: "Welcome & Course Overview", description: "Introduction to what you'll learn and how to succeed.", duration: "4:32", type: "video", status: "published", freePreview: true },
    { id: "l2", title: "Setting Up Your Environment", description: "Install Node.js, VS Code, and create your first project.", duration: "8:15", type: "video", status: "published", freePreview: false },
    { id: "l3", title: "How the Web Works", description: "A quick primer on HTTP, browsers, and the DOM.", duration: "12:00", type: "pdf", status: "published", freePreview: false, hasAttachment: true },
  ]},
  { id: "mod2", title: "React Fundamentals", expanded: true, lessons: [
    { id: "l4", title: "Components & Props", description: "Build your first React component and pass data through props.", duration: "15:20", type: "video", status: "published", freePreview: false },
    { id: "l5", title: "State & Events", description: "Manage component state and handle user interactions.", duration: "18:45", type: "video", status: "published", freePreview: false },
    { id: "l6", title: "React Fundamentals Quiz", description: "Test your knowledge of components, state, and props.", duration: "10 questions", type: "quiz", status: "draft", freePreview: false },
    { id: "l7", title: "Live Code Review", description: "Join a live session to review your code with the instructor.", duration: "60 min", type: "live", status: "published", freePreview: false },
  ]},
];

const LESSON_TYPE_OPTS: { value: LessonType; label: string; icon: typeof PlayIcon }[] = [
  { value: "video", label: "Video", icon: PlayIcon },
  { value: "pdf", label: "PDF", icon: File01Icon },
  { value: "live", label: "Live Class", icon: LiveStreaming01Icon },
  { value: "quiz", label: "Quiz", icon: CircleQuestionMarkIcon },
  { value: "assignment", label: "Assignment", icon: AssignmentsIcon },
];

const LESSON_TYPE_COLORS: Record<LessonType, string> = {
  video: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pdf: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  live: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  quiz: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  assignment: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

const CATEGORIES = ["Design", "Development", "Data Science", "Business", "Marketing", "Product", "Writing", "Photography", "Music", "Other"];
const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }];

function fmtPrice(v: string) { return v.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

const COMMUNITY_MEMBERS_FOR_INVITE = [
  { id:"cm1", name:"Kelechi Okonkwo", initials:"KO", email:"kelechi@hive.ng" },
  { id:"cm2", name:"Amara Obi", initials:"AO", email:"amara@hive.ng" },
  { id:"cm3", name:"Tunde Balogun", initials:"TB", email:"tunde@hive.ng" },
  { id:"cm4", name:"Ifeanyi Eze", initials:"IE", email:"ifeanyi@hive.ng" },
  { id:"cm5", name:"Ngozi Adebayo", initials:"NA", email:"ngozi@hive.ng" },
  { id:"cm6", name:"Emeka Udoh", initials:"EU", email:"emeka@hive.ng" },
  { id:"cm7", name:"Chioma Nwosu", initials:"CN", email:"chioma@hive.ng" },
  { id:"cm8", name:"Funke Alabi", initials:"FA", email:"funke@hive.ng" },
];

/* ---------------------------------------------------------------- */
/*  Lesson Editor Drawer wrapper                                     */
/* ---------------------------------------------------------------- */

function LessonEditorDrawer({
  open, onClose, title, onSave, children,
}: { open: boolean; onClose: () => void; title: string; onSave: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[520px] bg-background border-l z-50 shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="size-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"><HugeiconsIcon icon={Cancel01Icon} size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 flex flex-col gap-4">{children}</div>
        <div className="px-5 py-4 border-t shrink-0 flex items-center gap-2 justify-end">
          <Button variant="outline" className="rounded-full" onClick={onClose}>Cancel</Button>
          <Button className="rounded-full" onClick={onSave}>Save Lesson</Button>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- */
/*  Invite Attendees Modal                                          */
/* ---------------------------------------------------------------- */

function InviteAttendeesModal({
  open, onClose, currentAttendees, onInvite,
}: { open: boolean; onClose: () => void; currentAttendees: string[]; onInvite: (emails: string[]) => void }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = COMMUNITY_MEMBERS_FOR_INVITE.filter((m) => {
    if (currentAttendees.includes(m.email)) return false;
    const q = search.toLowerCase();
    return !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  const allSelected = filtered.length > 0 && filtered.every((m) => selected.includes(m.email));

  const toggleAll = () => {
    if (allSelected) setSelected((p) => p.filter((e) => !filtered.find((m) => m.email === e)));
    else setSelected((p) => [...new Set([...p, ...filtered.map((m) => m.email)])]);
  };

  const toggle = (email: string) => setSelected((p) => p.includes(email) ? p.filter((e) => e !== email) : [...p, email]);

  const handleInvite = () => {
    if (selected.length === 0) return;
    onInvite(selected);
    setSelected([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-0"><DialogTitle className="text-base">Invite Attendees</DialogTitle></DialogHeader>
        <div className="px-4 pt-3 pb-1"><Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-full" autoFocus /></div>
        <div className="px-4 py-2 flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" />Select all</label>
          <span className="text-[10px] text-muted-foreground">{selected.length} selected</span>
        </div>
        <div className="px-4 pb-4 max-h-64 overflow-y-auto scrollbar-hide">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No members found</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filtered.map((m) => (
                <label key={m.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted cursor-pointer">
                  <input type="checkbox" checked={selected.includes(m.email)} onChange={() => toggle(m.email)} className="rounded shrink-0" />
                  <Avatar className="size-8 shrink-0"><AvatarFallback className="text-[10px]">{m.initials}</AvatarFallback></Avatar>
                  <div className="min-w-0"><p className="text-sm font-medium truncate">{m.name}</p><p className="text-[10px] text-muted-foreground truncate">{m.email}</p></div>
                </label>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="px-4 pb-4 gap-2"><Button variant="outline" className="rounded-full" onClick={onClose}>Cancel</Button><Button className="rounded-full" onClick={handleInvite} disabled={selected.length === 0}>Invite {selected.length > 0 && `(${selected.length})`}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
/*  Video Lesson Editor Dialog                                      */
/* ---------------------------------------------------------------- */

function VideoLessonEditor({
  open,
  onClose,
  lesson,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onSave: (lesson: Lesson) => void;
}) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [freePreview, setFreePreview] = useState(lesson?.freePreview ?? false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([]);

  const handleUpload = () => {
    setUploading(true); setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) { clearInterval(interval); setUploading(false); setProcessed(true); return 100; }
        return p + Math.random() * 25;
      });
    }, 400);
  };

  const handleSave = () => {
    if (!lesson) return;
    onSave({ ...lesson, title, description, freePreview });
    onClose();
  };

  if (!lesson) return null;

  return (
    <LessonEditorDrawer open={open} onClose={onClose} title="Edit Video Lesson" onSave={handleSave}>
      <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" /></div>
      <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl min-h-[60px]" /></div>
      <Separator />
      <div>
        <Label className="text-xs font-medium mb-2 block">Video File</Label>
            {!uploading && !processed ? (
              <div className="rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 transition-colors p-8 text-center flex flex-col items-center gap-2 bg-muted/20">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center"><HugeiconsIcon icon={Upload01Icon} size={22} className="text-muted-foreground" /></div>
                <p className="text-sm font-medium">Upload video</p>
                <p className="text-xs text-muted-foreground">Drag & drop or click to browse. MP4, MOV up to 2GB.</p>
                <Button size="sm" className="rounded-full mt-2" onClick={handleUpload}>Browse Files</Button>
              </div>
            ) : uploading ? (
              <div className="rounded-xl border p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm"><span className="font-medium">Uploading lesson-{lesson.id}.mp4</span><span className="text-muted-foreground tabular-nums">{Math.round(uploadProgress)}%</span></div>
                <Progress value={uploadProgress} className="h-2" />
                {uploadProgress >= 100 && <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2"><svg className="animate-spin h-3 w-3 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Transcoding…</div>}
              </div>
            ) : (
              <div className="rounded-xl border p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="size-10 rounded-lg bg-muted flex items-center justify-center"><HugeiconsIcon icon={PlayIcon} size={18} className="text-muted-foreground" /></div><div><p className="text-sm font-medium">lesson-{lesson.id}.mp4</p><p className="text-xs text-muted-foreground">18:45 · 342 MB</p></div></div>
                  <Badge className="rounded-full bg-emerald-100 text-emerald-700 text-[10px]"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} className="mr-1" />Ready</Badge>
                </div>
                {/* Resolutions */}
                <div className="flex flex-wrap gap-1.5">
                  {["360p ✓", "720p ✓", "1080p ✓", "Audio Only ✓"].map((r) => (<Badge key={r} variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">{r}</Badge>))}
                </div>
                {/* Video preview */}
                <div className="aspect-video rounded-xl bg-black/90 flex items-center justify-center">
                  <div className="size-14 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"><HugeiconsIcon icon={PlayIcon} size={24} className="text-white ml-0.5" /></div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Free preview */}
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Free Preview</p><p className="text-xs text-muted-foreground">Visible to non-enrolled users</p></div><Switch checked={freePreview} onCheckedChange={setFreePreview} /></div>

          <Separator />

          {/* Attachments */}
          <div>
            <Label className="text-xs font-medium mb-2 block">Attachments</Label>
            {attachments.length === 0 ? (
              <button onClick={() => setAttachments([{ name: "react-cheatsheet.pdf", size: "1.2 MB" }, { name: "exercise-files.zip", size: "4.8 MB" }])} className="w-full rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 p-4 text-center flex flex-col items-center gap-1.5 bg-muted/20">
                <HugeiconsIcon icon={Attachment01Icon} size={18} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Add supplementary files (PDFs, slides, code)</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                {attachments.map((a, i) => (<div key={i} className="flex items-center justify-between rounded-lg border px-3 py-2"><div className="flex items-center gap-2 min-w-0"><HugeiconsIcon icon={Attachment01Icon} size={14} className="text-muted-foreground shrink-0" /><span className="text-xs truncate">{a.name}</span></div><div className="flex items-center gap-2 shrink-0"><span className="text-[10px] text-muted-foreground">{a.size}</span><button onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))}><HugeiconsIcon icon={Cancel01Icon} size={13} className="text-muted-foreground hover:text-destructive" /></button></div></div>))}
                <button onClick={() => setAttachments((p) => [...p, { name: `new-file-${p.length + 1}.pdf`, size: "0.5 MB" }])} className="text-xs text-primary hover:underline self-start">+ Add file</button>
              </div>
            )}
          </div>
    </LessonEditorDrawer>
  );
}

/* ---------------------------------------------------------------- */
/*  PDF Lesson Editor                                               */
/* ---------------------------------------------------------------- */

function PdfLessonEditor({
  open, onClose, lesson, onSave,
}: { open: boolean; onClose: () => void; lesson: Lesson | null; onSave: (l: Lesson) => void }) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [freePreview, setFreePreview] = useState(lesson?.freePreview ?? false);
  const [uploaded, setUploaded] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; size: string }[]>([]);

  const handleSave = () => { if (!lesson) return; onSave({ ...lesson, title, description, freePreview }); onClose(); };
  if (!lesson) return null;

  return (
    <LessonEditorDrawer open={open} onClose={onClose} title="Edit PDF Lesson" onSave={handleSave}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" /></div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl min-h-[60px]" /></div>
          <Separator />
          <div>
            <Label className="text-xs font-medium mb-2 block">PDF File</Label>
            {!uploaded ? (
              <button onClick={() => setUploaded(true)} className="w-full rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 transition-colors p-8 flex flex-col items-center gap-2 bg-muted/20">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center"><HugeiconsIcon icon={Upload01Icon} size={22} className="text-muted-foreground" /></div>
                <p className="text-sm font-medium">Upload PDF</p><p className="text-xs text-muted-foreground">Drag & drop or click to browse. Up to 50MB.</p>
                <Button size="sm" className="rounded-full mt-2">Browse Files</Button>
              </button>
            ) : (
              <div className="rounded-xl border p-4">
                <div className="aspect-[1.4/1] bg-muted/30 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-center"><p className="text-4xl mb-1">📄</p><p className="text-xs text-muted-foreground">{lesson.title}.pdf</p><p className="text-[10px] text-muted-foreground">Click to preview</p></div>
                </div>
                <div className="flex items-center justify-between text-sm"><span className="font-medium truncate">{lesson.title}.pdf</span><Button size="sm" variant="outline" className="rounded-full text-xs h-7" onClick={() => setUploaded(false)}>Replace</Button></div>
              </div>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Free Preview</p><p className="text-xs text-muted-foreground">Visible to non-enrolled users</p></div><Switch checked={freePreview} onCheckedChange={setFreePreview} /></div>
          <Separator />
          <div><Label className="text-xs font-medium mb-2 block">Attachments</Label>
            {attachments.length === 0 ? (
              <button onClick={() => setAttachments([{ name: "slides-deck.pdf", size: "3.1 MB" }])} className="w-full rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/30 p-4 flex flex-col items-center gap-1.5 bg-muted/20"><HugeiconsIcon icon={Attachment01Icon} size={18} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Add supplementary files</span></button>
            ) : (
              <div className="flex flex-col gap-2">
                {attachments.map((a,i)=>(<div key={i} className="flex items-center justify-between rounded-lg border px-3 py-2"><div className="flex items-center gap-2 min-w-0"><HugeiconsIcon icon={Attachment01Icon} size={14} className="text-muted-foreground"/><span className="text-xs truncate">{a.name}</span></div><span className="text-[10px] text-muted-foreground">{a.size}</span></div>))}
              </div>
            )}
          </div>
        </div>
    </LessonEditorDrawer>
  );
}

/* ---------------------------------------------------------------- */
/*  Live Class Editor                                               */
/* ---------------------------------------------------------------- */

/* ---------------------------------------------------------------- */
/*  Live Class Editor (with meeting generation)                      */
/* ---------------------------------------------------------------- */

type MeetingInfo = {
  joinUrl: string;
  meetingId: string;
  password?: string;
  provider: string;
  attendees: string[];
  eventId: string;
};

function generateMeeting(platform: string, title: string, duration: string): Omit<MeetingInfo, "attendees"> {
  const id = `${platform}-${Math.random().toString(36).slice(2, 10)}`;
  return {
    joinUrl: platform === "google-meet"
      ? `https://meet.google.com/${id.slice(0, 10)}`
      : `https://zoom.us/j/${Math.floor(Math.random() * 9999999999)}`,
    meetingId: platform === "google-meet" ? id.slice(0, 12) : `${Math.floor(Math.random() * 99999999999)}`,
    password: platform === "zoom" ? Math.random().toString(36).slice(2, 8) : undefined,
    provider: platform === "google-meet" ? "google" : "zoom",
    eventId: `evt_${Date.now()}`,
  };
}

function LiveClassEditor({
  open, onClose, lesson, onSave,
}: { open: boolean; onClose: () => void; lesson: Lesson | null; onSave: (l: Lesson) => void }) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [description, setDescription] = useState(lesson?.description ?? "");
  const [date, setDate] = useState("2025-04-15");
  const [time, setTime] = useState("14:00");
  const [timezone] = useState("WAT (UTC+1)");
  const [duration, setDuration] = useState("60");
  const [platform, setPlatform] = useState("google-meet");
  const [meetingLink, setMeetingLink] = useState("");
  const [meeting, setMeeting] = useState<MeetingInfo | null>(null);
  const [preAttendees, setPreAttendees] = useState<string[]>(["ade@hive.ng", "chioma@hive.ng"]);
  const [generating, setGenerating] = useState(false);
  const [freePreview, setFreePreview] = useState(lesson?.freePreview ?? false);
  const [hasPassed] = useState(false);
  const [recordingUploaded, setRecordingUploaded] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));
    const m = {
      ...generateMeeting(platform, title, duration),
      attendees: preAttendees,
    };
    setMeeting(m);
    setMeetingLink(m.joinUrl);
    setGenerating(false);
  };

  const handleCancelMeeting = () => { setMeeting(null); setMeetingLink(""); };

  const handleSave = () => { if (!lesson) return; onSave({ ...lesson, title, description, duration: `${duration} min`, freePreview }); onClose(); };
  if (!lesson) return null;

  return (
    <>
    <LessonEditorDrawer open={open} onClose={onClose} title="Edit Live Class" onSave={handleSave}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" /></div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl min-h-[60px]" /></div>
          <Separator />
          <div><Label className="text-xs font-medium mb-2 block">Schedule</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl text-sm" /></div>
              <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Time</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-xl text-sm" /></div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5"><HugeiconsIcon icon={Clock01Icon} size={11} className="inline mr-1" />{timezone}</p>
          </div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Duration (minutes)</Label><Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(e.target.value)} className="rounded-xl max-w-[140px]" /></div>
          <Separator />
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium">Platform</Label>
            <div className="flex flex-wrap gap-2">
              {[{ v:"google-meet", l:"Google Meet" },{ v:"zoom", l:"Zoom" },{ v:"external", l:"External Link" }].map((o) => (
                <button key={o.v} onClick={() => { setPlatform(o.v); setMeeting(null); setMeetingLink(""); }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${platform === o.v ? "border-foreground bg-muted font-medium" : "border-border hover:border-muted-foreground/30"}`}>{o.l}</button>
              ))}
            </div>
          </div>

          {/* Invite attendees (before generation) + Generate */}
          {platform === "external" ? (
            <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Meeting Link</Label><Input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://..." className="rounded-xl text-sm" /></div>
          ) : meeting ? (
            /* Meeting created — show info card, no editing */
            <Card className="p-4 flex flex-col gap-3 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <Badge className="rounded-full text-[10px] px-2 py-0 h-5 bg-emerald-100 text-emerald-700">Meeting Created</Badge>
                <button onClick={handleCancelMeeting} className="text-xs text-muted-foreground hover:text-destructive">Cancel Meeting</button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Provider:</span> <span className="font-medium capitalize">{meeting.provider}</span></div>
                <div><span className="text-muted-foreground">ID:</span> <span className="font-medium font-mono text-[11px]">{meeting.meetingId}</span></div>
                {meeting.password && <div><span className="text-muted-foreground">Passcode:</span> <span className="font-medium font-mono">{meeting.password}</span></div>}
              </div>
              <div className="flex items-center gap-2">
                <Input value={meeting.joinUrl} readOnly className="rounded-full text-xs bg-background flex-1" />
                <Button size="icon" variant="outline" className="size-9 rounded-full shrink-0" onClick={() => navigator.clipboard.writeText(meeting.joinUrl)}>
                  <HugeiconsIcon icon={Copy01Icon} size={15} />
                </Button>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] text-muted-foreground">Attendees ({meeting.attendees.length})</Label>
                <div className="flex flex-wrap gap-1">{meeting.attendees.map((e) => (<Badge key={e} variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">{e}</Badge>))}</div>
              </div>
            </Card>
          ) : (
            /* Pre-generation: invite attendees then generate */
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Attendees ({preAttendees.length})</Label>
                  <Button size="sm" variant="outline" className="rounded-full h-7 text-xs" onClick={() => setInviteModalOpen(true)}>
                    <HugeiconsIcon icon={Add01Icon} size={12} className="mr-1" />Invite
                  </Button>
                </div>
                {preAttendees.length > 0 ? (
                  <div className="flex flex-wrap gap-1">{preAttendees.map((e) => (<Badge key={e} variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">{e}</Badge>))}</div>
                ) : (
                  <p className="text-xs text-muted-foreground">No attendees added yet. Invite community members.</p>
                )}
              </div>
              <Button onClick={handleGenerate} disabled={generating || !title.trim()} className="rounded-full">
                {generating ? (
                  <><svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating…
                </>
                ) : (
                  <><HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />Generate Meeting Link</>
                )}
              </Button>
            </div>
          )}

          <Separator />
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Free Preview</p><p className="text-xs text-muted-foreground">Visible to non-enrolled users</p></div><Switch checked={freePreview} onCheckedChange={setFreePreview} /></div>

          {/* Post-class */}
          {hasPassed && (
            <>
              <Separator />
              <div><Label className="text-xs font-medium mb-2 block">Post-Class</Label>
                {!recordingUploaded ? (
                  <button onClick={() => setRecordingUploaded(true)} className="w-full rounded-xl border-2 border-dashed border-border p-4 flex items-center gap-3 bg-muted/20"><HugeiconsIcon icon={Upload01Icon} size={18} className="text-muted-foreground" /><span className="text-sm">Upload Recording</span></button>
                ) : (
                  <div className="rounded-xl border p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="size-10 rounded-lg bg-muted flex items-center justify-center"><HugeiconsIcon icon={PlayIcon} size={16} className="text-muted-foreground" /></div><div><p className="text-sm font-medium">class-recording.mp4</p><p className="text-[10px] text-muted-foreground">62 min · 480 MB</p></div></div><button onClick={() => setRecordingUploaded(false)} className="text-xs text-muted-foreground hover:text-foreground">Replace</button></div>
                )}
              </div>
              <button onClick={() => setShowAttendance(!showAttendance)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><HugeiconsIcon icon={UserGroupIcon} size={14} />Attendance Summary</button>
              {showAttendance && (
                <div className="rounded-xl border p-4 flex flex-col gap-3 animate-in fade-in"><div className="grid grid-cols-3 gap-3">{[{ l:"Attended",v:"34" },{ l:"Avg Duration",v:"48 min" },{ l:"Peak",v:"28" }].map((s)=>(<div key={s.l} className="text-center"><p className="text-lg font-bold tabular-nums">{s.v}</p><p className="text-[10px] text-muted-foreground">{s.l}</p></div>))}</div></div>
              )}
            </>
          )}
        </div>
    </LessonEditorDrawer>
      <InviteAttendeesModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        currentAttendees={preAttendees}
        onInvite={(emails) => setPreAttendees((p) => [...p, ...emails])}
      />
    </>
  );
}

/* ---------------------------------------------------------------- */
/*  Quiz Builder                                                    */
/* ---------------------------------------------------------------- */

type QuizQuestion = { id: string; type: "multiple" | "truefalse" | "fillblank"; text: string; points: string; options?: string[]; correctAnswer?: string; explanation?: string };

function QuizBuilder({
  open, onClose, lesson, onSave,
}: { open: boolean; onClose: () => void; lesson: Lesson | null; onSave: (l: Lesson) => void }) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [passScore, setPassScore] = useState("70");
  const [timeLimit, setTimeLimit] = useState("");
  const [attempts, setAttempts] = useState("2");
  const [randomize, setRandomize] = useState(false);
  const [showAnswers, setShowAnswers] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [addingQ, setAddingQ] = useState(false);
  const [newQType, setNewQType] = useState<"multiple" | "truefalse" | "fillblank">("multiple");
  const [newQText, setNewQText] = useState("");
  const [newQPoints, setNewQPoints] = useState("1");
  const [newQOptions, setNewQOptions] = useState<string[]>(["", ""]);
  const [newQCorrect, setNewQCorrect] = useState("");

  const addQuestion = () => {
    if (!newQText.trim()) return;
    const q: QuizQuestion = { id: `q${Date.now()}`, type: newQType, text: newQText, points: newQPoints };
    if (newQType === "multiple") { q.options = newQOptions.filter((o) => o.trim()); q.correctAnswer = newQCorrect; }
    else if (newQType === "truefalse") q.correctAnswer = newQCorrect;
    else if (newQType === "fillblank") q.correctAnswer = newQCorrect;
    setQuestions((p) => [...p, q]);
    setAddingQ(false); setNewQText(""); setNewQPoints("1"); setNewQOptions(["", ""]); setNewQCorrect(""); setNewQType("multiple");
  };

  const deleteQuestion = (id: string) => setQuestions((p) => p.filter((q) => q.id !== id));
  const moveQuestion = (idx: number, dir: -1 | 1) => { const i = idx + dir; if (i < 0 || i >= questions.length) return; setQuestions((p) => { const arr = [...p]; [arr[idx], arr[i]] = [arr[i], arr[idx]]; return arr; }); };

  const handleSave = () => { if (!lesson) return; onSave({ ...lesson, title, duration: `${questions.length} questions` }); onClose(); };
  if (!lesson) return null;

  return (
    <LessonEditorDrawer open={open} onClose={onClose} title="Quiz Builder" onSave={handleSave}>
        <div className="flex flex-col gap-4">
          {/* Settings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Pass Score %</Label><Input type="number" value={passScore} onChange={(e) => setPassScore(e.target.value)} className="rounded-xl text-sm" /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Time Limit (min)</Label><Input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="Optional" className="rounded-xl text-sm" /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Attempts</Label><Input type="number" value={attempts} onChange={(e) => setAttempts(e.target.value)} className="rounded-xl text-sm" /></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><Switch checked={randomize} onCheckedChange={setRandomize} id="randomize" /><Label htmlFor="randomize" className="text-xs cursor-pointer">Randomize order</Label></div>
            <div className="flex items-center gap-2"><Switch checked={showAnswers} onCheckedChange={setShowAnswers} id="showAnswers" /><Label htmlFor="showAnswers" className="text-xs cursor-pointer">Show answers after</Label></div>
          </div>
          <Separator />
          {/* Questions */}
          <div className="flex items-center justify-between"><Label className="text-xs font-semibold">{questions.length} Questions</Label><Button size="sm" variant="outline" className="rounded-full h-8 text-xs" onClick={() => setAddingQ(true)}><HugeiconsIcon icon={Add01Icon} size={13} className="mr-1" />Add Question</Button></div>
          {questions.map((q, qi) => (
            <Card key={q.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between"><Badge className={`rounded-full text-[10px] px-2 py-0 h-5 ${q.type==="multiple"?"bg-blue-100 text-blue-700":q.type==="truefalse"?"bg-amber-100 text-amber-700":"bg-violet-100 text-violet-700"}`}>{q.type==="multiple"?"Multi Choice":q.type==="truefalse"?"True/False":"Fill Blank"}</Badge><div className="flex items-center gap-1"><button onClick={() => moveQuestion(qi, -1)} disabled={qi===0} className="text-muted-foreground disabled:opacity-30"><HugeiconsIcon icon={ArrowUp01Icon} size={13}/></button><button onClick={() => moveQuestion(qi, 1)} disabled={qi===questions.length-1} className="text-muted-foreground disabled:opacity-30"><HugeiconsIcon icon={ArrowDown01Icon} size={13}/></button><button onClick={() => deleteQuestion(q.id)} className="text-muted-foreground hover:text-destructive"><HugeiconsIcon icon={Delete01Icon} size={13}/></button></div></div>
              <p className="text-sm font-medium">{q.text}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground"><span>{q.points} pt{q.points!=="1"&&"s"}</span>{q.correctAnswer && <span>Answer: {q.correctAnswer}</span>}</div>
            </Card>
          ))}
          {addingQ && (
            <Card className="p-4 flex flex-col gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">{(["multiple","truefalse","fillblank"] as const).map((t)=>(<button key={t} onClick={()=>setNewQType(t)} className={`text-[10px] px-2 py-1 rounded-full border ${newQType===t?"border-foreground bg-muted font-medium":"border-border"}`}>{t==="multiple"?"Multi Choice":t==="truefalse"?"True/False":"Fill Blank"}</button>))}</div>
              <div className="flex items-center gap-2"><Input placeholder="Question text" value={newQText} onChange={(e)=>setNewQText(e.target.value)} className="rounded-xl flex-1 text-sm h-9"/><Input type="number" value={newQPoints} onChange={(e)=>setNewQPoints(e.target.value)} className="rounded-xl w-20 text-sm h-9" placeholder="Pts"/></div>
              {newQType==="multiple" && (<div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Options (mark correct with radio)</Label>{newQOptions.map((opt,oi)=>(<div key={oi} className="flex items-center gap-2"><input type="radio" name="correct" checked={newQCorrect===opt} onChange={()=>setNewQCorrect(opt)} className="shrink-0"/><Input value={opt} onChange={(e)=>{const arr=[...newQOptions];arr[oi]=e.target.value;setNewQOptions(arr)}} placeholder={`Option ${oi+1}`} className="rounded-xl h-8 text-sm flex-1"/>{oi>1&&<button onClick={()=>setNewQOptions((p)=>p.filter((_,j)=>j!==oi))} className="shrink-0"><HugeiconsIcon icon={Cancel01Icon} size={14} className="text-muted-foreground"/></button>}</div>))}<button onClick={()=>setNewQOptions((p)=>[...p,""])} className="text-xs text-primary hover:underline self-start">+ Add option</button></div>)}
              {newQType==="truefalse" && (<div className="flex items-center gap-4">{[{v:"true",l:"True"},{v:"false",l:"False"}].map((o)=>(<label key={o.v} className="flex items-center gap-2 text-sm"><input type="radio" name="correct" checked={newQCorrect===o.v} onChange={()=>setNewQCorrect(o.v)}/>{o.l}</label>))}</div>)}
              {newQType==="fillblank" && (<div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Correct Answer</Label><Input value={newQCorrect} onChange={(e)=>setNewQCorrect(e.target.value)} placeholder="e.g. JavaScript" className="rounded-xl text-sm h-9"/></div>)}
              <div className="flex items-center gap-2"><Button size="sm" className="rounded-full h-8 text-xs" onClick={addQuestion}>Add</Button><Button size="sm" variant="ghost" className="rounded-full h-8 text-xs" onClick={()=>setAddingQ(false)}>Cancel</Button></div>
            </Card>
          )}
        </div>
    </LessonEditorDrawer>
  );
}

/* ---------------------------------------------------------------- */
/*  Assignment Builder                                              */
/* ---------------------------------------------------------------- */

function AssignmentBuilder({
  open, onClose, lesson, onSave,
}: { open: boolean; onClose: () => void; lesson: Lesson | null; onSave: (l: Lesson) => void }) {
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [submissionType, setSubmissionType] = useState<"file" | "text" | "both">("both");
  const [allowedTypes, setAllowedTypes] = useState("PDF, DOCX, JPG, PNG");
  const [maxFileSize, setMaxFileSize] = useState("10");
  const [rubric, setRubric] = useState<{ criteria: string; maxPoints: string }[]>([]);

  const addRubricRow = () => setRubric((p) => [...p, { criteria: "", maxPoints: "10" }]);
  const removeRubricRow = (i: number) => setRubric((p) => p.filter((_, j) => j !== i));

  const handleSave = () => { if (!lesson) return; onSave({ ...lesson, title, description: instructions }); onClose(); };
  if (!lesson) return null;

  return (
    <LessonEditorDrawer open={open} onClose={onClose} title="Assignment Builder" onSave={handleSave}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" /></div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Instructions</Label><Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Describe the assignment requirements in detail..." className="rounded-xl min-h-[80px]" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Due Date (optional)</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl text-sm" /></div>
            <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Maximum Score</Label><Input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="rounded-xl text-sm" /></div>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium">Submission Type</Label>
            <div className="flex gap-2">{[{v:"file",l:"File Upload"},{v:"text",l:"Text Box"},{v:"both",l:"Both"}].map((o)=>(<button key={o.v} onClick={()=>setSubmissionType(o.v as typeof submissionType)} className={`text-xs px-3 py-1.5 rounded-full border ${submissionType===o.v?"border-foreground bg-muted font-medium":"border-border hover:border-muted-foreground/30"}`}>{o.l}</button>))}</div>
          </div>
          {(submissionType==="file"||submissionType==="both")&&(<div className="grid grid-cols-2 gap-3 animate-in fade-in"><div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Allowed File Types</Label><Input value={allowedTypes} onChange={(e)=>setAllowedTypes(e.target.value)} className="rounded-xl text-sm" /></div><div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Max File Size (MB)</Label><Input type="number" value={maxFileSize} onChange={(e)=>setMaxFileSize(e.target.value)} className="rounded-xl text-sm" /></div></div>)}
          <Separator />
          <div>
            <div className="flex items-center justify-between mb-2"><Label className="text-xs font-medium">Rubric (optional)</Label><Button size="sm" variant="ghost" className="rounded-full h-7 text-xs" onClick={addRubricRow}>+ Add row</Button></div>
            {rubric.length>0&&(<div className="flex flex-col gap-2">{rubric.map((r,i)=>(<div key={i} className="flex items-center gap-2"><Input value={r.criteria} onChange={(e)=>{const arr=[...rubric];arr[i]={...r,criteria:e.target.value};setRubric(arr)}} placeholder="Criteria" className="rounded-xl h-8 text-sm flex-1"/><Input type="number" value={r.maxPoints} onChange={(e)=>{const arr=[...rubric];arr[i]={...r,maxPoints:e.target.value};setRubric(arr)}} className="rounded-xl w-16 h-8 text-sm"/><button onClick={()=>removeRubricRow(i)}><HugeiconsIcon icon={Cancel01Icon} size={14} className="text-muted-foreground"/></button></div>))}</div>)}
          </div>
        </div>
    </LessonEditorDrawer>
  );
}

/* ---------------------------------------------------------------- */
/*  Curriculum tab                                                  */
/* ---------------------------------------------------------------- */

function CurriculumTab() {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [editingModId, setEditingModId] = useState<string | null>(null);
  const [editModTitle, setEditModTitle] = useState("");
  const [deleteModConfirm, setDeleteModConfirm] = useState<string | null>(null);
  const [newLessonFor, setNewLessonFor] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonType, setNewLessonType] = useState<LessonType>("video");
  const [editLesson, setEditLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editorLesson, setEditorLesson] = useState<Lesson | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pdfEditorLesson, setPdfEditorLesson] = useState<Lesson | null>(null);
  const [pdfEditorOpen, setPdfEditorOpen] = useState(false);
  const [liveEditorLesson, setLiveEditorLesson] = useState<Lesson | null>(null);
  const [liveEditorOpen, setLiveEditorOpen] = useState(false);
  const [quizEditorLesson, setQuizEditorLesson] = useState<Lesson | null>(null);
  const [quizEditorOpen, setQuizEditorOpen] = useState(false);
  const [assignmentEditorLesson, setAssignmentEditorLesson] = useState<Lesson | null>(null);
  const [assignmentEditorOpen, setAssignmentEditorOpen] = useState(false);

  /* Modules */
  const addModule = () => { if (!newModuleTitle.trim()) return; setModules((p) => [...p, { id: `mod${Date.now()}`, title: newModuleTitle, expanded: true, lessons: [] }]); setNewModuleTitle(""); };
  const toggleModule = (modId: string) => setModules((p) => p.map((m) => m.id === modId ? { ...m, expanded: !m.expanded } : m));
  const startEditModule = (modId: string, title: string) => { setEditingModId(modId); setEditModTitle(title); };
  const saveEditModule = () => { if (!editingModId || !editModTitle.trim()) return; setModules((p) => p.map((m) => m.id === editingModId ? { ...m, title: editModTitle } : m)); setEditingModId(null); };
  const deleteModule = (modId: string) => { setModules((p) => p.filter((m) => m.id !== modId)); setDeleteModConfirm(null); };
  const moveModule = (idx: number, dir: -1 | 1) => { const i = idx + dir; if (i < 0 || i >= modules.length) return; setModules((p) => { const arr = [...p]; [arr[idx], arr[i]] = [arr[i], arr[idx]]; return arr; }); };

  /* Lessons */
  const addLesson = (modId: string) => { if (!newLessonTitle.trim()) return; setModules((p) => p.map((m) => m.id === modId ? { ...m, lessons: [...m.lessons, { id: `l${Date.now()}`, title: newLessonTitle, duration: "0:00", type: newLessonType, status: "draft" as const, freePreview: false }] } : m)); setNewLessonTitle(""); setNewLessonType("video"); setNewLessonFor(null); };
  const deleteLesson = (modId: string, lessonId: string) => setModules((p) => p.map((m) => m.id === modId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m));
  const saveEditLesson = () => { if (!editLesson || !editTitle.trim()) return; setModules((p) => p.map((m) => m.id === editLesson.moduleId ? { ...m, lessons: m.lessons.map((l) => l.id === editLesson.lessonId ? { ...l, title: editTitle } : l) } : m)); setEditLesson(null); };
  const toggleFreePreview = (modId: string, lessonId: string) => setModules((p) => p.map((m) => m.id === modId ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, freePreview: !l.freePreview } : l) } : m));
  const moveLesson = (modId: string, idx: number, dir: -1 | 1) => { setModules((p) => p.map((m) => { if (m.id !== modId) return m; const arr = [...m.lessons]; const i = idx + dir; if (i < 0 || i >= arr.length) return m; [arr[idx], arr[i]] = [arr[i], arr[idx]]; return { ...m, lessons: arr }; })); };
  const openEditor = (modId: string, lessonId: string) => { setModules((p) => { for (const m of p) { if (m.id !== modId) continue; const l = m.lessons.find((x) => x.id === lessonId); if (!l) continue; if (l.type === "video") { setEditorLesson(l); setEditorOpen(true); } else if (l.type === "pdf") { setPdfEditorLesson(l); setPdfEditorOpen(true); } else if (l.type === "live") { setLiveEditorLesson(l); setLiveEditorOpen(true); } else if (l.type === "quiz") { setQuizEditorLesson(l); setQuizEditorOpen(true); } else if (l.type === "assignment") { setAssignmentEditorLesson(l); setAssignmentEditorOpen(true); } } return p; }); };
  const handleEditorSave = (updated: Lesson) => { setModules((p) => p.map((m) => ({ ...m, lessons: m.lessons.map((l) => l.id === updated.id ? { ...l, title: updated.title, description: updated.description, freePreview: updated.freePreview } : l) }))); };

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Curriculum</h3>
        <Badge variant="secondary" className="rounded-full">{totalLessons} lessons · {modules.length} modules</Badge>
      </div>

      {modules.map((mod, modIdx) => (
        <Card key={mod.id} className="overflow-hidden">
          {/* Module header */}
          <div className="flex items-center gap-2 px-5 py-3.5 bg-muted/30">
            <button onClick={() => toggleModule(mod.id)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <span className={`text-xs transition-transform inline-block ${mod.expanded ? "rotate-90" : ""}`}>▶</span>
            </button>
            {editingModId === mod.id ? (
              <div className="flex items-center gap-2 flex-1"><Input value={editModTitle} onChange={(e) => setEditModTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEditModule(); if (e.key === "Escape") setEditingModId(null); }} className="h-8 text-sm rounded-lg flex-1" autoFocus /><Button size="sm" className="rounded-full h-7 text-xs" onClick={saveEditModule}>Save</Button></div>
            ) : (
              <>
                <p className="text-sm font-semibold flex-1">{mod.title}</p>
                <span className="text-[10px] text-muted-foreground">{mod.lessons.length} lessons</span>
                <button onClick={() => startEditModule(mod.id, mod.title)} className="text-muted-foreground hover:text-foreground text-[11px] px-1">Edit</button>
                <button onClick={() => moveModule(modIdx, -1)} disabled={modIdx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><HugeiconsIcon icon={ArrowUp01Icon} size={14} /></button>
                <button onClick={() => moveModule(modIdx, 1)} disabled={modIdx === modules.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><HugeiconsIcon icon={ArrowDown01Icon} size={14} /></button>
                <button onClick={() => setDeleteModConfirm(mod.id)} className="text-muted-foreground hover:text-destructive"><HugeiconsIcon icon={Delete01Icon} size={14} /></button>
              </>
            )}
          </div>

          {/* Delete module confirm */}
          {deleteModConfirm === mod.id && (
            <div className="px-5 py-3 bg-destructive/5 border-b flex items-center justify-between text-sm">
              <span className="text-destructive">Delete &ldquo;{mod.title}&rdquo; and all its lessons?</span>
              <div className="flex gap-2"><Button size="sm" variant="ghost" className="rounded-full h-7 text-xs" onClick={() => setDeleteModConfirm(null)}>Cancel</Button><Button size="sm" variant="destructive" className="rounded-full h-7 text-xs" onClick={() => deleteModule(mod.id)}>Delete</Button></div>
            </div>
          )}

          {/* Lessons */}
          {mod.expanded && (
            <div className="divide-y">
              {mod.lessons.length === 0 && <p className="px-5 py-4 text-xs text-muted-foreground text-center">No lessons yet.</p>}
              {mod.lessons.map((lesson, lIdx) => (
                <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors group">
                  <span className="text-[11px] text-muted-foreground tabular-nums w-5 text-right shrink-0">{lIdx + 1}</span>
                  <span className="shrink-0">{(() => { const opt = LESSON_TYPE_OPTS.find((o) => o.value === lesson.type); return opt ? <HugeiconsIcon icon={opt.icon} size={15} className="text-muted-foreground" /> : null; })()}</span>
                  <div className="flex-1 min-w-0">
                    {editLesson?.lessonId === lesson.id ? (
                      <div className="flex items-center gap-2"><Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEditLesson(); }} className="h-8 text-sm rounded-lg flex-1" autoFocus /><Button size="sm" className="rounded-full h-7 text-xs" onClick={saveEditLesson}>Save</Button></div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm truncate flex-1">{lesson.title}</p>
                        <Badge className={`rounded-full text-[9px] px-1.5 py-0 h-4 ${LESSON_TYPE_COLORS[lesson.type]}`}>{lesson.type}</Badge>
                        {lesson.freePreview && <Badge variant="secondary" className="rounded-full text-[9px] px-1.5 py-0 h-4">Preview</Badge>}
                        <span className="text-[10px] text-muted-foreground shrink-0">{lesson.duration}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {(lesson.type === "video" || lesson.type === "pdf" || lesson.type === "live" || lesson.type === "quiz" || lesson.type === "assignment") && <button onClick={() => openEditor(mod.id, lesson.id)} className="text-[10px] hover:text-foreground text-muted-foreground px-1 font-medium">Edit</button>}
                    <button onClick={() => { setEditLesson({ moduleId: mod.id, lessonId: lesson.id }); setEditTitle(lesson.title); }} className="text-[10px] hover:text-foreground text-muted-foreground px-1">Rename</button>
                    <button onClick={() => toggleFreePreview(mod.id, lesson.id)} className={`text-[10px] px-1 ${lesson.freePreview ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Preview</button>
                    <button onClick={() => moveLesson(mod.id, lIdx, -1)} disabled={lIdx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><HugeiconsIcon icon={ArrowUp01Icon} size={13} /></button>
                    <button onClick={() => moveLesson(mod.id, lIdx, 1)} disabled={lIdx === mod.lessons.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><HugeiconsIcon icon={ArrowDown01Icon} size={13} /></button>
                    <button onClick={() => deleteLesson(mod.id, lesson.id)} className="text-muted-foreground hover:text-destructive"><HugeiconsIcon icon={Delete01Icon} size={13} /></button>
                  </div>
                </div>
              ))}

              {/* Add lesson form */}
              {newLessonFor === mod.id ? (
                <div className="px-5 py-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Lesson title..." value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addLesson(mod.id); if (e.key === "Escape") setNewLessonFor(null); }} className="h-9 rounded-lg flex-1 text-sm" autoFocus />
                    <Button size="sm" className="rounded-full h-9 text-xs" onClick={() => addLesson(mod.id)}>Add</Button>
                    <Button size="sm" variant="ghost" className="rounded-full h-9 text-xs" onClick={() => setNewLessonFor(null)}>Cancel</Button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {LESSON_TYPE_OPTS.map((opt) => (
                      <button key={opt.value} onClick={() => setNewLessonType(opt.value)} className={`text-[10px] px-2 py-1 rounded-full border transition-colors flex items-center gap-1 ${newLessonType === opt.value ? "border-foreground bg-muted font-medium" : "border-border hover:border-muted-foreground/30"}`}><HugeiconsIcon icon={opt.icon} size={12} />{opt.label}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <button onClick={() => { setNewLessonFor(mod.id); setNewLessonTitle(""); setNewLessonType("video"); }} className="w-full px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors flex items-center gap-1.5 justify-center">
                  <HugeiconsIcon icon={Add01Icon} size={13} />Add Lesson
                </button>
              )}
            </div>
          )}
        </Card>
      ))}

      {/* Add module */}
      <div className="flex items-center gap-2">
        <Input placeholder="New module title..." value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addModule(); }} className="rounded-full flex-1" />
        <Button size="sm" className="rounded-full" onClick={addModule}>Add Module</Button>
      </div>

      {/* Video lesson editor */}
      <VideoLessonEditor open={editorOpen} onClose={() => setEditorOpen(false)} lesson={editorLesson} onSave={handleEditorSave} />
      <PdfLessonEditor open={pdfEditorOpen} onClose={() => setPdfEditorOpen(false)} lesson={pdfEditorLesson} onSave={handleEditorSave} />
      <LiveClassEditor open={liveEditorOpen} onClose={() => setLiveEditorOpen(false)} lesson={liveEditorLesson} onSave={handleEditorSave} />
      <QuizBuilder open={quizEditorOpen} onClose={() => setQuizEditorOpen(false)} lesson={quizEditorLesson} onSave={handleEditorSave} />
      <AssignmentBuilder open={assignmentEditorOpen} onClose={() => setAssignmentEditorOpen(false)} lesson={assignmentEditorLesson} onSave={handleEditorSave} />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Settings tab                                                    */
/* ---------------------------------------------------------------- */

function SettingsTab() {
  const [title, setTitle] = useState(COURSE.title);
  const [description, setDescription] = useState(COURSE.description);
  const [category, setCategory] = useState(COURSE.category);
  const [difficulty, setDifficulty] = useState<Difficulty>(COURSE.difficulty);
  const [isFree, setIsFree] = useState(COURSE.isFree);
  const [oneTimePrice, setOneTimePrice] = useState(COURSE.oneTimePrice);
  const [monthlyPrice, setMonthlyPrice] = useState(COURSE.monthlyPrice);
  const [sequentialAccess, setSequentialAccess] = useState(COURSE.sequentialAccess);
  const [dripContent, setDripContent] = useState(COURSE.dripContent);
  const [allowComments, setAllowComments] = useState(COURSE.allowComments);
  const [allowDownloads, setAllowDownloads] = useState(COURSE.allowDownloads);
  const [offerCertificate, setOfferCertificate] = useState(COURSE.offerCertificate);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [minCompletion, setMinCompletion] = useState(COURSE.minCompletion);
  const [minQuizScore, setMinQuizScore] = useState(COURSE.minQuizScore);
  const [minAttendance, setMinAttendance] = useState(COURSE.minAttendance);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Basic Information</h3>
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl min-h-[80px]" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger className="rounded-xl h-10 text-sm"><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex flex-col gap-1.5"><Label className="text-xs font-medium">Difficulty</Label><Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}><SelectTrigger className="rounded-xl h-10 text-sm"><SelectValue /></SelectTrigger><SelectContent>{DIFFICULTY_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <div><Label className="text-xs font-medium mb-2 block">Cover Image</Label>
          {coverPreview ? (<div className="relative rounded-xl overflow-hidden aspect-[2.5/1] bg-muted group"><Image src={coverPreview} alt="" fill className="object-cover" /><button onClick={() => { URL.revokeObjectURL(coverPreview); setCoverPreview(null); }} className="absolute top-3 right-3 size-8 rounded-full bg-background/80 hover:bg-background flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100"><HugeiconsIcon icon={Cancel01Icon} size={16} /></button></div>)
          : (<button onClick={() => fileRef.current?.click()} className="w-full rounded-xl border-2 border-dashed relative aspect-[2.5/1] flex flex-col items-center justify-center gap-2 bg-muted/30"><HugeiconsIcon icon={Image01Icon} size={20} className="text-muted-foreground" /><span className="text-sm font-medium">Upload cover image</span></button>)}
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverPreview(URL.createObjectURL(f)); }} className="hidden" />
        </div>
      </Card>
      <Card className="p-5 flex flex-col gap-4"><h3 className="text-sm font-semibold">Pricing</h3><div className="flex items-center justify-between"><p className="text-sm font-medium">Free course</p><Switch checked={isFree} onCheckedChange={setIsFree} /></div>{!isFree && (<div className="grid grid-cols-2 gap-4 animate-in fade-in">{[{ l:"One-time (₦)", v:oneTimePrice, s:setOneTimePrice },{ l:"Monthly (₦)", v:monthlyPrice, s:setMonthlyPrice }].map((f)=>(<div key={f.l} className="flex flex-col gap-1.5"><Label className="text-xs font-medium">{f.l}</Label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₦</span><Input value={f.v} onChange={(e)=>f.s(fmtPrice(e.target.value))} className="rounded-xl pl-8" /></div></div>))}</div>)}</Card>
      <Card className="p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold">Visibility</h3>
        <div className="flex flex-wrap gap-2">
          {([
            { value: "public" as const, label: "Public", desc: "Visible on Explore — anyone can enroll", icon: Globe02Icon, color: "bg-emerald-100 dark:bg-emerald-900/30" as const },
            { value: "private" as const, label: "Private", desc: "Community members only — hidden from Explore", icon: LockIcon, color: "bg-violet-100 dark:bg-violet-900/30" as const },
          ]).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setVisibility(opt.value)}
              className={`flex-1 min-w-[140px] rounded-xl border-2 px-4 py-3 text-left transition-colors ${visibility === opt.value ? "border-foreground bg-muted/40" : "border-border hover:border-muted-foreground/30"}`}
            >
              <div className="flex items-center gap-2">
                <div className={`size-7 rounded-lg ${opt.color} flex items-center justify-center`}>
                  <HugeiconsIcon icon={opt.icon} size={14} className={opt.value === "public" ? "text-emerald-700 dark:text-emerald-400" : "text-violet-700 dark:text-violet-400"} />
                </div>
                <p className="text-sm font-medium">{opt.label}</p>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </Card>
      <Card className="p-5 flex flex-col gap-4"><h3 className="text-sm font-semibold">Course Settings</h3>{[{ l:"Sequential Access", d:"Complete lessons in order", s:sequentialAccess, t:setSequentialAccess },{ l:"Drip Content", d:"Release on a schedule", s:dripContent, t:setDripContent },{ l:"Allow Comments", d:"Students can comment", s:allowComments, t:setAllowComments },{ l:"Allow Downloads", d:"Download materials", s:allowDownloads, t:setAllowDownloads }].map((item,i)=>(<div key={item.l}>{i>0&&<Separator className="mb-4"/>}<div className="flex items-center justify-between"><div><p className="text-sm font-medium">{item.l}</p><p className="text-xs text-muted-foreground">{item.d}</p></div><Switch checked={item.s} onCheckedChange={item.t}/></div></div>))}</Card>
      <Card className="p-5 flex flex-col gap-4"><h3 className="text-sm font-semibold">Certificate</h3><div className="flex items-center justify-between"><p className="text-sm font-medium">Offer Certificate</p><Switch checked={offerCertificate} onCheckedChange={setOfferCertificate} /></div>{offerCertificate&&(<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in">{[{ l:"Min Completion",v:minCompletion,s:setMinCompletion },{ l:"Min Quiz Score",v:minQuizScore,s:setMinQuizScore },{ l:"Min Attendance",v:minAttendance,s:setMinAttendance }].map((f)=>(<div key={f.l} className="flex flex-col gap-1.5"><Label className="text-xs font-medium whitespace-nowrap">{f.l} (%)</Label><Input type="number" min={0} max={100} value={f.v} onChange={(e)=>f.s(e.target.value)} className="rounded-xl"/></div>))}</div>)}</Card>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3"><Button variant="outline" className="rounded-full">Save Draft</Button><Button className="rounded-full" onClick={() => setPublishOpen(true)}>Save &amp; Publish</Button></div>
        {/* Danger Zone */}
        <Card className="p-5 border-destructive/30"><h3 className="text-sm font-semibold text-destructive mb-3">Danger Zone</h3><p className="text-xs text-muted-foreground mb-3">Archiving hides this course. Existing students keep access but new enrollments stop.</p><Button variant="destructive" className="rounded-full" onClick={() => setArchiveOpen(true)}>Archive Course</Button></Card>
      </div>

      {/* Publish checklist modal */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Publish Course</DialogTitle><DialogDescription>Review before going live:</DialogDescription></DialogHeader>
          <div className="flex flex-col gap-2 text-sm py-2">
            {[{ ok:true, t:"6 lessons across 2 modules" },{ ok:true, t:"Cover image uploaded" },{ ok:false, t:"1 lesson still in draft — won't be visible" },{ ok:true, t:"Certificate settings configured" }].map((item,i)=>(<div key={i} className="flex items-center gap-2"><span className={item.ok?"text-emerald-600":"text-amber-600"}>{item.ok ? <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="text-emerald-600 shrink-0" /> : <HugeiconsIcon icon={Alert01Icon} size={14} className="text-amber-600 shrink-0" />}</span><span className="text-xs">{item.t}</span></div>))}
          </div>
          <p className="text-xs text-muted-foreground">This course will be visible to community members and appear in search results.</p>
          <DialogFooter className="gap-2"><Button variant="outline" className="rounded-full" onClick={()=>setPublishOpen(false)}>Cancel</Button><Button className="rounded-full" onClick={()=>setPublishOpen(false)}>Confirm &amp; Publish</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation */}
      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle>Archive Course</DialogTitle><DialogDescription>This will hide "{title}" from new students. Existing students retain access. You can restore it later from settings.</DialogDescription></DialogHeader>
          <DialogFooter className="gap-2"><Button variant="outline" className="rounded-full" onClick={()=>setArchiveOpen(false)}>Cancel</Button><Button variant="destructive" className="rounded-full" onClick={()=>setArchiveOpen(false)}>Archive</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Grading tab                                                     */
/* ---------------------------------------------------------------- */

type Submission = { id: string; student: string; initials: string; date: string; status: "pending" | "submitted" | "graded" | "returned"; score: string; text?: string; files?: string[] };

function GradingTab({ gradingAssignment, setGradingAssignment }: { gradingAssignment: Lesson | null; setGradingAssignment: (l: Lesson | null) => void }) {
  /* Get assignment lessons from curriculum */
  const [modules] = useState(INITIAL_MODULES);
  const assignments = modules.flatMap((m) => m.lessons.filter((l) => l.type === "assignment"));

  if (gradingAssignment) {
    const [submissions] = useState<Submission[]>([
      { id: "s1", student: "Kelechi Okonkwo", initials: "KO", date: "Mar 28, 2025", status: "submitted", score: "", text: "Here is my design system documentation...", files: ["design-system.pdf", "components.fig"] },
      { id: "s2", student: "Amara Obi", initials: "AO", date: "Mar 27, 2025", status: "graded", score: "85", text: "My approach to the design system...", files: ["amara-ds.pdf"] },
      { id: "s3", student: "Tunde Balogun", initials: "TB", date: "", status: "pending", score: "" },
    ]);
    const [viewing, setViewing] = useState<Submission | null>(null);
    const [gradeScore, setGradeScore] = useState("");
    const [feedback, setFeedback] = useState("");

    const openSubmission = (s: Submission) => { setViewing(s); setGradeScore(s.score); setFeedback(""); };

    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="flex items-center gap-2">
          <button onClick={() => setGradingAssignment(null)} className="text-sm text-muted-foreground hover:text-foreground"><HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="mr-1 inline" />Back</button>
          <h3 className="text-sm font-semibold">{gradingAssignment.title} — Submissions</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {["all","pending","submitted","graded","returned"].map((f)=>(<button key={f} className={`text-[10px] px-2 py-1 rounded-full capitalize ${true?"bg-foreground text-background font-medium":"text-muted-foreground border"}`}>{f}</button>))}
        </div>
        <Card className="overflow-hidden"><div className="divide-y">
          {submissions.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-8 shrink-0"><AvatarFallback className="text-[10px]">{s.initials}</AvatarFallback></Avatar>
                <div className="min-w-0"><p className="text-sm font-medium truncate">{s.student}</p><p className="text-[10px] text-muted-foreground">{s.date || "Not submitted"}</p></div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge className={`rounded-full text-[10px] px-2 py-0 h-5 ${s.status==="graded"?"bg-emerald-100 text-emerald-700":s.status==="submitted"?"bg-blue-100 text-blue-700":s.status==="returned"?"bg-amber-100 text-amber-700":"bg-muted text-muted-foreground"}`}>{s.status}</Badge>
                {s.score && <span className="text-xs font-medium tabular-nums">{s.score}/100</span>}
                <Button size="sm" variant="ghost" className="rounded-full h-7 text-xs" onClick={() => openSubmission(s)}>View</Button>
              </div>
            </div>
          ))}
        </div></Card>

        {/* Submission detail */}
        {viewing && (
          <Card className="p-5 flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center gap-3"><Avatar className="size-10"><AvatarFallback>{viewing.initials}</AvatarFallback></Avatar><div><p className="text-sm font-semibold">{viewing.student}</p><p className="text-xs text-muted-foreground">Submitted {viewing.date}</p></div></div>
            {viewing.text && <div className="rounded-xl bg-muted/30 p-4"><p className="text-sm text-muted-foreground">{viewing.text}</p></div>}
            {viewing.files && <div className="flex flex-wrap gap-2">{viewing.files.map((f)=>(<div key={f} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"><HugeiconsIcon icon={File01Icon} size={13} className="text-muted-foreground"/>{f}</div>))}</div>}
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Score (out of 100)</Label><Input type="number" min={0} max={100} value={gradeScore} onChange={(e) => setGradeScore(e.target.value)} className="rounded-xl text-sm" /></div>
            </div>
            <div className="flex flex-col gap-1.5"><Label className="text-[10px] text-muted-foreground">Feedback</Label><Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide feedback to the student..." className="rounded-xl min-h-[60px]" /></div>
            <div className="flex items-center gap-2"><Button className="rounded-full text-sm" onClick={() => setViewing(null)}>Grade & Return</Button><Button variant="outline" className="rounded-full text-sm" onClick={() => setViewing(null)}>Return for Revision</Button></div>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h3 className="text-sm font-semibold">Assignments ({assignments.length})</h3>
      {assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3"><HugeiconsIcon icon={AssignmentsIcon} size={28} className="text-muted-foreground/40" /><p className="text-sm text-muted-foreground">No assignments in this course yet</p></div>
      ) : (
        <div className="flex flex-col gap-2">
          {assignments.map((a) => (
            <button key={a.id} onClick={() => setGradingAssignment(a)} className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/30 transition-colors text-left">
              <div className="min-w-0"><p className="text-sm font-medium">{a.title}</p><p className="text-xs text-muted-foreground mt-0.5">3 submissions · 1 graded</p></div>
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="text-muted-foreground rotate-180 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Manage Course Page                                              */
/* ---------------------------------------------------------------- */

function ManageCoursePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = (searchParams.get("role") as Role) || "instructor";
  const [tab, setTab] = useState<Tab>("curriculum");
  const [gradingAssignment, setGradingAssignment] = useState<Lesson | null>(null);

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-6 min-w-0">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3"><HugeiconsIcon icon={ArrowLeft02Icon} size={14} />Back to Courses</button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div><h1 className="text-xl font-bold tracking-tight">{COURSE.title}</h1><div className="flex items-center gap-2 mt-1"><Badge className="rounded-full text-[10px] px-2 py-0 h-5">{COURSE.category}</Badge><Badge variant="secondary" className="rounded-full text-[10px] px-2 py-0 h-5">{COURSE.difficulty}</Badge><Badge className="rounded-full text-[10px] px-2 py-0 h-5 bg-emerald-100 text-emerald-700">{COURSE.status}</Badge></div></div>
            <Badge variant="secondary" className="rounded-full w-fit">{COURSE.enrollmentCount} enrolled</Badge>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
          {[{ key:"curriculum" as const, label:"Curriculum", icon:BookOpen01Icon },{ key:"grading" as const, label:"Grading", icon:AssignmentsIcon },{ key:"settings" as const, label:"Settings", icon:Settings01Icon }].map(({ key,label,icon }) => (
            <button key={key} onClick={()=>{ setTab(key); setGradingAssignment(null); }} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${tab===key?"bg-foreground text-background font-medium":"text-muted-foreground hover:text-foreground hover:bg-muted"}`}><HugeiconsIcon icon={icon} size={13}/>{label}</button>
          ))}
        </div>

        {tab==="curriculum" && <CurriculumTab />}
        {tab==="grading" && <GradingTab gradingAssignment={gradingAssignment} setGradingAssignment={setGradingAssignment} />}
        {tab==="settings" && <SettingsTab />}
      </div>
    </DashboardLayout>
  );
}

export default function Wrapper() {
  return <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-48 mb-4"/><div className="flex gap-2 mb-6">{[1,2].map(i=><Skeleton key={i} className="h-8 w-24 rounded-full"/>)}</div><Skeleton className="h-64 rounded-xl"/></div>}><ManageCoursePage /></Suspense>;
}
