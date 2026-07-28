"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SentIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import type { Comment } from "./types";

interface CommentThreadProps {
  comments: Comment[];
  currentUser: { name: string; initials: string };
  onAddReply: (parentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function CommentItem({
  comment,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  depth,
}: {
  comment: Comment;
  currentUser: { name: string; initials: string };
  onReply: (parentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  depth: number;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwn = comment.author.name === currentUser.name;

  const handleReply = useCallback(() => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText.trim());
    setReplyText("");
    setReplying(false);
  }, [replyText, comment.id, onReply]);

  const handleEdit = useCallback(() => {
    if (!editText.trim()) return;
    onEdit(comment.id, editText.trim());
    setEditing(false);
  }, [editText, comment.id, onEdit]);

  return (
    <div
      className={`flex gap-2.5 ${depth > 0 ? "ml-9 pl-4 border-l-2 border-muted" : ""}`}
    >
      <Avatar className="size-7 shrink-0 mt-0.5">
        <AvatarFallback className="text-[10px]">
          {comment.author.initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold">
            {comment.author.name}
          </span>
          {comment.isInstructorReply && (
            <Badge className="rounded-full text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary">
              Instructor
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground">
            {timeAgo(comment.createdAt)}
          </span>
          {comment.editedAt && (
            <span className="text-[10px] text-muted-foreground italic">
              (edited)
            </span>
          )}
        </div>

        {editing ? (
          <div className="mt-1.5 space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-[60px] text-xs resize-y"
            />
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                onClick={handleEdit}
                className="rounded-full h-7 text-[10px]"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(false)}
                className="rounded-full h-7 text-[10px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm leading-relaxed mt-0.5 break-words">
            {comment.content}
          </p>
        )}

        {!editing && (
          <div className="flex items-center gap-1 mt-1.5">
            {depth < 1 && (
              <button
                type="button"
                onClick={() => setReplying(!replying)}
                className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Reply
              </button>
            )}
            {isOwn && (
              <>
                <span className="text-[10px] text-muted-foreground">·</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={11} />
                </button>
                {menuOpen && (
                  <div className="absolute mt-6 bg-popover border rounded-lg shadow-lg py-1 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setEditText(comment.content);
                        setEditing(true);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(comment.id);
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted text-destructive"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {replying && (
          <div className="mt-2 space-y-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleReply();
              }}
              placeholder="Write a reply..."
              className="min-h-[56px] text-xs resize-y"
              autoFocus
            />
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="rounded-full h-7 text-[10px]"
              >
                <HugeiconsIcon icon={SentIcon} size={11} className="mr-1" />
                Reply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplying(false)}
                className="rounded-full h-7 text-[10px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentThread({
  comments,
  currentUser,
  onAddReply,
  onEdit,
  onDelete,
}: CommentThreadProps) {
  const topLevel = comments.filter((c) => !c.parentId);
  const replies = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId);

  if (!comments.length) return null;

  return (
    <div className="space-y-3 mt-2">
      {topLevel.map((comment) => (
        <div key={comment.id} className="space-y-3">
          <CommentItem
            comment={comment}
            currentUser={currentUser}
            onReply={onAddReply}
            onEdit={onEdit}
            onDelete={onDelete}
            depth={0}
          />
          {replies(comment.id).map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onReply={onAddReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
