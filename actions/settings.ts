"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "@/lib/validations/profile";

export async function changePasswordAction(input: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = changePasswordSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input",
      };
    }

    const { currentPassword, newPassword } = parsed.data;

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: "Current password does not match" };
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return { success: true, message: "Password successfully changed" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to change password" };
  }
}
