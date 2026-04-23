import { NextRequest, NextResponse } from "next/server"
import { sendVerificationSMS } from "@/lib/twilio"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, phone, code } = body

    if (action === "SEND_VERIFICATION_SMS") {
      if (!phone || !code) {
        return NextResponse.json(
          { success: false, error: "Phone and code are required" },
          { status: 400 }
        )
      }

      const result = await sendVerificationSMS(phone, code)

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Verification SMS sent",
        messageId: result.messageId
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[SMS API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
