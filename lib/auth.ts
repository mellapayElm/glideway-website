// GlideWay Authentication & Security System
// Technology: JWT + MFA + Role-Based Access Control

import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// ==========================================
// CONFIGURATION
// ==========================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'glideway-secure-secret-key-change-in-production'
)
const JWT_ISSUER = 'glideway'
const JWT_AUDIENCE = 'glideway-app'

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'
const ADMIN_TOKEN_EXPIRY = '1h'

// ==========================================
// TYPES
// ==========================================

export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
  sessionId: string
  mfaVerified?: boolean
}

export type UserRole = 
  | 'RIDER'
  | 'DRIVER'
  | 'SUPPORT'
  | 'DISPATCHER'
  | 'ACCOUNTANT'
  | 'OPERATIONS'
  | 'COMPLIANCE'
  | 'ADMIN'
  | 'SUPER_ADMIN'

export interface AuthResult {
  success: boolean
  user?: TokenPayload
  error?: string
  code?: string
}

// ==========================================
// PASSWORD HASHING
// ==========================================

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else feedback.push('Password must be at least 8 characters')

  if (password.length >= 12) score += 1

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Add uppercase letters')

  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Add lowercase letters')

  if (/[0-9]/.test(password)) score += 1
  else feedback.push('Add numbers')

  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push('Add special characters')

  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'admin']
  if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
    score -= 2
    feedback.push('Avoid common passwords')
  }

  return {
    isValid: score >= 4 && password.length >= 8,
    score: Math.max(0, Math.min(5, score)),
    feedback
  }
}

// ==========================================
// JWT TOKEN GENERATION
// ==========================================

export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function generateRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function generateAdminToken(payload: TokenPayload): Promise<string> {
  if (!isAdminRole(payload.role)) {
    throw new Error('User is not an admin')
  }
  return new SignJWT({ ...payload, admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(ADMIN_TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

// ==========================================
// JWT TOKEN VERIFICATION
// ==========================================

export async function verifyToken(token: string): Promise<AuthResult> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    })

    return {
      success: true,
      user: payload as unknown as TokenPayload
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid token'
    return {
      success: false,
      error: errorMessage,
      code: 'INVALID_TOKEN'
    }
  }
}

// ==========================================
// COOKIE MANAGEMENT
// ==========================================

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies()
  
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60 // 15 minutes
  })

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

// ==========================================
// ROLE-BASED ACCESS CONTROL
// ==========================================

const ROLE_HIERARCHY: Record<UserRole, number> = {
  RIDER: 1,
  DRIVER: 2,
  SUPPORT: 3,
  DISPATCHER: 4,
  ACCOUNTANT: 5,
  OPERATIONS: 6,
  COMPLIANCE: 7,
  ADMIN: 8,
  SUPER_ADMIN: 9
}

const ADMIN_ROLES: UserRole[] = ['SUPPORT', 'DISPATCHER', 'ACCOUNTANT', 'OPERATIONS', 'COMPLIANCE', 'ADMIN', 'SUPER_ADMIN']

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role)
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function canAccessModule(userRole: UserRole, module: string): boolean {
  const modulePermissions: Record<string, UserRole[]> = {
    'super-admin': ['SUPER_ADMIN'],
    'operations': ['OPERATIONS', 'ADMIN', 'SUPER_ADMIN'],
    'accounting': ['ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN'],
    'ledgers': ['ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN'],
    'drivers': ['OPERATIONS', 'COMPLIANCE', 'ADMIN', 'SUPER_ADMIN'],
    'customers': ['SUPPORT', 'OPERATIONS', 'ADMIN', 'SUPER_ADMIN'],
    'pricing': ['ADMIN', 'SUPER_ADMIN'],
    'management': ['ADMIN', 'SUPER_ADMIN'],
    'compliance': ['COMPLIANCE', 'ADMIN', 'SUPER_ADMIN'],
    'support': ['SUPPORT', 'OPERATIONS', 'ADMIN', 'SUPER_ADMIN'],
    'dispatch': ['DISPATCHER', 'OPERATIONS', 'ADMIN', 'SUPER_ADMIN']
  }

  const allowedRoles = modulePermissions[module]
  if (!allowedRoles) return false
  return allowedRoles.includes(userRole)
}

// ==========================================
// MFA (Multi-Factor Authentication)
// ==========================================

export function generateMFACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateMFASecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

// TOTP verification would use a library like 'otplib' in production
export function verifyTOTP(secret: string, code: string): boolean {
  // Simplified for demo - in production use otplib
  // This is a placeholder that accepts any 6-digit code
  return /^\d{6}$/.test(code)
}

// ==========================================
// SESSION MANAGEMENT
// ==========================================

export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

// ==========================================
// RATE LIMITING
// ==========================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

// ==========================================
// AUDIT LOGGING
// ==========================================

export interface AuditLogEntry {
  userId?: string
  action: string
  entity: string
  entityId?: string
  oldValue?: unknown
  newValue?: unknown
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(entry: AuditLogEntry): Promise<void> {
  // In production, this would write to the database
  console.log('[AUDIT]', JSON.stringify({
    ...entry,
    timestamp: new Date().toISOString()
  }))
}

// ==========================================
// MIDDLEWARE HELPERS
// ==========================================

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    // Try cookies
    const token = request.cookies.get('access_token')?.value
    if (!token) {
      return { success: false, error: 'No token provided', code: 'NO_TOKEN' }
    }
    return verifyToken(token)
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

export function createAuthMiddleware(requiredRole?: UserRole) {
  return async function middleware(request: NextRequest) {
    const auth = await authenticateRequest(request)

    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error, code: auth.code },
        { status: 401 }
      )
    }

    if (requiredRole && !hasPermission(auth.user!.role, requiredRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    // Add user to request headers for downstream handlers
    const response = NextResponse.next()
    response.headers.set('x-user-id', auth.user!.userId)
    response.headers.set('x-user-role', auth.user!.role)
    return response
  }
}

// ==========================================
// ENCRYPTION HELPERS
// ==========================================

export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) return '*'.repeat(data.length)
  return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars)
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return maskSensitiveData(email)
  const maskedLocal = local.length > 2 
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : '*'.repeat(local.length)
  return `${maskedLocal}@${domain}`
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '*'.repeat(digits.length)
  return '*'.repeat(digits.length - 4) + digits.slice(-4)
}
