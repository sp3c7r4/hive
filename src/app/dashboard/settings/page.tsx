"use client";

import { Suspense, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  Camera01Icon,
  LockIcon,
  BellIcon,
  ComputerIcon,
  Delete01Icon,
  Link03Icon,
} from "@hugeicons/core-free-icons";
import { LinkedAccounts } from "@/components/settings/LinkedAccounts";

type Role = "instructor" | "student" | "parent" | "admin";

/* ---------------------------------------------------------------- */
/*  Delete Account Modal                                             */
/* ---------------------------------------------------------------- */

function DeleteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [confirm, setConfirm] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete your account</DialogTitle>
          <DialogDescription>
            This is permanent. Your data will be removed after 30 days, in
            compliance with Nigerian data protection law. You can recover your
            account within that window by contacting support.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="delete-confirm">
              Type <span className="font-semibold">delete my account</span> to
              confirm
            </Label>
            <Input
              id="delete-confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="delete my account"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={confirm !== "delete my account"}
          >
            Delete my account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------------------------- */
/*  Settings Page                                                    */
/* ---------------------------------------------------------------- */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) || "student";

  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifWhatsapp, setNotifWhatsapp] = useState(false);
  const [notifPush, setNotifPush] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const sessions = [
    {
      device: "Chrome on Windows",
      ip: "102.89.xx.xx — Lagos, NG",
      lastActive: "2 minutes ago",
      current: true,
    },
    {
      device: "Safari on iPhone",
      ip: "102.89.xx.xx — Abuja, NG",
      lastActive: "3 hours ago",
    },
  ];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ---- Profile ---- */}
        <Section
          title="Profile"
          icon={<HugeiconsIcon icon={Camera01Icon} size={18} />}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="flex flex-col items-center gap-2">
              <div className="relative size-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {photo ? (
                  <Image
                    src={photo}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={Camera01Icon}
                    size={24}
                    className="text-muted-foreground"
                  />
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs text-primary font-medium hover:underline"
              >
                {photo ? "Change photo" : "Add photo"}
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Full name</Label>
                <Input defaultValue="Chioma Nwosu" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Email</Label>
                <Input defaultValue="chioma@hive.ng" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label className="text-xs">Bio</Label>
                <Textarea
                  rows={3}
                  placeholder="Tell us a bit about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Phone</Label>
                <Input
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button size="sm" className="rounded-full">
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ---- Security ---- */}
        <Section
          title="Security"
          icon={<HugeiconsIcon icon={LockIcon} size={18} />}
        >
          <p className="text-xs text-muted-foreground mb-4">Change password</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Current password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">New password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Confirm new password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button size="sm" className="rounded-full">
              Update password
            </Button>
          </div>

          <Separator className="my-5" />

          <p className="text-xs text-muted-foreground mb-3">
            Active sessions
          </p>

          <div className="flex flex-col gap-2">
            {sessions.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-background flex items-center justify-center shrink-0">
                    <HugeiconsIcon
                      icon={ComputerIcon}
                      size={16}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {s.device}
                      {s.current && (
                        <span className="ml-2 text-[10px] text-emerald-600 font-medium">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.ip} · {s.lastActive}
                    </p>
                  </div>
                </div>
                {!s.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground h-auto py-1 rounded-lg"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Button variant="ghost" size="sm" className="text-xs rounded-full">
              Revoke all other sessions
            </Button>
          </div>
        </Section>

        {/* ---- Notifications ---- */}
        <Section
          title="Notifications"
          icon={<HugeiconsIcon icon={BellIcon} size={18} />}
        >
          <div className="flex flex-col gap-4">
            {(
              [
                ["Email", notifEmail, setNotifEmail] as const,
                ["SMS", notifSms, setNotifSms] as const,
                ["WhatsApp", notifWhatsapp, setNotifWhatsapp] as const,
                ["Push", notifPush, setNotifPush] as const,
              ] satisfies readonly [string, boolean, (v: boolean) => void][]
            ).map(([label, value, setter]) => (
              <div
                key={label}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{label}</span>
                <Switch
                  checked={value}
                  onCheckedChange={setter}
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button size="sm" className="rounded-full">
              Save preferences
            </Button>
          </div>
        </Section>

        {/* ---- Linked Accounts ---- */}
        <Section
          title="Linked Accounts"
          icon={<HugeiconsIcon icon={Link03Icon} size={18} />}
        >
          <LinkedAccounts role={role} />
        </Section>

        {/* ---- Danger Zone ---- */}
        <Section
          title="Danger zone"
          icon={<HugeiconsIcon icon={Delete01Icon} size={18} />}
        >
          <p className="text-xs text-muted-foreground mb-3">
            Permanently delete your account. This action cannot be undone. Your
            data will be retained for 30 days before full removal, per Nigerian
            data protection regulations.
          </p>

          <Button
            variant="destructive"
            size="sm"
            className="rounded-full"
            onClick={() => setDeleteOpen(true)}
          >
            Delete my account
          </Button>

          <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} />
        </Section>
      </div>
    </DashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
