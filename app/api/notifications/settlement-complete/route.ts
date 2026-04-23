import { NextRequest, NextResponse } from "next/server"
import { sendSettlementCompleteEmail } from "@/lib/sendgrid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, amount, settlementDate } = body

    if (!email || !firstName || !amount || !settlementDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: email, firstName, amount, settlementDate" },
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
      message: "Settlement complete notification sent successfully",
      messageId: result.messageId
    })
  } catch (error) {
    console.error("[SETTLEMENT COMPLETE API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
