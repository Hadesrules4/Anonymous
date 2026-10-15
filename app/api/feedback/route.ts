import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Feedback from "@/models/Feedback";
import User from "@/models/User";
import FeedbackRequest from "@/models/FeedbackRequest";
import { auth } from "@/lib/auth";
import { submitFeedbackSchema } from "@/lib/validations/feedback";

// Rate limiting in-memory map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const feedbacks = await Feedback.find({
      recipientId: session.user.id,
      isDeleted: false,
    })
      .populate("requestId", "title slug category")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      feedbacks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Basic IP rate limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    if (isRateLimited(ip, 10, 60000)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a minute before sending more feedback.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = submitFeedbackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Invalid feedback data",
        },
        { status: 400 }
      );
    }

    const { recipientUsername, requestSlug, message, category } = parsed.data;

    await connectDB();

    const recipient = await User.findOne({
      username: recipientUsername.toLowerCase().trim(),
    });

    if (!recipient) {
      return NextResponse.json(
        { success: false, error: "Recipient user does not exist" },
        { status: 404 }
      );
    }

    if (!recipient.isAcceptingFeedback) {
      return NextResponse.json(
        {
          success: false,
          error: "This user is currently not accepting new feedback.",
        },
        { status: 403 }
      );
    }

    let requestId: string | null = null;
    let feedbackCategory = category || "General";

    if (requestSlug) {
      const targetRequest = await FeedbackRequest.findOne({
        ownerId: recipient._id,
        slug: requestSlug.toLowerCase().trim(),
      });

      if (!targetRequest) {
        return NextResponse.json(
          { success: false, error: "This feedback request does not exist" },
          { status: 404 }
        );
      }

      if (!targetRequest.isActive) {
        return NextResponse.json(
          { success: false, error: "This feedback request is currently inactive." },
          { status: 403 }
        );
      }

      requestId = targetRequest._id.toString();
      feedbackCategory = targetRequest.category || feedbackCategory;
    }

    // Anonymous submission: senderId is intentionally NEVER stored
    const newFeedback = await Feedback.create({
      recipientId: recipient._id,
      requestId: requestId || null,
      message: message.trim(),
      category: feedbackCategory,
      isRead: false,
      isDeleted: false,
    });

    return NextResponse.json({
      success: true,
      message: "Your anonymous feedback has been sent successfully!",
      id: newFeedback._id,
    });
  } catch (error: any) {
    console.error("Anonymous feedback submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit feedback",
      },
      { status: 500 }
    );
  }
}
