import { NextRequest, NextResponse } from "next/server"
import { sendSecurityAlertEmail } from "@/lib/sendgrid"
import { sendSecurityAlertSMS } from "@/lib/twilio"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, firstName, alertType, timestamp, sendSMS } = body

    if (!email || !firstName || !alertType || !timestamp) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: email, firstName, alertType, timestamp" },
        { status: 400 }
      )
    }

    // Send email alert
    const emailResult = await sendSecurityAlertEmail(email, firstName, alertType, timestamp)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error },
        { status: 500 }
      )
    }

    // Send SMS if requested and phone is provided
    let smsResult = { success: true, messageId: undefined }
    if (sendSMS && phone) {
      const alertMessage = `⚠️ Glideway Security Alert: ${alertType} detected on your account at ${timestamp}. If this wasn't you, secure your account immediately.`
      smsResult = await sendSecurityAlertSMS(phone, alertMessage)
    }

    return NextResponse.json({
      success: true,
      message: "Security alert sent successfully",
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
    console.error("[SECURITY ALERT API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
