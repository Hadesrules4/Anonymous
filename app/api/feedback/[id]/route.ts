import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Feedback from "@/models/Feedback";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await connectDB();

    const feedback = await Feedback.findOne({
      _id: id,
      recipientId: session.user.id,
    });

    if (!feedback) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    if (body.isRead !== undefined) {
      feedback.isRead = Boolean(body.isRead);
    }

    if (body.isDeleted !== undefined) {
      feedback.isDeleted = Boolean(body.isDeleted);
    }

    await feedback.save();

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const result = await Feedback.findOneAndDelete({
      _id: id,
      recipientId: session.user.id,
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
