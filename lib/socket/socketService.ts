/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/lib/socket/socketService.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
    this.socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    // Listen for events
    this.socket.on('new_message', (data: any) => {
      this.emitToListeners('new_message', data);
    });

    this.socket.on('new_order', (data: any) => {
      this.emitToListeners('new_order', data);
    });

    this.socket.on('order_status_updated', (data: any) => {
      this.emitToListeners('order_status_updated', data);
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emitToListeners(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();

// Initialize on import
if (typeof window !== 'undefined') {
  socketService.connect();
}