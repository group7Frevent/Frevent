import { io } from 'socket.io-client';
import { API_URL } from '@env'

export const socket = io.connect(API_URL)

