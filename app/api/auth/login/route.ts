import { NextRequest, NextResponse } from "next/server"

// In-memory user store (replace with database in production)
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

// Add demo users
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, userType } = body

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Email and password are required" 
      }, { status: 400 })
    }

    // Find user
    const user = users.get(email.toLowerCase())

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, { status: 401 })
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, { status: 401 })
    }

    // Check user type if specified
    if (userType && user.userType !== userType && userType !== "ANY") {
      return NextResponse.json({ 
        success: false, 
        error: `This account is not registered as a ${userType.toLowerCase()}` 
      }, { status: 403 })
    }

    // Generate token
    const token = generateToken(user.id)

    // Return success
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        userType: user.userType
      }
    })

  } catch (error) {
    console.error("[AUTH LOGIN] Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "An error occurred during login" 
    }, { status: 500 })
  }
}

// Export user store for registration API
export { users }
