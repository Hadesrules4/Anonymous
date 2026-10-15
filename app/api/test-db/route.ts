import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const user = await User.create({
      username: "testuser",
      email: "test@unsaid.com",
      password: "testpassword",
    });

    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
      user,
    });
  } catch (error) {
    console.error("Database test failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}