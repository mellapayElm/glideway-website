// API utilities for fetching ride data
export async function fetchRideById(rideId: string) {
  // Mock implementation - replace with actual API call
  return {
    id: rideId,
    status: 'DRIVER_EN_ROUTE',
    estimatedFareMinor: 2475,
    finalFareMinor: 2475,
    pickupJson: {
      coordinates: [34.0522, -118.2437]
    },
    dropoffJson: {
      coordinates: [34.0622, -118.2537]
    },
    payment: {
      id: 'pay_' + Math.random(),
      status: 'AUTHORIZED',
      amountMinor: 2475
    }
  };
}

export async function submitRefund(rideId: string, paymentId: string, amount: number, reason: string) {
  // Mock implementation - replace with actual API call
  return {
    success: true,
    refundId: 'refund_' + Math.random(),
    amount,
    reason,
    status: 'PROCESSING'
  };
}
