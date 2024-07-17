import { ApiResponse } from "../../types/ApiResponse";
import { resend } from "@/lib/Resend";
import EmailVerification from "../../Email/EmailVerification";

export async function SendVerification(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["ravichandraofficial121@gmail.com"],
    subject: "Hello world",
    react: EmailVerification({ username, otp: verifyCode }),
  });
  return { success: true, message: "Verification Email Send Successfully" };
  try {
  } catch (EmailError) {
    console.error("ERROR sending verification email :", EmailError);
    return { success: false, message: "Failed to Send Verification Code!!" };
  }
}
