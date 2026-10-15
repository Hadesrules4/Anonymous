import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendVerificationEmail({
  email,
  username,
  code,
}: {
  email: string;
  username: string;
  code: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend) {
      console.log(`[DEV MODE - NO RESEND API KEY] Verification OTP for ${email} (${username}): ${code}`);
      return { success: true };
    }

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Unsaid <onboarding@resend.dev>",
      to: email,
      subject: `Your Unsaid verification code: ${code}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #111827; margin-bottom: 8px;">Welcome to Unsaid, ${username}!</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 24px;">
            Thank you for creating an account. Use the 6-digit verification code below to confirm your email and activate your account:
          </p>
          <div style="margin: 32px 0; text-align: center;">
            <span style="display: inline-block; padding: 14px 28px; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827; background-color: #f3f4f6; border-radius: 8px; border: 1px dashed #9ca3af;">
              ${code}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 13px; line-height: 20px;">
            This code will expire in 10 minutes. If you did not request this email, please disregard it.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Unsaid &bull; Anonymous feedback. Honest perspectives.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to send verification email:", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}
