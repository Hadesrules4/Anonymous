import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Feedback from "@/models/Feedback";
import FeedbackRequest from "@/models/FeedbackRequest";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Total feedbacks
    const totalFeedback = await Feedback.countDocuments({
      recipientId: userId,
      isDeleted: false,
    });

    // Total requests
    const totalRequests = await FeedbackRequest.countDocuments({
      ownerId: userId,
    });

    // Unread feedback
    const unreadFeedback = await Feedback.countDocuments({
      recipientId: userId,
      isRead: false,
      isDeleted: false,
    });

    // This week's feedback
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekFeedback = await Feedback.countDocuments({
      recipientId: userId,
      isDeleted: false,
      createdAt: { $gte: oneWeekAgo },
    });

    // Category breakdown
    const categoryAggregation = await Feedback.aggregate([
      { $match: { recipientId: userId, isDeleted: false } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryStats = categoryAggregation.map((c) => ({
      category: c._id || "General",
      count: c.count,
    }));

    // Daily feedback trend (last 7 days)
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await Feedback.countDocuments({
        recipientId: userId,
        isDeleted: false,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });

      const dayName = startOfDay.toLocaleDateString("en-US", { weekday: "short" });
      dailyStats.push({ day: dayName, count });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalFeedback,
        totalRequests,
        unreadFeedback,
        thisWeekFeedback,
      },
      categoryStats,
      dailyStats,
    });
  } catch (error: any) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
