// GlideWay Rides API
// Handles ride requests, booking, and management

import { NextRequest, NextResponse } from 'next/server'
import { calculateFare, type TripInput, type FareResult } from '@/lib/fare-engine'

// ==========================================
// GET - List rides or get fare estimate
// ==========================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  // Fare Estimate
  if (action === 'estimate') {
    const pickupLat = parseFloat(searchParams.get('pickupLat') || '0')
    const pickupLng = parseFloat(searchParams.get('pickupLng') || '0')
    const dropoffLat = parseFloat(searchParams.get('dropoffLat') || '0')
    const dropoffLng = parseFloat(searchParams.get('dropoffLng') || '0')
    const rideType = (searchParams.get('rideType') || 'ECONOMY') as TripInput['rideType']

    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      return NextResponse.json(
        { error: 'Missing coordinates' },
        { status: 400 }
      )
    }

    // Calculate distance (Haversine formula)
    const R = 3959 // Earth's radius in miles
    const dLat = toRad(dropoffLat - pickupLat)
    const dLng = toRad(dropoffLng - pickupLng)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(pickupLat)) * Math.cos(toRad(dropoffLat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceMiles = R * c

    // Estimate duration (avg 25 mph in city)
    const durationMinutes = Math.ceil(distanceMiles * 2.4)

    // Get current hour for traffic estimation
    const hour = new Date().getHours()
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)
    const trafficLevel = isRushHour ? 'heavy' : 'moderate'

    // Calculate fare
    const tripInput: TripInput = {
      distanceMiles,
      durationMinutes,
      rideType,
      trafficLevel: trafficLevel as TripInput['trafficLevel'],
      demandLevel: 'normal',
      isAirport: false,
      tollAmount: 0
    }

    const fareResult = calculateFare(tripInput)

    return NextResponse.json({
      success: true,
      estimate: {
        distance: {
          miles: Math.round(distanceMiles * 10) / 10,
          text: `${(distanceMiles).toFixed(1)} mi`
        },
        duration: {
          minutes: durationMinutes,
          text: `${durationMinutes} min`
        },
        traffic: trafficLevel,
        fare: fareResult,
        rideType,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 min expiry
      }
    })
  }

  // List user's rides
  // In production, this would query the database
  return NextResponse.json({
    success: true,
    rides: [],
    total: 0,
    page: 1,
    limit: 10
  })
}

// ==========================================
// POST - Create new ride request
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      riderId,
      pickupAddress,
      pickupLat,
      pickupLng,
      dropoffAddress,
      dropoffLat,
      dropoffLng,
      rideType = 'ECONOMY',
      paymentMethodId,
      promoCode
    } = body

    // Validate required fields
    if (!riderId || !pickupAddress || !dropoffAddress || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate distance
    const R = 3959
    const dLat = toRad(dropoffLat - pickupLat)
    const dLng = toRad(dropoffLng - pickupLng)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(pickupLat)) * Math.cos(toRad(dropoffLat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceMiles = R * c
    const durationMinutes = Math.ceil(distanceMiles * 2.4)

    // Calculate fare
    const tripInput: TripInput = {
      distanceMiles,
      durationMinutes,
      rideType,
      trafficLevel: 'moderate',
      demandLevel: 'normal',
      isAirport: false,
      tollAmount: 0,
      promoCode
    }

    const fareResult = calculateFare(tripInput)

    // Create ride record
    const ride = {
      id: `ride_${Date.now()}`,
      rideNumber: `GW${Date.now().toString(36).toUpperCase()}`,
      riderId,
      status: 'REQUESTED',
      rideType,
      pickupAddress,
      pickupLatitude: pickupLat,
      pickupLongitude: pickupLng,
      dropoffAddress,
      dropoffLatitude: dropoffLat,
      dropoffLongitude: dropoffLng,
      distanceMiles: Math.round(distanceMiles * 10) / 10,
      durationMinutes,
      ...fareResult.breakdown,
      totalFare: fareResult.totalFare,
      driverPayout: fareResult.economics.driverPayout,
      companyCommission: fareResult.economics.companyMargin,
      promoCode: promoCode || null,
      paymentMethodId,
      requestedAt: new Date().toISOString()
    }

    // In production:
    // 1. Save ride to database
    // 2. Start driver matching process
    // 3. Send WebSocket notification to nearby drivers
    // 4. Create payment authorization

    return NextResponse.json({
      success: true,
      ride,
      message: 'Ride requested successfully. Finding your driver...',
      estimatedPickup: `${Math.ceil(3 + Math.random() * 5)} min`
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating ride:', error)
    return NextResponse.json(
      { error: 'Failed to create ride request' },
      { status: 500 }
    )
  }
}

// ==========================================
// PATCH - Update ride (cancel, rate, tip)
// ==========================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { rideId, action, ...data } = body

    if (!rideId || !action) {
      return NextResponse.json(
        { error: 'Missing rideId or action' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'cancel':
        // Cancel ride
        return NextResponse.json({
          success: true,
          message: 'Ride canceled successfully',
          refund: data.refundAmount || 0
        })

      case 'rate':
        // Rate driver
        if (!data.rating || data.rating < 1 || data.rating > 5) {
          return NextResponse.json(
            { error: 'Invalid rating. Must be 1-5.' },
            { status: 400 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Rating submitted successfully'
        })

      case 'tip':
        // Add tip
        if (!data.tipAmount || data.tipAmount < 0) {
          return NextResponse.json(
            { error: 'Invalid tip amount' },
            { status: 400 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Tip added successfully',
          tipAmount: data.tipAmount
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error updating ride:', error)
    return NextResponse.json(
      { error: 'Failed to update ride' },
      { status: 500 }
    )
  }
}

// Helper function
function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
