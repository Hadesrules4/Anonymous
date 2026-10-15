import { NextResponse } from "next/server";
import { verifyEmailCode, resendVerificationCode } from "@/actions/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, code } = body;

    if (action === "resend") {
      const result = await resendVerificationCode(email);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    const result = await verifyEmailCode({ email, code });
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Verification request failed" },
      { status: 500 }
    );
  }
}
