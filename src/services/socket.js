import { io } from 'socket.io-client';

let socket = null;

export const initSocketClient = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[Socket.io Client] Connected to server, ID:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io Client] Disconnected from server');
    });
  }
  return socket;
};

export const getSocket = () => socket;
