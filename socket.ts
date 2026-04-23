/*
Backend endpoints expected by the rider support UI:

POST /api/v1/rides/:rideId/messages
POST /api/v1/rides/:rideId/calls/start
POST /api/v1/refunds

These should connect to:
- ride-specific chat persistence
- Twilio masked calling
- refund workflow already scaffolded
*/