"use client";

import { Suspense, useRef, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/app-sidebar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Menu } from "@base-ui/react/menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Message01Icon,
  MessageAdd01Icon,
  ArrowUp01Icon,
  ArrowLeft02Icon,
  Attachment01Icon,
  Image01Icon,
  File01Icon,
  CheckmarkCircle01Icon,
  CheckmarkCircle02Icon,
  Camera01Icon,
  Folder01Icon,
  PinIcon,
  MuteIcon,
  Delete01Icon,
  MoreHorizontalIcon,
  Copy01Icon,
  NotificationOff01Icon,
  UserGroupIcon,
  AtSignIcon,
} from "@hugeicons/core-free-icons";

/* ---------------------------------------------------------------- */
/*  Types & demo data                                               */
/* ---------------------------------------------------------------- */

type Role = "instructor" | "student" | "parent" | "admin";
type FilterMode = "all" | "messages" | "communities";

type Attachment = {
  type: "image" | "file";
  name: string;
  size?: string;
  url?: string;
};

type MessageStatus = "sent" | "delivered" | "read";

type Message = {
  id: string;
  sender: "me" | "them" | "system";
  senderName?: string;
  text?: string;
  attachment?: Attachment;
  time: string;
  status?: MessageStatus;
  reaction?: string;
  isSystem?: boolean;
};

type ConversationUser = {
  name: string;
  initials: string;
  role: string;
};

type Conversation = {
  id: string;
  type: "direct" | "community";
  user?: ConversationUser;
  communityName?: string;
  memberCount?: number;
  lastMessage: string;
  lastAttachment?: boolean;
  timestamp: string;
  unread: number;
  messages: Message[];
  typing?: boolean;
  pinned?: boolean;
  muted?: boolean;
};

const INITIAL_CONVERSATIONS: Conversation[] = [
  /* ---- Direct ---- */
  {
    id: "1",
    type: "direct",
    user: { name: "Ade Okafor", initials: "AO", role: "Instructor" },
    lastMessage: "Great work on the last assignment! Keep it up.",
    timestamp: "2m ago",
    unread: 2,
    messages: [
      { id: "m1", sender: "them", text: "Hi Chioma, I reviewed your submission.", time: "10:30 AM", status: "read" },
      { id: "m2", sender: "them", text: "Great work on the last assignment! Keep it up.", time: "10:31 AM", status: "read" },
    ],
  },
  {
    id: "2",
    type: "direct",
    user: { name: "Kelechi Nwosu", initials: "KN", role: "Student" },
    lastMessage: "Can we schedule a study group this weekend?",
    timestamp: "1h ago",
    unread: 0,
    messages: [
      { id: "m3", sender: "them", text: "Hey! Are you free this weekend?", time: "9:15 AM", status: "read" },
      { id: "m4", sender: "me", text: "Yeah, what's up?", time: "9:20 AM", status: "read" },
      { id: "m5", sender: "them", text: "Can we schedule a study group this weekend?", time: "9:21 AM", status: "read" },
    ],
    typing: true,
  },
  /* ---- Communities ---- */
  {
    id: "c1",
    type: "community",
    communityName: "Frontend Devs",
    memberCount: 24,
    lastMessage: "@chioma check out the new Figma plugin I shared",
    timestamp: "5m ago",
    unread: 4,
    messages: [
      { id: "cm1", sender: "them", senderName: "Tunde", text: "Has anyone tried the new React Server Components pattern yet?", time: "9:30 AM", status: "read" },
      { id: "cm2", sender: "them", senderName: "Amara", text: "Yes! Using it in production — it's been great for our landing pages.", time: "9:35 AM", status: "read" },
      { id: "cm3", sender: "system", text: "Kelechi joined the community", time: "9:40 AM", isSystem: true },
      { id: "cm4", sender: "them", senderName: "Tunde", text: "I just shipped a new UI library — @Amara you might find it useful for that dashboard project", time: "10:00 AM", status: "read" },
      { id: "cm5", sender: "them", senderName: "Amara", text: "@chioma check out the new Figma plugin I shared — makes auto-layout way faster", time: "10:10 AM", status: "read" },
    ],
  },
  {
    id: "c2",
    type: "community",
    communityName: "UI/UX Critique Circle",
    memberCount: 18,
    lastMessage: "Portfolio review session this Friday at 6pm!",
    timestamp: "1h ago",
    unread: 0,
    messages: [
      { id: "cx1", sender: "them", senderName: "Dr. Okonkwo", text: "Reminder: portfolio review session this Friday at 6pm. Bring your best work!", time: "8:00 AM", status: "read" },
      { id: "cx2", sender: "them", senderName: "Ifeanyi", text: "I'll be sharing my new case study — would love feedback on the user research section.", time: "8:15 AM", status: "read" },
      { id: "cx3", sender: "me", text: "Count me in! I have two projects I'd like to run by everyone.", time: "8:30 AM", status: "read" },
      { id: "cx4", sender: "them", senderName: "Dr. Okonkwo", text: "Portfolio review session this Friday at 6pm!", time: "9:00 AM", status: "read" },
    ],
    pinned: true,
  },
  /* ---- More directs ---- */
  {
    id: "4",
    type: "direct",
    user: { name: "Amara Obi", initials: "AO", role: "Student" },
    lastMessage: "Thanks for sharing the notes!",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      { id: "m9", sender: "me", text: "Here are the notes from last lecture.", time: "4:00 PM", status: "read" },
      { id: "m10", sender: "me", attachment: { type: "image", name: "whiteboard-scan.jpg" }, time: "4:01 PM", status: "read" },
      { id: "m11", sender: "them", text: "Thanks for sharing the notes!", time: "4:15 PM", status: "read" },
    ],
  },
  {
    id: "5",
    type: "direct",
    user: { name: "Prof. Adeyemi", initials: "PA", role: "Instructor" },
    lastMessage: "Midterm grades will be posted by Friday.",
    timestamp: "2d ago",
    unread: 0,
    messages: [
      { id: "m12", sender: "them", text: "Midterm grades will be posted by Friday.", time: "Mon 3:00 PM", status: "read" },
      { id: "m13", sender: "me", text: "Thanks for letting us know, Professor.", time: "Mon 3:30 PM", status: "delivered" },
    ],
  },
];

const searchableUsers = [
  { name: "Ade Okafor", initials: "AO", role: "Instructor" },
  { name: "Dr. Okonkwo", initials: "DO", role: "Instructor" },
  { name: "Prof. Adeyemi", initials: "PA", role: "Instructor" },
  { name: "Kelechi Nwosu", initials: "KN", role: "Student" },
  { name: "Amara Obi", initials: "AO", role: "Student" },
  { name: "Ifeanyi Okeke", initials: "IO", role: "Student" },
  { name: "Ngozi Eze", initials: "NE", role: "Parent" },
  { name: "Emeka Udoh", initials: "EU", role: "Admin" },
];

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const FILTER_OPTIONS: { key: FilterMode; label: string }[] = [
  { key: "all", label: "All" },
  { key: "messages", label: "Messages" },
  { key: "communities", label: "Communities" },
];

/* ---------------------------------------------------------------- */
/*  Helpers                                                         */
/* ---------------------------------------------------------------- */

function highlightMentions(text: string): React.ReactNode {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="text-primary font-medium">{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/* ---------------------------------------------------------------- */
/*  New Message Dialog                                              */
/* ---------------------------------------------------------------- */

function NewMessageDialog({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (user: ConversationUser) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchableUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-base">New Message</DialogTitle>
        </DialogHeader>
        <div className="px-4 pt-3 pb-1">
          <Input placeholder="Search by name or role..." value={query} onChange={(e) => setQuery(e.target.value)} className="rounded-full" autoFocus />
        </div>
        <div className="px-4 pb-4 pt-2 max-h-64 overflow-y-auto scrollbar-hide">
          {query.trim() === "" ? (
            <p className="text-xs text-muted-foreground text-center py-6">Type a name to find people</p>
          ) : results.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No one found matching &ldquo;{query}&rdquo;</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {results.map((u, i) => (
                <button
                  key={`${u.name}-${i}`}
                  type="button"
                  onClick={() => { onSelect(u); setQuery(""); onClose(); }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted transition-colors text-left"
                >
                  <Avatar className="size-9 shrink-0"><AvatarFallback>{u.initials}</AvatarFallback></Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------------------------- */
/*  Delete Confirmation Dialog                                      */
/* ---------------------------------------------------------------- */

function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" className="rounded-full" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" className="rounded-full" onClick={() => { onConfirm(); onClose(); }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------------------------- */
/*  Conversation List Item                                          */
/* ---------------------------------------------------------------- */

function ConversationItem({
  conversation,
  isActive,
  onClick,
  onPin,
  onMute,
  onDelete,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onPin: () => void;
  onMute: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isCommunity = conversation.type === "community";

  return (
    <>
      <div
        className={`group flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors w-full relative ${
          isActive ? "bg-muted" : "hover:bg-muted/50"
        }`}
      >
        <button type="button" onClick={onClick} className="flex items-start gap-3 flex-1 min-w-0">
          <div className="relative shrink-0">
            {isCommunity ? (
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon icon={UserGroupIcon} size={18} className="text-primary" />
              </div>
            ) : (
              <Avatar className="size-10">
                <AvatarFallback>{conversation.user!.initials}</AvatarFallback>
              </Avatar>
            )}
            {conversation.unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-primary border-2 border-background" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {conversation.pinned && <HugeiconsIcon icon={PinIcon} size={12} className="text-muted-foreground shrink-0" />}
                <p className={`text-sm truncate ${conversation.unread > 0 ? "font-semibold" : "font-medium"}`}>
                  {isCommunity ? conversation.communityName : conversation.user!.name}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">{conversation.timestamp}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {conversation.muted && <HugeiconsIcon icon={NotificationOff01Icon} size={11} className="text-muted-foreground shrink-0" />}
              {isCommunity && <span className="text-[10px] text-muted-foreground shrink-0">{conversation.memberCount} members</span>}
              {conversation.lastAttachment && <HugeiconsIcon icon={Attachment01Icon} size={12} className="text-muted-foreground shrink-0" />}
              {conversation.typing ? (
                <span className="text-xs text-primary font-medium animate-pulse">typing&hellip;</span>
              ) : (
                <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
              )}
            </div>
          </div>
        </button>

        {/* Context menu */}
        <Menu.Root open={menuOpen} onOpenChange={(open) => setMenuOpen(open)}>
          <Menu.Trigger className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 shrink-0 size-7 flex items-center justify-center rounded-lg hover:bg-muted-foreground/10 transition-all mt-0.5">
            <HugeiconsIcon icon={MoreHorizontalIcon} size={15} />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={4} align="end">
              <Menu.Popup className="min-w-[140px] rounded-xl border bg-popover p-1.5 shadow-lg origin-top-right">
                <Menu.Item className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-muted outline-none" onClick={onPin}>
                  <HugeiconsIcon icon={PinIcon} size={15} className="text-muted-foreground" />
                  {conversation.pinned ? "Unpin" : "Pin"}
                </Menu.Item>
                <Menu.Item className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-muted outline-none" onClick={onMute}>
                  <HugeiconsIcon icon={MuteIcon} size={15} className="text-muted-foreground" />
                  {conversation.muted ? "Unmute" : "Mute"}
                </Menu.Item>
                <Menu.Separator className="my-1 h-px bg-border" />
                <Menu.Item
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-destructive/10 text-destructive outline-none"
                  onClick={() => { setMenuOpen(false); setDeleteOpen(true); }}
                >
                  <HugeiconsIcon icon={Delete01Icon} size={15} />Delete
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete conversation"
        description={`This will permanently delete your conversation with ${isCommunity ? conversation.communityName : conversation.user!.name}. This action cannot be undone.`}
      />
    </>
  );
}

/* ---------------------------------------------------------------- */
/*  Read receipt icon                                               */
/* ---------------------------------------------------------------- */

function ReadReceipt({ status }: { status?: MessageStatus }) {
  if (!status) return null;
  if (status === "read")
    return <span className="inline-flex items-center ml-1.5 text-primary shrink-0"><HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} /></span>;
  if (status === "delivered")
    return <span className="inline-flex items-center ml-1.5 text-muted-foreground shrink-0"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} /></span>;
  return <span className="inline-flex items-center ml-1.5 text-muted-foreground/40 shrink-0"><HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} /></span>;
}

/* ---------------------------------------------------------------- */
/*  Reaction + actions picker                                       */
/* ---------------------------------------------------------------- */

function ReactionPicker({
  open,
  isOwn,
  onReact,
  onCopy,
  onDelete,
}: {
  open: boolean;
  isOwn: boolean;
  onReact: (emoji: string) => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute -top-10 left-0 flex items-center gap-0.5 bg-popover border rounded-full px-1.5 py-1 shadow-lg z-10 animate-in fade-in zoom-in-95 origin-bottom-left">
      {REACTIONS.map((emoji) => (
        <button key={emoji} type="button" onClick={(e) => { e.stopPropagation(); onReact(emoji); }} className="size-7 flex items-center justify-center rounded-full hover:bg-muted text-sm transition-colors">{emoji}</button>
      ))}
      <button type="button" onClick={(e) => { e.stopPropagation(); onCopy(); }} className="size-7 flex items-center justify-center rounded-full hover:bg-muted transition-colors ml-0.5">
        <HugeiconsIcon icon={Copy01Icon} size={13} className="text-muted-foreground" />
      </button>
      {isOwn && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(); }} className="size-7 flex items-center justify-center rounded-full hover:bg-destructive/10 transition-colors">
          <HugeiconsIcon icon={Delete01Icon} size={13} className="text-destructive" />
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  File helpers                                                     */
/* ---------------------------------------------------------------- */

function getFileExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toUpperCase() : "FILE";
}

const fileTypeColors: Record<string, string> = {
  PDF: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  DOC: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DOCX: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  XLS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  XLSX: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CSV: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  PPT: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  PPTX: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  ZIP: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  TXT: "bg-muted text-muted-foreground",
};

/* ---------------------------------------------------------------- */
/*  Attachment card                                                  */
/* ---------------------------------------------------------------- */

function AttachmentCard({
  attachment,
  isMe,
}: {
  attachment: Attachment;
  isMe: boolean;
}) {
  if (attachment.type === "image") {
    return (
      <div className="mb-2 rounded-xl overflow-hidden">
        {attachment.url ? (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-full max-h-60 object-cover rounded-xl"
          />
        ) : (
          <div className="aspect-video bg-gradient-to-br from-muted/80 via-muted/40 to-muted/80 flex items-center justify-center rounded-xl">
            <div className="flex flex-col items-center gap-1.5">
              <HugeiconsIcon icon={Image01Icon} size={28} className="text-muted-foreground/50" />
              <span className="text-[10px] text-muted-foreground/60 max-w-[180px] truncate px-3 text-center">
                {attachment.name}
              </span>
              {attachment.size && (
                <span className="text-[10px] text-muted-foreground/40">{attachment.size}</span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* File attachment */
  const ext = getFileExtension(attachment.name);
  const extColor = fileTypeColors[ext] ?? fileTypeColors.TXT;

  return (
    <div className={`mb-2 rounded-xl overflow-hidden ${isMe ? "bg-primary-foreground/10" : "bg-background/60"}`}>
      <div className="flex items-center gap-3 px-3 py-3">
        <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold tracking-tight ${extColor}`}>
          {ext.slice(0, 3)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium truncate">{attachment.name}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {attachment.size ? `${ext} · ${attachment.size}` : ext}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Message bubble                                                  */
/* ---------------------------------------------------------------- */

function MessageBubble({
  msg,
  isCommunity,
  onReact,
  onDeleteMsg,
}: {
  msg: Message;
  isCommunity: boolean;
  onReact: (emoji: string) => void;
  onDeleteMsg: () => void;
}) {
  const isMe = msg.sender === "me";
  const isSystem = msg.isSystem;

  /* ---- System message ---- */
  if (isSystem) {
    return (
      <div className="flex justify-center py-1">
        <span className="text-[11px] text-muted-foreground bg-muted/50 rounded-full px-3 py-1">{msg.text}</span>
      </div>
    );
  }

  /* ---- Normal message ---- */
  const [showPicker, setShowPicker] = useState(false);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = () => { longPressRef.current = setTimeout(() => setShowPicker(true), 500); };
  const handlePointerUp = () => { if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; } };
  const handleContextMenu = (e: React.MouseEvent) => { e.preventDefault(); setShowPicker((prev) => !prev); };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 max-w-[85%] sm:max-w-[65%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        {/* Sender avatar (community only, others' messages) */}
        {isCommunity && !isMe && (
          <Avatar className="size-7 shrink-0 mt-1">
            <AvatarFallback className="text-[10px]">{msg.senderName?.charAt(0) ?? "?"}</AvatarFallback>
          </Avatar>
        )}

        <div className="min-w-0">
          {/* Sender name (community only) */}
          {isCommunity && !isMe && msg.senderName && (
            <p className="text-[11px] font-medium text-muted-foreground mb-0.5 ml-1">{msg.senderName}</p>
          )}

          <div
            className={`relative rounded-2xl px-4 py-2.5 select-none ${
              isMe
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            }`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onContextMenu={handleContextMenu}
          >
            <ReactionPicker
              open={showPicker}
              isOwn={isMe}
              onReact={(emoji) => { setShowPicker(false); onReact(emoji); }}
              onCopy={() => { setShowPicker(false); if (msg.text) navigator.clipboard.writeText(msg.text).catch(() => {}); }}
              onDelete={() => { setShowPicker(false); onDeleteMsg(); }}
            />

            {/* Attachment */}
            {msg.attachment && (
              <AttachmentCard attachment={msg.attachment} isMe={isMe} />
            )}

            {/* Text */}
            {msg.text && <p className="text-sm leading-relaxed select-text break-words whitespace-pre-wrap">{isCommunity ? highlightMentions(msg.text) : msg.text}</p>}

            {/* Time + Read receipt */}
            <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
              <p className={`text-[10px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
              {isMe && <ReadReceipt status={msg.status} />}
            </div>

            {/* Reaction badge */}
            {msg.reaction && (
              <span className={`absolute -bottom-2 ${isMe ? "-left-2" : "-right-2"} text-xs bg-popover border rounded-full px-2 py-0.5 shadow-sm`}>{msg.reaction}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Typing indicator                                                */
/* ---------------------------------------------------------------- */

function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
            ))}
          </span>
          <span className="text-xs text-muted-foreground">{name} is typing</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Attachment menu                                                 */
/* ---------------------------------------------------------------- */

function AttachmentMenu({ onSelect }: { onSelect: (type: "camera" | "gallery" | "document") => void }) {
  return (
    <Menu.Root>
      <Menu.Trigger className="size-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors shrink-0">
        <HugeiconsIcon icon={Attachment01Icon} size={18} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="top" align="start" sideOffset={8}>
          <Menu.Popup className="min-w-[180px] rounded-xl border bg-popover p-1.5 shadow-lg origin-bottom-left">
            <Menu.Item className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer hover:bg-muted outline-none" onClick={() => onSelect("camera")}>
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><HugeiconsIcon icon={Camera01Icon} size={16} className="text-muted-foreground" /></div>
              Camera
            </Menu.Item>
            <Menu.Item className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer hover:bg-muted outline-none" onClick={() => onSelect("gallery")}>
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><HugeiconsIcon icon={Image01Icon} size={16} className="text-muted-foreground" /></div>
              Photo Library
            </Menu.Item>
            <Menu.Item className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer hover:bg-muted outline-none" onClick={() => onSelect("document")}>
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0"><HugeiconsIcon icon={Folder01Icon} size={16} className="text-muted-foreground" /></div>
              Document
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

/* ---------------------------------------------------------------- */
/*  Chat View                                                       */
/* ---------------------------------------------------------------- */

function ChatView({
  conversation,
  onBack,
  onUpdateMessages,
}: {
  conversation: Conversation;
  onBack?: () => void;
  onUpdateMessages: (fn: (prev: Message[]) => Message[]) => void;
}) {
  const [newMessage, setNewMessage] = useState("");
  const [msgs, setMsgs] = useState(conversation.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileAccept, setFileAccept] = useState("image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx");
  const [deleteMsgOpen, setDeleteMsgOpen] = useState<string | null>(null);
  const isCommunity = conversation.type === "community";

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const addMessage = useCallback((msg: Message) => {
    setMsgs((prev) => [...prev, msg]);
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSendText = useCallback(() => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      sender: "me",
      senderName: isCommunity ? "You" : undefined,
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };
    addMessage(msg);
    setNewMessage("");
    setTimeout(() => {
      setMsgs((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status: "delivered" as MessageStatus } : m)));
    }, 1200);
  }, [newMessage, addMessage, isCommunity]);

  const handleAttachmentSelect = useCallback((type: "camera" | "gallery" | "document") => {
    if (type === "camera") setFileAccept("image/*;capture=camera");
    else if (type === "gallery") setFileAccept("image/*");
    else setFileAccept(".pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx,.zip");
    setTimeout(() => fileInputRef.current?.click(), 100);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const attachment: Attachment = {
      type: isImage ? "image" : "file",
      name: file.name,
      size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
      url: isImage ? URL.createObjectURL(file) : undefined,
    };
    addMessage({
      id: `m${Date.now()}`,
      sender: "me",
      senderName: isCommunity ? "You" : undefined,
      attachment,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [addMessage, isCommunity]);

  const handleReact = useCallback((msgId: string, emoji: string) => {
    setMsgs((prev) => prev.map((m) => (m.id === msgId ? { ...m, reaction: m.reaction ? "" : emoji } : m)));
  }, []);

  const handleDeleteMsg = useCallback((msgId: string) => {
    setMsgs((prev) => prev.filter((m) => m.id !== msgId));
  }, []);

  const headerTitle = isCommunity ? conversation.communityName! : conversation.user!.name;
  const headerSub = isCommunity ? `${conversation.memberCount} members` : conversation.user!.role;

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
        {onBack && (
          <button type="button" onClick={onBack} className="size-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors shrink-0 sm:hidden">
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
          </button>
        )}
        {isCommunity ? (
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={UserGroupIcon} size={18} className="text-primary" />
          </div>
        ) : (
          <Avatar className="size-9 shrink-0"><AvatarFallback>{conversation.user!.initials}</AvatarFallback></Avatar>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{headerTitle}</p>
          <p className="text-xs text-muted-foreground">{headerSub}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 flex flex-col gap-2 min-h-0">
        {msgs.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isCommunity={isCommunity}
            onReact={(emoji) => handleReact(msg.id, emoji)}
            onDeleteMsg={() => setDeleteMsgOpen(msg.id)}
          />
        ))}
        {conversation.typing && <TypingIndicator name={headerTitle.split(" ")[0]} />}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t shrink-0">
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept={fileAccept} />
          <AttachmentMenu onSelect={handleAttachmentSelect} />
          <Input
            placeholder={isCommunity ? "Message the community..." : "Type a message..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(); } }}
            className="flex-1 rounded-full"
          />
          <Button size="icon" className="size-9 rounded-full shrink-0" onClick={handleSendText} disabled={!newMessage.trim()}>
            <HugeiconsIcon icon={ArrowUp01Icon} size={18} />
          </Button>
        </div>
      </div>

      {/* Delete message confirmation */}
      <DeleteConfirmDialog
        open={deleteMsgOpen !== null}
        onClose={() => setDeleteMsgOpen(null)}
        onConfirm={() => { if (deleteMsgOpen) handleDeleteMsg(deleteMsgOpen); setDeleteMsgOpen(null); }}
        title="Delete message"
        description="This message will be permanently deleted. This action cannot be undone."
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Messages Page                                                   */
/* ---------------------------------------------------------------- */

function MessagesPage() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "student";

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "chat">("list");
  const [newMsgOpen, setNewMsgOpen] = useState(false);
  const [filter, setFilter] = useState<FilterMode>("all");

  const filteredConversations = useMemo(() => {
    let list = [...conversations];
    if (filter === "messages") list = list.filter((c) => c.type === "direct");
    if (filter === "communities") list = list.filter((c) => c.type === "community");
    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return 0;
    });
    return list;
  }, [conversations, filter]);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const openConversation = useCallback((id: string) => { setActiveId(id); setViewMode("chat"); }, []);
  const handleBack = useCallback(() => { setViewMode("list"); }, []);

  const handlePin = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  }, []);

  const handleMute = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, muted: !c.muted } : c)));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) { setActiveId(null); setViewMode("list"); }
  }, [activeId]);

  const handleNewConversation = useCallback((user: ConversationUser) => {
    const existing = conversations.find((c) => c.type === "direct" && c.user?.name === user.name);
    if (existing) { openConversation(existing.id); return; }
    const newConv: Conversation = {
      id: `new-${Date.now()}`, type: "direct", user, lastMessage: "Start a conversation",
      timestamp: "Now", unread: 0, messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    openConversation(newConv.id);
  }, [conversations, openConversation]);

  const handleUpdateMessages = useCallback((id: string, fn: (prev: Message[]) => Message[]) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, messages: fn(c.messages) } : c)));
  }, []);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <DashboardLayout role={role}>
      <div className="h-[calc(100vh-6rem)] flex rounded-2xl border bg-card overflow-hidden -mx-1 sm:mx-0">
        {/* ---- Conversation List Panel ---- */}
        <div className={`shrink-0 w-full sm:w-80 border-r flex flex-col ${viewMode === "chat" ? "hidden sm:flex" : "flex"}`}>
          {/* Header */}
          <div className="px-4 py-3 border-b shrink-0 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Messages</h2>
                {totalUnread > 0 && <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0 h-5">{totalUnread}</Badge>}
              </div>
              <Button size="icon" variant="ghost" className="size-8 rounded-full" onClick={() => setNewMsgOpen(true)}>
                <HugeiconsIcon icon={MessageAdd01Icon} size={18} />
              </Button>
            </div>
            {/* Filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
              <div className="flex items-center gap-1 w-max">
                {FILTER_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    className={`text-[11px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                      filter === key ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2 min-h-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-4">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                  <HugeiconsIcon icon={Message01Icon} size={22} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {filter === "communities" ? "No community chats yet" : filter === "messages" ? "No direct messages yet" : "No messages yet"}
                </p>
                {filter !== "communities" && (
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setNewMsgOpen(true)}
                    render={<span><HugeiconsIcon icon={MessageAdd01Icon} size={14} className="mr-1.5 inline" />New Message</span>}
                  />
                )}
              </div>
            ) : (
              filteredConversations.map((c) => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  isActive={activeId === c.id}
                  onClick={() => openConversation(c.id)}
                  onPin={() => handlePin(c.id)}
                  onMute={() => handleMute(c.id)}
                  onDelete={() => handleDelete(c.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* ---- Chat Panel ---- */}
        <div className={`flex-1 flex flex-col min-w-0 ${viewMode === "list" ? "hidden sm:flex" : "flex"}`}>
          {activeConversation ? (
            <ChatView
              key={activeConversation.id}
              conversation={activeConversation}
              onBack={handleBack}
              onUpdateMessages={(fn) => handleUpdateMessages(activeConversation.id, fn)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-6">
              <div className="size-16 rounded-full bg-muted flex items-center justify-center">
                <HugeiconsIcon icon={Message01Icon} size={28} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Your Messages</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">Select a conversation or start a new one to begin messaging</p>
              </div>
              <Button variant="outline" className="rounded-full" onClick={() => setNewMsgOpen(true)}
                render={<span><HugeiconsIcon icon={MessageAdd01Icon} size={15} className="mr-1.5 inline" />New Message</span>}
              />
            </div>
          )}
        </div>
      </div>

      <NewMessageDialog open={newMsgOpen} onClose={() => setNewMsgOpen(false)} onSelect={handleNewConversation} />
    </DashboardLayout>
  );
}

/* ---------------------------------------------------------------- */
/*  Page export                                                     */
/* ---------------------------------------------------------------- */

export default function MessagesPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-6rem)] flex rounded-2xl border bg-card overflow-hidden">
          <div className="w-80 border-r p-4 flex flex-col gap-3">
            <Skeleton className="h-10 w-full rounded-full" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-40" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1" />
        </div>
      }
    >
      <MessagesPage />
    </Suspense>
  );
}
