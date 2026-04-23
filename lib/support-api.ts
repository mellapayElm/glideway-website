// Support API functions for ride operations
// These are mock implementations - replace with real API calls in production

export async function requestRefund(
  rideId: string,
  reason: string,
  amount: number
) {
  // Mock API call for refund requests
  console.log(`[v0] Refund requested for ride ${rideId}: $${amount} - Reason: ${reason}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        refundId: `REF-${Date.now()}`,
        status: "Processing",
        amount: amount,
      });
    }, 1000);
  });
}

export async function startMaskedCall(rideId: string) {
  // Mock API call to start masked call with driver
  console.log(`[v0] Starting masked call for ride ${rideId}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id: `CALL-${Date.now()}`,
        status: "Connected",
        duration: 0,
      });
    }, 500);
  });
}

export async function sendRideMessage(rideId: string, message: string) {
  // Mock API call to send message to driver
  console.log(`[v0] Sending message to driver for ride ${rideId}: ${message}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        messageId: `MSG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: message,
      });
    }, 300);
  });
}

export async function getRideMessages(rideId: string) {
  // Mock API call to fetch ride messages
  console.log(`[v0] Fetching messages for ride ${rideId}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          sender: "System",
          body: "Your driver is on the way.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 300);
  });
}
