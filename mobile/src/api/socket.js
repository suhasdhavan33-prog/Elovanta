import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api').replace(
  /\/api\/?$/,
  ''
);

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false });
  }
  return socket;
};

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem('token');
  const s = getSocket();
  s.auth = { token };
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};
