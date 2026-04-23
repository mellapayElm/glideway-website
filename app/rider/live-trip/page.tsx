'use client';

import { LiveGPSTracker } from '@/components/live-gps-tracker';
import { useRouter } from 'next/navigation';

export default function LiveTripPage() {
  const router = useRouter();
  
  return (
    <LiveGPSTracker 
      rideId="GW-10234"
      pickupAddress="Downtown LA, Main St"
      dropoffAddress="LAX Airport Terminal 4"
      driverName="John D."
      driverPhone="+1 (555) 123-4567"
      vehicleInfo="Black Honda Civic - GW-5239K"
      estimatedArrival="8 min"
      onBack={() => router.push('/rider')}
    />
  );
}
