import { NextRequest, NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/sendgrid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, firstName, code } = body

    if (action === "SEND_VERIFICATION_EMAIL") {
      if (!email || !firstName || !code) {
        return NextResponse.json(
          { success: false, error: "Email, firstName, and code are required" },
          { status: 400 }
        )
      }

      const result = await sendVerificationEmail(email, firstName, code)

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Verification email sent",
        messageId: result.messageId
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[EMAIL VERIFICATION API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
