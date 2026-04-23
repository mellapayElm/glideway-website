import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/trips',
})
export class TripEventsGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('room.join')
  handleJoin(@MessageBody() body: { room: string }, @ConnectedSocket() client: Socket) {
    if (body?.room) {
      client.join(body.room);
      return { ok: true, room: body.room };
    }
    return { ok: false };
  }

  @SubscribeMessage('room.leave')
  handleLeave(@MessageBody() body: { room: string }, @ConnectedSocket() client: Socket) {
    if (body?.room) {
      client.leave(body.room);
      return { ok: true, room: body.room };
    }
    return { ok: false };
  }

  emitRideUpdated(rideId: string, payload: any) {
    this.server.to(`ride:${rideId}`).emit('ride.updated', payload);
  }

  emitDriverLocation(rideId: string, payload: any) {
    this.server.to(`ride:${rideId}`).emit('driver.location', payload);
  }

  emitPaymentUpdated(rideId: string, payload: any) {
    this.server.to(`ride:${rideId}`).emit('payment.updated', payload);
  }

  emitRefundUpdated(rideId: string, payload: any) {
    this.server.to(`ride:${rideId}`).emit('refund.updated', payload);
  }
}