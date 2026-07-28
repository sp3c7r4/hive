"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Image01Icon,
  Attachment01Icon,
  Cancel01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import type { Post } from "./types";

interface PostComposerProps {
  author: { name: string; initials: string; avatar?: string };
  onSubmit: (post: Post) => void;
}

export function PostComposer({ author, onSubmit }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author,
      content: content.trim(),
      attachments: attachments.length ? attachments : undefined,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByUser: false,
      commentCount: 0,
    };
    onSubmit(newPost);
    setContent("");
    setAttachments([]);
    setExpanded(false);
  }, [content, attachments, author, onSubmit]);

  const handleFilePick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;
      setAttachments((prev) => [
        ...prev,
        ...Array.from(files).map((f) => f.name),
      ]);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
    },
    [handleSubmit]
  );

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-border hover:border-muted-foreground/30 hover:bg-muted/20 transition-colors text-sm text-muted-foreground"
      >
        Share something with the community...
      </button>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Share something with the community..."
        className="min-h-[80px] text-sm resize-y border-0 p-0 focus-visible:ring-0 shadow-none"
        autoFocus
      />

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-[11px]"
            >
              <HugeiconsIcon icon={Attachment01Icon} size={11} className="text-muted-foreground" />
              {name}
              <button
                type="button"
                onClick={() =>
                  setAttachments((prev) => prev.filter((n) => n !== name))
                }
                className="text-muted-foreground hover:text-destructive"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={handleFilePick}
            className="hidden"
            accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.zip"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileRef.current?.click()}
            className="rounded-full h-8 text-xs text-muted-foreground"
          >
            <HugeiconsIcon icon={Image01Icon} size={14} className="mr-1" />
            Attach
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setContent("");
              setAttachments([]);
              setExpanded(false);
            }}
            className="rounded-full h-8 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="rounded-full h-8 text-xs"
          >
            <HugeiconsIcon icon={SentIcon} size={13} className="mr-1" />
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
