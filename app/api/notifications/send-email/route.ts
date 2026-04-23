import { NextRequest, NextResponse } from "next/server"
import { sendPaymentAlertEmail, sendSettlementCompleteEmail, sendPayoutNotificationEmail, sendSecurityAlertEmail } from "@/lib/sendgrid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, firstName, ...rest } = body

    if (!email || !firstName) {
      return NextResponse.json(
        { success: false, error: "Email and firstName are required" },
        { status: 400 }
      )
    }

    switch (action) {
      case "SEND_PAYMENT_ALERT": {
        const { amount, recipientName, timestamp } = rest
        if (!amount || !recipientName || !timestamp) {
          return NextResponse.json(
            { success: false, error: "Missing required fields: amount, recipientName, timestamp" },
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
          message: "Payment alert email sent",
          messageId: result.messageId
        })
      }

      case "SEND_SETTLEMENT_COMPLETE": {
        const { amount, settlementDate } = rest
        if (!amount || !settlementDate) {
          return NextResponse.json(
            { success: false, error: "Missing required fields: amount, settlementDate" },
            { status: 400 }
          )
        }

        const result = await sendSettlementCompleteEmail(email, firstName, amount, settlementDate)
        
        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: "Settlement complete email sent",
          messageId: result.messageId
        })
      }

      case "SEND_PAYOUT": {
        const { amount, payoutDate } = rest
        if (!amount || !payoutDate) {
          return NextResponse.json(
            { success: false, error: "Missing required fields: amount, payoutDate" },
            { status: 400 }
          )
        }

        const result = await sendPayoutNotificationEmail(email, firstName, amount, payoutDate)
        
        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: "Payout notification email sent",
          messageId: result.messageId
        })
      }

      case "SEND_SECURITY_ALERT": {
        const { alertType, timestamp } = rest
        if (!alertType || !timestamp) {
          return NextResponse.json(
            { success: false, error: "Missing required fields: alertType, timestamp" },
            { status: 400 }
          )
        }

        const result = await sendSecurityAlertEmail(email, firstName, alertType, timestamp)
        
        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: "Security alert email sent",
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
    console.error("[EMAIL NOTIFICATION API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
