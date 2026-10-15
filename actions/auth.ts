"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import bcrypt from "bcryptjs";
import { generateOtp } from "@/lib/helpers/generateOtp";
import { sendVerificationEmail } from "@/lib/resend";
import { signupSchema, verifyEmailSchema } from "@/lib/validations/auth";

export async function signupUser(input: unknown) {
  try {
    const parsed = signupSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { username, email, password } = parsed.data;

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check if username is taken
    const existingUserByUsername = await User.findOne({
      username: normalizedUsername,
    });
    if (existingUserByUsername) {
      return {
        success: false,
        error: "This username is already taken. Please choose another.",
      };
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email: normalizedEmail });

    const hashedPassword = await bcrypt.hash(password, 12);
    let userId: string;

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return {
          success: false,
          error: "An account with this email already exists. Please log in.",
        };
      } else {
        // User registered but never verified; update password and username
        existingUserByEmail.username = normalizedUsername;
        existingUserByEmail.password = hashedPassword;
        await existingUserByEmail.save();
        userId = existingUserByEmail._id.toString();
        // Clear previous verification codes
        await VerificationCode.deleteMany({ userId: existingUserByEmail._id });
      }
    } else {
      const newUser = await User.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
        isAcceptingFeedback: true,
      });
      userId = newUser._id.toString();
    }

    // Generate 6-digit OTP
    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await VerificationCode.create({
      userId,
      code: otp,
      expiresAt,
    });

    // Send email
    const emailResult = await sendVerificationEmail({
      email: normalizedEmail,
      username: normalizedUsername,
      code: otp,
    });

    if (!emailResult.success) {
      console.warn("Failed to dispatch email via provider, OTP logged to console:", otp);
    }

    return {
      success: true,
      message: "Account created! A 6-digit verification code has been sent to your email.",
      email: normalizedEmail,
    };
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during signup.",
    };
  }
}

export async function verifyEmailCode(input: unknown) {
  try {
    const parsed = verifyEmailSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid code or email format",
      };
    }

    const { email, code } = parsed.data;
    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.isVerified) {
      return { success: true, message: "Account is already verified. Please log in." };
    }

    const verificationRecord = await VerificationCode.findOne({
      userId: user._id,
      code: code.trim(),
    }).sort({ createdAt: -1 });

    if (!verificationRecord) {
      return { success: false, error: "Invalid verification code" };
    }

    if (new Date() > verificationRecord.expiresAt) {
      return {
        success: false,
        error: "Verification code has expired. Please request a new one.",
      };
    }

    // Verify user and cleanup verification records
    user.isVerified = true;
    await user.save();
    await VerificationCode.deleteMany({ userId: user._id });

    return {
      success: true,
      message: "Email successfully verified! You can now log in.",
    };
  } catch (error: any) {
    console.error("Verification error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during verification.",
    };
  }
}

export async function resendVerificationCode(email: string) {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please provide a valid email" };
    }

    await connectDB();
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return { success: false, error: "No account found with this email" };
    }

    if (user.isVerified) {
      return { success: false, error: "Account is already verified. Please log in." };
    }

    // Clean up old codes
    await VerificationCode.deleteMany({ userId: user._id });

    // Generate new code
    const otp = generateOtp(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationCode.create({
      userId: user._id,
      code: otp,
      expiresAt,
    });

    await sendVerificationEmail({
      email: user.email,
      username: user.username,
      code: otp,
    });

    return {
      success: true,
      message: "A new 6-digit verification code has been sent to your email.",
    };
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return {
      success: false,
      error: error.message || "Failed to resend code.",
    };
  }
}
