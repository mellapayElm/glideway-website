import { NextRequest, NextResponse } from "next/server"
import { sendPayoutNotificationEmail } from "@/lib/sendgrid"
import { sendPayoutNotificationSMS } from "@/lib/twilio"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, firstName, amount, payoutDate, sendSMS } = body

    if (!email || !firstName || !amount || !payoutDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: email, firstName, amount, payoutDate" },
        { status: 400 }
      )
    }

    // Send email notification
    const emailResult = await sendPayoutNotificationEmail(email, firstName, amount, payoutDate)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error },
        { status: 500 }
      )
    }

    // Send SMS if requested and phone is provided
    let smsResult = { success: true, messageId: undefined }
    if (sendSMS && phone) {
      smsResult = await sendPayoutNotificationSMS(phone, amount, payoutDate)
    }

    return NextResponse.json({
      success: true,
      message: "Payout notification sent successfully",
      email: {
        messageId: emailResult.messageId,
        success: emailResult.success
      },
      sms: sendSMS ? {
        messageId: smsResult.messageId,
        success: smsResult.success
      } : null
    })
  } catch (error) {
    console.error("[PAYOUT NOTIFICATION API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
