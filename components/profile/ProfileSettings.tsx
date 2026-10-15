"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toggleAcceptFeedbackAction, updateProfileAction } from "@/actions/profile";
import { changePasswordAction } from "@/actions/settings";
import { Check, Loader2, ShieldCheck, Lock, BellRing } from "lucide-react";

interface ProfileSettingsProps {
  user: {
    username: string;
    email: string;
    isAcceptingFeedback: boolean;
    profileImage?: string;
  };
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isAccepting, setIsAccepting] = useState(user.isAcceptingFeedback);
  const [isTogglingFeedback, setIsTogglingFeedback] = useState(false);
  const [toggleStatusMsg, setToggleStatusMsg] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const handleToggleAccept = async () => {
    setIsTogglingFeedback(true);
    setToggleStatusMsg(null);
    try {
      const res = await toggleAcceptFeedbackAction();
      if (res.success && res.isAcceptingFeedback !== undefined) {
        setIsAccepting(res.isAcceptingFeedback);
        setToggleStatusMsg(res.message || null);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsTogglingFeedback(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPass(true);
    setPassMsg(null);
    setPassError(null);

    try {
      const res = await changePasswordAction({ currentPassword, newPassword });
      if (!res.success) {
        setPassError(res.error || "Failed to change password");
      } else {
        setPassMsg("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (e: any) {
      setPassError(e.message || "Failed to update password");
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Account Info */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Profile Details
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Your public handle and verified email
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-zinc-500">Username</label>
            <Input value={user.username} disabled className="mt-1 bg-zinc-50 dark:bg-zinc-800/50" />
            <p className="text-[11px] text-zinc-400 mt-1">Your public URL: /feedback/{user.username}</p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-zinc-500">Verified Email</label>
            <Input value={user.email} disabled className="mt-1 bg-zinc-50 dark:bg-zinc-800/50" />
          </div>
        </div>
      </div>

      {/* Global Feedback Switch */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-blue-500" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Accepting Feedback
              </h3>
            </div>
            <p className="text-xs text-zinc-500 max-w-md">
              When turned off, all public feedback links for your profile will temporarily display a paused notice.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAccept}
            disabled={isTogglingFeedback}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isAccepting ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isAccepting ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {toggleStatusMsg && (
          <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check className="h-3.5 w-3.5" />
            {toggleStatusMsg}
          </p>
        )}
      </div>

      {/* Change Password */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-4 w-4 text-zinc-500" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Security & Password
          </h3>
        </div>
        <p className="text-xs text-zinc-500 mb-5">
          Keep your account secure by updating your password periodically
        </p>

        {passError && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {passError}
          </div>
        )}

        {passMsg && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {passMsg}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-zinc-500">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-zinc-500">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="mt-1"
            />
          </div>

          <Button type="submit" disabled={isChangingPass} className="mt-2 rounded-xl">
            {isChangingPass ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
