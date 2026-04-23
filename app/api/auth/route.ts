// GlideWay Authentication API
// Handles registration, login, logout, and session management

import { NextRequest, NextResponse } from 'next/server'
import { 
  hashPassword, 
  verifyPassword, 
  generateAccessToken, 
  generateRefreshToken,
  generateSessionId,
  validatePasswordStrength,
  generateMFACode,
  checkRateLimit,
  createAuditLog,
  type TokenPayload,
  type UserRole
} from '@/lib/auth'

// ==========================================
// POST - Register, Login, or Logout
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'register':
        return handleRegister(body, request)
      case 'login':
        return handleLogin(body, request)
      case 'logout':
        return handleLogout(body)
      case 'verify-email':
        return handleVerifyEmail(body)
      case 'verify-phone':
        return handleVerifyPhone(body)
      case 'verify-mfa':
        return handleVerifyMFA(body)
      case 'refresh-token':
        return handleRefreshToken(body)
      case 'forgot-password':
        return handleForgotPassword(body)
      case 'reset-password':
        return handleResetPassword(body)
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// ==========================================
// REGISTER
// ==========================================

async function handleRegister(
  body: Record<string, unknown>,
  request: NextRequest
) {
  const {
    email,
    phone,
    password,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    address,
    emergencyContact,
    paymentMethod,
    consents,
    role = 'RIDER'
  } = body

  // Validate required fields
  if (!email || !phone || !password || !firstName || !lastName) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email as string)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    )
  }

  // Validate password strength
  const passwordCheck = validatePasswordStrength(password as string)
  if (!passwordCheck.isValid) {
    return NextResponse.json(
      { 
        error: 'Password does not meet security requirements',
        feedback: passwordCheck.feedback 
      },
      { status: 400 }
    )
  }

  // Validate consents
  if (!consents?.termsAccepted || !consents?.privacyAccepted) {
    return NextResponse.json(
      { error: 'You must accept the Terms of Service and Privacy Policy' },
      { status: 400 }
    )
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimit = checkRateLimit(`register:${ip}`, 5, 60000) // 5 per minute
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429 }
    )
  }

  // Hash password
  const passwordHash = await hashPassword(password as string)

  // Create user (in production, save to database)
  const user = {
    id: `user_${Date.now()}`,
    email,
    phone,
    passwordHash,
    firstName,
    middleName: middleName || null,
    lastName,
    dateOfBirth: dateOfBirth || null,
    role: role as UserRole,
    status: 'PENDING_VERIFICATION',
    emailVerified: false,
    phoneVerified: false,
    createdAt: new Date().toISOString()
  }

  // Generate verification codes
  const emailVerificationCode = generateMFACode()
  const phoneVerificationCode = generateMFACode()

  // In production:
  // 1. Save user to database
  // 2. Save address
  // 3. Save emergency contact
  // 4. Create Stripe customer for payment method
  // 5. Send verification email/SMS

  // Create audit log
  await createAuditLog({
    userId: user.id,
    action: 'USER_REGISTERED',
    entity: 'User',
    entityId: user.id,
    ipAddress: ip,
    userAgent: request.headers.get('user-agent') || undefined
  })

  return NextResponse.json({
    success: true,
    message: 'Registration successful. Please verify your email and phone.',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status
    },
    verification: {
      emailSent: true,
      phoneSent: true
    }
  }, { status: 201 })
}

// ==========================================
// LOGIN
// ==========================================

async function handleLogin(
  body: Record<string, unknown>,
  request: NextRequest
) {
  const { email, password, rememberMe } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimit = checkRateLimit(`login:${email}`, 5, 60000)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    )
  }

  // In production: Fetch user from database
  // const user = await prisma.user.findUnique({ where: { email } })

  // Demo user for testing
  const demoUser = {
    id: 'user_demo',
    email: email as string,
    passwordHash: await hashPassword('demo123'),
    firstName: 'Demo',
    lastName: 'User',
    role: 'RIDER' as UserRole,
    status: 'ACTIVE',
    mfaEnabled: false
  }

  // Verify password
  const isValidPassword = await verifyPassword(
    password as string,
    demoUser.passwordHash
  )

  if (!isValidPassword) {
    await createAuditLog({
      userId: demoUser.id,
      action: 'LOGIN_FAILED',
      entity: 'User',
      entityId: demoUser.id,
      ipAddress: ip
    })

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  }

  // Check if MFA is required
  if (demoUser.mfaEnabled) {
    return NextResponse.json({
      success: true,
      requiresMFA: true,
      tempToken: `mfa_${Date.now()}`,
      message: 'Please enter your two-factor authentication code'
    })
  }

  // Generate tokens
  const sessionId = generateSessionId()
  const tokenPayload: TokenPayload = {
    userId: demoUser.id,
    email: demoUser.email,
    role: demoUser.role,
    sessionId
  }

  const accessToken = await generateAccessToken(tokenPayload)
  const refreshToken = await generateRefreshToken(tokenPayload)

  // Create audit log
  await createAuditLog({
    userId: demoUser.id,
    action: 'USER_LOGGED_IN',
    entity: 'User',
    entityId: demoUser.id,
    ipAddress: ip,
    userAgent: request.headers.get('user-agent') || undefined
  })

  // Create response with cookies
  const response = NextResponse.json({
    success: true,
    message: 'Login successful',
    user: {
      id: demoUser.id,
      email: demoUser.email,
      firstName: demoUser.firstName,
      lastName: demoUser.lastName,
      role: demoUser.role
    },
    accessToken,
    expiresIn: 900 // 15 minutes
  })

  // Set HTTP-only cookies
  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: rememberMe ? 7 * 24 * 60 * 60 : 15 * 60
  })

  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60
  })

  return response
}

// ==========================================
// LOGOUT
// ==========================================

async function handleLogout(body: Record<string, unknown>) {
  const { userId } = body

  // In production: Invalidate session in database

  await createAuditLog({
    userId: userId as string,
    action: 'USER_LOGGED_OUT',
    entity: 'User',
    entityId: userId as string
  })

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })

  // Clear cookies
  response.cookies.delete('access_token')
  response.cookies.delete('refresh_token')

  return response
}

// ==========================================
// EMAIL VERIFICATION
// ==========================================

async function handleVerifyEmail(body: Record<string, unknown>) {
  const { userId, code } = body

  if (!userId || !code) {
    return NextResponse.json(
      { error: 'Missing verification code' },
      { status: 400 }
    )
  }

  // In production: Verify code from database/cache
  // For demo, accept any 6-digit code
  if (!/^\d{6}$/.test(code as string)) {
    return NextResponse.json(
      { error: 'Invalid verification code' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Email verified successfully'
  })
}

// ==========================================
// PHONE VERIFICATION
// ==========================================

async function handleVerifyPhone(body: Record<string, unknown>) {
  const { userId, code } = body

  if (!userId || !code) {
    return NextResponse.json(
      { error: 'Missing verification code' },
      { status: 400 }
    )
  }

  if (!/^\d{6}$/.test(code as string)) {
    return NextResponse.json(
      { error: 'Invalid verification code' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Phone verified successfully'
  })
}

// ==========================================
// MFA VERIFICATION
// ==========================================

async function handleVerifyMFA(body: Record<string, unknown>) {
  const { tempToken, code } = body

  if (!tempToken || !code) {
    return NextResponse.json(
      { error: 'Missing MFA code' },
      { status: 400 }
    )
  }

  if (!/^\d{6}$/.test(code as string)) {
    return NextResponse.json(
      { error: 'Invalid MFA code' },
      { status: 400 }
    )
  }

  // In production: Verify TOTP code
  // Generate full tokens after MFA success

  return NextResponse.json({
    success: true,
    message: 'MFA verified successfully',
    accessToken: `access_${Date.now()}`,
    expiresIn: 900
  })
}

// ==========================================
// REFRESH TOKEN
// ==========================================

async function handleRefreshToken(body: Record<string, unknown>) {
  const { refreshToken } = body

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'Refresh token required' },
      { status: 400 }
    )
  }

  // In production: Verify refresh token and generate new access token

  return NextResponse.json({
    success: true,
    accessToken: `access_${Date.now()}`,
    expiresIn: 900
  })
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

async function handleForgotPassword(body: Record<string, unknown>) {
  const { email } = body

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    )
  }

  // In production: 
  // 1. Check if user exists
  // 2. Generate reset token
  // 3. Send reset email

  return NextResponse.json({
    success: true,
    message: 'If an account exists with this email, a reset link has been sent.'
  })
}

// ==========================================
// RESET PASSWORD
// ==========================================

async function handleResetPassword(body: Record<string, unknown>) {
  const { token, newPassword } = body

  if (!token || !newPassword) {
    return NextResponse.json(
      { error: 'Token and new password are required' },
      { status: 400 }
    )
  }

  // Validate password strength
  const passwordCheck = validatePasswordStrength(newPassword as string)
  if (!passwordCheck.isValid) {
    return NextResponse.json(
      { 
        error: 'Password does not meet security requirements',
        feedback: passwordCheck.feedback 
      },
      { status: 400 }
    )
  }

  // In production:
  // 1. Verify reset token
  // 2. Hash new password
  // 3. Update user
  // 4. Invalidate all sessions

  return NextResponse.json({
    success: true,
    message: 'Password reset successfully. Please login with your new password.'
  })
}
