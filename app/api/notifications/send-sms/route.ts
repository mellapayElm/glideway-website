import { NextRequest, NextResponse } from "next/server"
import { sendSecurityAlertSMS, sendPayoutNotificationSMS } from "@/lib/twilio"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, phone, ...rest } = body

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      )
    }

    switch (action) {
      case "SEND_SECURITY_ALERT": {
        const { message } = rest
        if (!message) {
          return NextResponse.json(
            { success: false, error: "Message is required" },
            { status: 400 }
          )
        }

        const result = await sendSecurityAlertSMS(phone, message)
        
        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: "Security alert SMS sent",
          messageId: result.messageId
        })
      }

      case "SEND_PAYOUT": {
        const { amount, date } = rest
        if (!amount || !date) {
          return NextResponse.json(
            { success: false, error: "Missing required fields: amount, date" },
            { status: 400 }
          )
        }

        const result = await sendPayoutNotificationSMS(phone, amount, date)
        
        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: "Payout notification SMS sent",
          messageId: result.messageId
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("[SMS NOTIFICATION API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
