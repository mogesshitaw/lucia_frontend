/* eslint-disable @typescript-eslint/no-explicit-any */
// /hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketMessage {
  type: string;
  data: any;
}

export const useWebSocket = (onMessage?: (message: WebSocketMessage) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
    
    socketRef.current = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('new_order', (data: any) => {
      const message = { type: 'new_order', data };
      setLastMessage(message);
      onMessage?.(message);
    });

    socketRef.current.on('order_updated', (data: any) => {
      const message = { type: 'order_updated', data };
      setLastMessage(message);
      onMessage?.(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onMessage]);

  const send = useCallback((event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  }, [isConnected]);

  return { isConnected, lastMessage, send };
};