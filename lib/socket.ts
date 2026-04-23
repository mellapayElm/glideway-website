// Socket.IO utilities for real-time updates
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getTripsSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
  }
  return socket;
}

export function joinRideRoom(rideId: string) {
  const socket = getTripsSocket();
  socket.emit('join:ride', { rideId });
}

export function leaveRideRoom(rideId: string) {
  const socket = getTripsSocket();
  socket.emit('leave:ride', { rideId });
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
