import { NextRequest, NextResponse } from "next/server"

// Store OTP codes for verification (in production, use database with expiry)
const otpStore = new Map<string, { code: string; expiresAt: Date; attempts: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, verificationId, code } = body

    if (action === "VERIFY_CODE") {
      if (!verificationId || !code) {
        return NextResponse.json(
          { success: false, error: "Verification ID and code are required" },
          { status: 400 }
        )
      }

      const verification = otpStore.get(verificationId)

      if (!verification) {
        return NextResponse.json(
          { success: false, error: "Invalid or expired verification" },
          { status: 400 }
        )
      }

      if (verification.expiresAt < new Date()) {
        otpStore.delete(verificationId)
        return NextResponse.json(
          { success: false, error: "Verification code expired" },
          { status: 400 }
        )
      }

      if (verification.attempts >= 3) {
        otpStore.delete(verificationId)
        return NextResponse.json(
          { success: false, error: "Too many incorrect attempts" },
          { status: 400 }
        )
      }

      if (verification.code !== code) {
        verification.attempts++
        return NextResponse.json(
          {
            success: false,
            error: "Incorrect verification code",
            attemptsRemaining: 3 - verification.attempts
          },
          { status: 400 }
        )
      }

      // Code verified - mark as successful
      otpStore.delete(verificationId)

      return NextResponse.json({
        success: true,
        message: "Code verified successfully",
        verified: true
      })
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[CODE VERIFICATION API ERROR]", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
