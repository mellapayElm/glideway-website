import { NextRequest, NextResponse } from "next/server"

// In-memory user store (shared with login)
const users = new Map<string, { 
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  userType: string
  createdAt: Date 
}>()

// Add demo users (same as login)
users.set("demo@glideway.com", {
  id: "user-demo-001",
  email: "demo@glideway.com",
  password: "demo1234",
  firstName: "Demo",
  lastName: "User",
  phone: "1234567890",
  userType: "RIDER",
  createdAt: new Date()
})

users.set("admin@glideway.com", {
  id: "admin-001",
  email: "admin@glideway.com",
  password: "admin1234",
  firstName: "Admin",
  lastName: "User",
  phone: "0987654321",
  userType: "ADMIN",
  createdAt: new Date()
})

users.set("driver@glideway.com", {
  id: "driver-001",
  email: "driver@glideway.com",
  password: "driver1234",
  firstName: "Driver",
  lastName: "Test",
  phone: "5555555555",
  userType: "DRIVER",
  createdAt: new Date()
})

// Generate simple token
function generateToken(userId: string): string {
  return `gw_${userId}_${Date.now()}_${Math.random().toString(36).substring(2)}`
}

// Validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Validate phone format (basic)
function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ""))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, userType = "RIDER" } = body

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "All fields are required" 
      }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        success: false, 
        error: "Please enter a valid email address" 
      }, { status: 400 })
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ 
        success: false, 
        error: "Please enter a valid phone number" 
      }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ 
        success: false, 
        error: "Password must be at least 8 characters" 
      }, { status: 400 })
    }

    // Check if email already exists
    if (users.has(email.toLowerCase())) {
      return NextResponse.json({ 
        success: false, 
        error: "An account with this email already exists" 
      }, { status: 409 })
    }

    // Create user ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    // Store user
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: password, // In production, hash this!
      firstName,
      lastName,
      phone: phone.replace(/\D/g, ""),
      userType,
      createdAt: new Date()
    }

    users.set(email.toLowerCase(), newUser)

    // Generate token
    const token = generateToken(userId)

    console.log(`[REGISTRATION] New user created: ${email} (${userType})`)

    // Return success
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        userType: newUser.userType
      }
    })

  } catch (error) {
    console.error("[AUTH REGISTER] Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "An error occurred during registration" 
    }, { status: 500 })
  }
}

// Export user store
export { users }
