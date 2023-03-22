import { io } from 'socket.io-client';

export const socket = io.connect("http://192.168.0.100:3002")

