import { NextRequest, NextResponse } from "next/server"

// Admin users store
const adminUsers = new Map<string, { 
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  permissions: string[]
  createdAt: Date 
}>()

// Add admin users
adminUsers.set("admin@glideway.com", {
  id: "admin-001",
  email: "admin@glideway.com",
  password: "admin1234",
  firstName: "Super",
  lastName: "Admin",
  role: "SUPER_ADMIN",
  permissions: ["all"],
  createdAt: new Date()
})

adminUsers.set("ops@glideway.com", {
  id: "admin-002",
  email: "ops@glideway.com",
  password: "ops1234",
  firstName: "Operations",
  lastName: "Manager",
  role: "OPERATIONS",
  permissions: ["rides", "drivers", "support"],
  createdAt: new Date()
})

adminUsers.set("finance@glideway.com", {
  id: "admin-003",
  email: "finance@glideway.com",
  password: "finance1234",
  firstName: "Finance",
  lastName: "Manager",
  role: "FINANCE",
  permissions: ["accounting", "payouts", "reports"],
  createdAt: new Date()
})

adminUsers.set("hr@glideway.com", {
  id: "admin-004",
  email: "hr@glideway.com",
  password: "hr1234",
  firstName: "HR",
  lastName: "Manager",
  role: "HR",
  permissions: ["staff", "recruitment", "performance"],
  createdAt: new Date()
})

// Generate simple token
function generateToken(userId: string, role: string): string {
  return `gw_admin_${role}_${userId}_${Date.now()}_${Math.random().toString(36).substring(2)}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Email and password are required" 
      }, { status: 400 })
    }

    // Find admin user
    const user = adminUsers.get(email.toLowerCase())

    if (!user) {
      // Log failed attempt
      console.log(`[ADMIN AUTH] Failed login attempt for: ${email}`)
      return NextResponse.json({ 
        success: false, 
        error: "Invalid credentials or unauthorized access" 
      }, { status: 401 })
    }

    // Check password
    if (user.password !== password) {
      console.log(`[ADMIN AUTH] Failed login attempt (wrong password) for: ${email}`)
      return NextResponse.json({ 
        success: false, 
        error: "Invalid credentials or unauthorized access" 
      }, { status: 401 })
    }

    // Generate token
    const token = generateToken(user.id, user.role)

    console.log(`[ADMIN AUTH] Successful login: ${email} (${user.role})`)

    // Return success
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions
      }
    })

  } catch (error) {
    console.error("[ADMIN AUTH] Error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "An error occurred during login" 
    }, { status: 500 })
  }
}
