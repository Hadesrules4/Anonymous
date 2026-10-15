"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import Feedback from "@/models/Feedback";
import FeedbackRequest from "@/models/FeedbackRequest";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/helpers/generateSlug";
import {
  createFeedbackRequestSchema,
  submitFeedbackSchema,
} from "@/lib/validations/feedback";
import { revalidatePath } from "next/cache";

export async function createFeedbackRequestAction(input: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const parsed = createFeedbackRequestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { title, question, category } = parsed.data;

    await connectDB();

    const slug = generateSlug(title);

    const newRequest = await FeedbackRequest.create({
      ownerId: session.user.id,
      title,
      question,
      category,
      slug,
      isActive: true,
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Feedback request created successfully!",
      request: {
        id: newRequest._id.toString(),
        title: newRequest.title,
        slug: newRequest.slug,
        category: newRequest.category,
      },
    };
  } catch (error: any) {
    console.error("Create feedback request error:", error);
    return {
      success: false,
      error: error.message || "Failed to create feedback request",
    };
  }
}

export async function toggleFeedbackRequestAction(requestId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const req = await FeedbackRequest.findOne({
      _id: requestId,
      ownerId: session.user.id,
    });

    if (!req) {
      return { success: false, error: "Feedback request not found" };
    }

    req.isActive = !req.isActive;
    await req.save();

    revalidatePath("/dashboard");

    return {
      success: true,
      isActive: req.isActive,
      message: req.isActive ? "Request activated" : "Request deactivated",
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle request" };
  }
}

export async function deleteFeedbackRequestAction(requestId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const deleted = await FeedbackRequest.findOneAndDelete({
      _id: requestId,
      ownerId: session.user.id,
    });

    if (!deleted) {
      return { success: false, error: "Feedback request not found" };
    }

    revalidatePath("/dashboard");

    return { success: true, message: "Feedback request removed" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete request" };
  }
}

export async function submitAnonymousFeedbackAction(input: unknown) {
  try {
    const parsed = submitFeedbackSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid feedback data",
      };
    }

    const { recipientUsername, requestSlug, message, category } = parsed.data;

    await connectDB();

    const recipient = await User.findOne({
      username: recipientUsername.toLowerCase().trim(),
    });

    if (!recipient) {
      return { success: false, error: "Recipient user does not exist" };
    }

    if (!recipient.isAcceptingFeedback) {
      return {
        success: false,
        error: "This user is currently not accepting new feedback.",
      };
    }

    let requestId: string | null = null;
    let feedbackCategory = category || "General";

    if (requestSlug) {
      const targetRequest = await FeedbackRequest.findOne({
        ownerId: recipient._id,
        slug: requestSlug.toLowerCase().trim(),
      });

      if (!targetRequest) {
        return { success: false, error: "This feedback request does not exist" };
      }

      if (!targetRequest.isActive) {
        return {
          success: false,
          error: "This feedback request is currently inactive.",
        };
      }

      requestId = targetRequest._id.toString();
      feedbackCategory = targetRequest.category || feedbackCategory;
    }

    // Notice what's missing: senderId. That's intentional.
    // The database shouldn't store the sender's account identity if the product promises anonymity.
    await Feedback.create({
      recipientId: recipient._id,
      requestId: requestId || null,
      message: message.trim(),
      category: feedbackCategory,
      isRead: false,
      isDeleted: false,
    });

    return {
      success: true,
      message: "Your anonymous feedback has been safely submitted!",
    };
  } catch (error: any) {
    console.error("Submit anonymous feedback error:", error);
    return {
      success: false,
      error: error.message || "Failed to submit feedback",
    };
  }
}

export async function markFeedbackReadAction(feedbackId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const item = await Feedback.findOne({
      _id: feedbackId,
      recipientId: session.user.id,
    });

    if (!item) {
      return { success: false, error: "Feedback not found" };
    }

    item.isRead = true;
    await item.save();

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/feedback");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFeedbackAction(feedbackId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();
    const deleted = await Feedback.findOneAndDelete({
      _id: feedbackId,
      recipientId: session.user.id,
    });

    if (!deleted) {
      return { success: false, error: "Feedback not found" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/feedback");

    return { success: true, message: "Feedback deleted" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
