import { NextRequest, NextResponse } from "next/server"
import { sendPaymentAlertEmail } from "@/lib/sendgrid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, amount, recipientName, timestamp } = body

    if (!email || !firstName || !amount || !recipientName || !timestamp) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: email, firstName, amount, recipientName, timestamp" },
        { status: 400 }
      )
    }

    const result = await sendPaymentAlertEmail(email, firstName, amount, recipientName, timestamp)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Payment alert sent successfully",
      messageId: result.messageId
    })
  } catch (error) {
    console.error("[PAYMENT ALERT API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
