import React from "react";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | UNSAID",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(session.user.id).select(
    "username email isAcceptingFeedback profileImage"
  );

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profile Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your account preferences and global feedback status
        </p>
      </div>

      <ProfileSettings
        user={{
          username: user.username,
          email: user.email,
          isAcceptingFeedback: user.isAcceptingFeedback,
          profileImage: user.profileImage,
        }}
      />
    </div>
  );
}
