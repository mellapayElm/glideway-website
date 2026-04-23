"use server"

import { NextRequest, NextResponse } from "next/server"

// Simulated database store (in production, use PostgreSQL with Prisma)
const pendingVerifications = new Map<string, {
  code: string
  expiresAt: Date
  phone: string
  email: string
  attempts: number
}>()

const registeredUsers = new Map<string, any>()
const registeredDrivers = new Map<string, any>()

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Hash password (in production, use bcrypt)
function hashPassword(password: string): string {
  // Simple hash simulation - use bcrypt in production
  return Buffer.from(password).toString('base64')
}

// Validate phone number
function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

// Validate email
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
function validatePassword(password: string): { valid: boolean; score: number; errors: string[] } {
  const errors: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else errors.push("Password must be at least 8 characters")

  if (password.length >= 12) score += 1

  if (/[a-z]/.test(password)) score += 1
  else errors.push("Password must contain lowercase letters")

  if (/[A-Z]/.test(password)) score += 1
  else errors.push("Password must contain uppercase letters")

  if (/[0-9]/.test(password)) score += 1
  else errors.push("Password must contain numbers")

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else errors.push("Password must contain special characters")

  return { valid: errors.length === 0, score, errors }
}

// Rate limiting check
const rateLimits = new Map<string, { count: number; resetAt: Date }>()

function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
  const now = new Date()
  const limit = rateLimits.get(identifier)

  if (!limit || limit.resetAt < now) {
    rateLimits.set(identifier, { count: 1, resetAt: new Date(now.getTime() + windowMs) })
    return true
  }

  if (limit.count >= maxAttempts) {
    return false
  }

  limit.count++
  return true
}

// RIDER REGISTRATION HANDLERS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      // Step 1: Initiate registration - send OTP to phone
      case "INITIATE_REGISTRATION": {
        const { phone, email, firstName, lastName } = body

        // Validate inputs
        if (!validatePhone(phone)) {
          return NextResponse.json({ success: false, error: "Invalid phone number format" }, { status: 400 })
        }

        if (!validateEmail(email)) {
          return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
        }

        if (!firstName || !lastName) {
          return NextResponse.json({ success: false, error: "First name and last name are required" }, { status: 400 })
        }

        // Check rate limit
        if (!checkRateLimit(phone)) {
          return NextResponse.json({ 
            success: false, 
            error: "Too many attempts. Please try again in 5 minutes." 
          }, { status: 429 })
        }

        // Check if user already exists
        if (registeredUsers.has(email) || registeredUsers.has(phone)) {
          return NextResponse.json({ 
            success: false, 
            error: "An account with this phone or email already exists" 
          }, { status: 409 })
        }

        // Generate OTP
        const otp = generateOTP()
        const verificationId = `VER-${Date.now()}-${Math.random().toString(36).substring(7)}`

        // Store verification data
        pendingVerifications.set(verificationId, {
          code: otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
          phone,
          email,
          attempts: 0
        })

        // In production, send SMS via Twilio/AWS SNS
        console.log(`[OTP] Sending ${otp} to ${phone}`)

        // Log to admin audit
        console.log(`[ADMIN AUDIT] New registration initiated: ${email}, ${phone}`)

        return NextResponse.json({ 
          success: true, 
          verificationId,
          message: "Verification code sent to your phone",
          expiresIn: 600 // 10 minutes
        })
      }

      // Step 2: Verify OTP
      case "VERIFY_OTP": {
        const { verificationId, code } = body

        const verification = pendingVerifications.get(verificationId)

        if (!verification) {
          return NextResponse.json({ success: false, error: "Invalid or expired verification" }, { status: 400 })
        }

        if (verification.expiresAt < new Date()) {
          pendingVerifications.delete(verificationId)
          return NextResponse.json({ success: false, error: "Verification code expired" }, { status: 400 })
        }

        if (verification.attempts >= 3) {
          pendingVerifications.delete(verificationId)
          return NextResponse.json({ success: false, error: "Too many incorrect attempts" }, { status: 400 })
        }

        if (verification.code !== code) {
          verification.attempts++
          return NextResponse.json({ 
            success: false, 
            error: "Incorrect verification code",
            attemptsRemaining: 3 - verification.attempts
          }, { status: 400 })
        }

        // OTP verified - update verification status
        return NextResponse.json({ 
          success: true, 
          message: "Phone number verified successfully",
          verified: true
        })
      }

      // Step 3: Verify Email (send link)
      case "VERIFY_EMAIL": {
        const { verificationId, email } = body

        const verification = pendingVerifications.get(verificationId)
        if (!verification || verification.email !== email) {
          return NextResponse.json({ success: false, error: "Invalid verification session" }, { status: 400 })
        }

        // Generate email verification token
        const emailToken = `EMAIL-${Date.now()}-${Math.random().toString(36).substring(7)}`

        // In production, send email via SendGrid/AWS SES
        console.log(`[EMAIL] Sending verification link with token ${emailToken} to ${email}`)

        return NextResponse.json({ 
          success: true, 
          message: "Verification email sent",
          emailToken
        })
      }

      // Step 4: Complete Registration
      case "COMPLETE_REGISTRATION": {
        const { 
          verificationId,
          firstName, middleName, lastName,
          email, phone, dateOfBirth,
          password,
          streetAddress, apartment, city, state, zipCode, country,
          paymentMethod, cardNumber, cardExpiry, cardCvv, cardName,
          emergencyName, emergencyPhone, emergencyRelation,
          agreeTerms, agreePrivacy, agreePaymentStorage, agreeLocation
        } = body

        // Validate verification
        const verification = pendingVerifications.get(verificationId)
        if (!verification) {
          return NextResponse.json({ success: false, error: "Invalid verification session" }, { status: 400 })
        }

        // Validate required consents
        if (!agreeTerms || !agreePrivacy || !agreePaymentStorage) {
          return NextResponse.json({ 
            success: false, 
            error: "You must agree to all required terms and policies" 
          }, { status: 400 })
        }

        // Validate password
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.valid) {
          return NextResponse.json({ 
            success: false, 
            error: passwordValidation.errors.join(", ") 
          }, { status: 400 })
        }

        // Create user record
        const userId = `USR-${Date.now()}-${Math.random().toString(36).substring(7)}`
        const hashedPassword = hashPassword(password)

        const userData = {
          id: userId,
          firstName,
          middleName: middleName || null,
          lastName,
          email,
          phone,
          dateOfBirth,
          passwordHash: hashedPassword,
          address: {
            street: streetAddress,
            apartment: apartment || null,
            city,
            state,
            zipCode,
            country
          },
          paymentMethod: {
            type: paymentMethod,
            lastFour: cardNumber ? cardNumber.slice(-4) : null,
            expiry: cardExpiry,
            tokenized: true // In production, tokenize via Stripe/WorldPay
          },
          emergencyContact: emergencyName ? {
            name: emergencyName,
            phone: emergencyPhone,
            relation: emergencyRelation
          } : null,
          consents: {
            terms: agreeTerms,
            privacy: agreePrivacy,
            paymentStorage: agreePaymentStorage,
            location: agreeLocation,
            acceptedAt: new Date().toISOString()
          },
          status: "ACTIVE",
          loyaltyTier: "BRONZE",
          createdAt: new Date().toISOString(),
          emailVerified: true,
          phoneVerified: true
        }

        // Save to database
        registeredUsers.set(email, userData)
        registeredUsers.set(phone, userData)

        // Clean up verification
        pendingVerifications.delete(verificationId)

        // Generate JWT token
        const token = Buffer.from(JSON.stringify({ 
          userId, 
          email, 
          role: "RIDER",
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000 
        })).toString('base64')

        // Log to admin
        console.log(`[ADMIN AUDIT] New rider registered: ${userId}, ${email}`)

        return NextResponse.json({ 
          success: true, 
          message: "Account created successfully!",
          userId,
          token,
          user: {
            id: userId,
            firstName,
            lastName,
            email,
            phone,
            loyaltyTier: "BRONZE"
          }
        })
      }

      // DRIVER REGISTRATION
      case "DRIVER_INITIATE": {
        const { phone, email, firstName, lastName, ssn } = body

        if (!validatePhone(phone) || !validateEmail(email)) {
          return NextResponse.json({ success: false, error: "Invalid phone or email" }, { status: 400 })
        }

        if (!ssn || ssn.length < 9) {
          return NextResponse.json({ success: false, error: "Valid SSN required for driver registration" }, { status: 400 })
        }

        // Generate OTP
        const otp = generateOTP()
        const verificationId = `DRV-${Date.now()}-${Math.random().toString(36).substring(7)}`

        pendingVerifications.set(verificationId, {
          code: otp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          phone,
          email,
          attempts: 0
        })

        console.log(`[OTP] Sending driver verification ${otp} to ${phone}`)

        return NextResponse.json({ 
          success: true, 
          verificationId,
          message: "Verification code sent"
        })
      }

      case "DRIVER_COMPLETE": {
        const {
          verificationId,
          // Personal
          firstName, middleName, lastName, email, phone, dateOfBirth, ssn,
          password,
          // Address
          streetAddress, city, state, zipCode, country,
          // License
          licenseNumber, licenseState, licenseExpiry, licenseClass,
          // Vehicle
          vehicleMake, vehicleModel, vehicleYear, vehicleColor, vehiclePlate, vehicleVin,
          // Insurance
          insuranceCompany, insurancePolicy, insuranceExpiry,
          // Bank
          bankName, bankRouting, bankAccount, bankAccountType,
          // Availability
          serviceAreas, availability,
          // Consents
          agreeTerms, agreeBackground, agreeDrugTest, agreeInsurance
        } = body

        // Validate consents
        if (!agreeTerms || !agreeBackground || !agreeDrugTest || !agreeInsurance) {
          return NextResponse.json({ 
            success: false, 
            error: "All consent agreements are required" 
          }, { status: 400 })
        }

        const driverId = `DRV-${Date.now()}-${Math.random().toString(36).substring(7)}`
        const hashedPassword = hashPassword(password)

        const driverData = {
          id: driverId,
          personal: {
            firstName, middleName, lastName, email, phone, dateOfBirth,
            ssnLastFour: ssn.slice(-4) // Only store last 4
          },
          passwordHash: hashedPassword,
          address: { streetAddress, city, state, zipCode, country },
          license: { 
            number: licenseNumber, 
            state: licenseState, 
            expiry: licenseExpiry, 
            class: licenseClass,
            verified: false 
          },
          vehicle: { 
            make: vehicleMake, 
            model: vehicleModel, 
            year: vehicleYear, 
            color: vehicleColor, 
            plate: vehiclePlate, 
            vin: vehicleVin,
            verified: false 
          },
          insurance: { 
            company: insuranceCompany, 
            policy: insurancePolicy, 
            expiry: insuranceExpiry,
            verified: false 
          },
          payout: { 
            bankName, 
            routingLastFour: bankRouting.slice(-4), 
            accountLastFour: bankAccount.slice(-4),
            accountType: bankAccountType 
          },
          serviceAreas,
          availability,
          status: "PENDING_APPROVAL", // Requires admin approval
          backgroundCheckStatus: "PENDING",
          documentsStatus: "PENDING_REVIEW",
          rating: 5.0,
          totalTrips: 0,
          totalEarnings: 0,
          createdAt: new Date().toISOString()
        }

        registeredDrivers.set(email, driverData)

        // Notify admin dashboard
        console.log(`[ADMIN NOTIFICATION] New driver application: ${driverId}, ${email} - PENDING APPROVAL`)

        return NextResponse.json({ 
          success: true, 
          message: "Application submitted! Your account is pending admin approval.",
          driverId,
          status: "PENDING_APPROVAL",
          nextSteps: [
            "Background check will be initiated",
            "Documents will be reviewed",
            "You will receive email notification when approved"
          ]
        })
      }

      // LOGIN
      case "LOGIN": {
        const { email, password, userType } = body

        if (!email || !password) {
          return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
        }

        const users = userType === "DRIVER" ? registeredDrivers : registeredUsers
        const user = users.get(email)

        if (!user) {
          return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
        }

        const hashedInput = hashPassword(password)
        if (user.passwordHash !== hashedInput) {
          return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
        }

        if (userType === "DRIVER" && user.status !== "ACTIVE") {
          return NextResponse.json({ 
            success: false, 
            error: `Account is ${user.status}. Please wait for approval or contact support.` 
          }, { status: 403 })
        }

        const token = Buffer.from(JSON.stringify({ 
          userId: user.id, 
          email, 
          role: userType,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000 
        })).toString('base64')

        return NextResponse.json({ 
          success: true, 
          token,
          user: {
            id: user.id,
            firstName: userType === "DRIVER" ? user.personal.firstName : user.firstName,
            lastName: userType === "DRIVER" ? user.personal.lastName : user.lastName,
            email,
            role: userType,
            status: user.status
          }
        })
      }

      // RESEND OTP
      case "RESEND_OTP": {
        const { verificationId } = body

        const verification = pendingVerifications.get(verificationId)
        if (!verification) {
          return NextResponse.json({ success: false, error: "Session expired" }, { status: 400 })
        }

        if (!checkRateLimit(verification.phone, 3, 60000)) {
          return NextResponse.json({ 
            success: false, 
            error: "Please wait before requesting another code" 
          }, { status: 429 })
        }

        const newOtp = generateOTP()
        verification.code = newOtp
        verification.expiresAt = new Date(Date.now() + 10 * 60 * 1000)
        verification.attempts = 0

        console.log(`[OTP] Resending ${newOtp} to ${verification.phone}`)

        return NextResponse.json({ success: true, message: "New code sent" })
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[REGISTRATION ERROR]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint for checking registration status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const id = searchParams.get("id")

  if (action === "CHECK_DRIVER_STATUS" && id) {
    const driver = registeredDrivers.get(id)
    if (driver) {
      return NextResponse.json({
        success: true,
        status: driver.status,
        documentsStatus: driver.documentsStatus,
        backgroundCheckStatus: driver.backgroundCheckStatus
      })
    }
    return NextResponse.json({ success: false, error: "Driver not found" }, { status: 404 })
  }

  return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
}
