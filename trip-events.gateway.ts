# GlideWay Maps + Fetch + Rooms

This package adds the next realtime/live-trip frontend layer:

- Google Maps live map component
- initial backend ride fetch helper
- socket room join/leave client helpers
- websocket room join/leave server handlers
- upgraded rider live-trip page

## New frontend pieces
- `frontend/lib/api.ts`
- `frontend/lib/socket.ts`
- `frontend/components/GoogleMapLive.tsx`
- `frontend/components/DriverLocationCard.tsx`
- `frontend/components/RideStatusCard.tsx`
- `frontend/app/ride/[rideId]/page.tsx`

## New backend websocket behavior
- `room.join`
- `room.leave`

## Environment variables needed
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## Still needed before production
- authenticated API fetch headers
- route polyline drawing
- secure room membership validation
- frontend auth guards