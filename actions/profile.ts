"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleAcceptFeedbackAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.isAcceptingFeedback = !user.isAcceptingFeedback;
    await user.save();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");

    return {
      success: true,
      isAcceptingFeedback: user.isAcceptingFeedback,
      message: user.isAcceptingFeedback
        ? "Now accepting anonymous feedback"
        : "Feedback acceptance paused",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProfileAction(data: { profileImage?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (data.profileImage !== undefined) {
      user.profileImage = data.profileImage;
    }
    await user.save();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return { success: true, message: "Profile updated successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
