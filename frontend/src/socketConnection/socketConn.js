import io from 'socket.io-client';
import { onlineUsersHandler, userDisconnectedHandler } from '../store/actions/usersActions';
import { recieveMessageHandler } from '../store/actions/messengerActions';
import { addVideoRoomsHandler } from '../store/actions/videoRoomActions';
import { call,callDisconnectHandler } from '../realTimeComm/webRTCHandler'
let socket  = null;

export const connectwithSocketIOServer = () => {
       socket = io('http://localhost:5000');

       socket.on('connect', () => {
           console.log('connected');
       });

       socket.on('online-users', (onlineUsers) => {
        onlineUsersHandler(socket.id, onlineUsers);
       })

       socket.on('user-disconnected', (socketId) => {
        userDisconnectedHandler(socketId);
       })

       socket.on('recieve-message', (data) => {
          recieveMessageHandler(data);
       })

       socket.on('video-rooms', (videoRooms)=> {
          addVideoRoomsHandler(videoRooms);
       })
       
       socket.on('video-room-init', (data) => {
          call(data);
       })

       socket.on('video-call-disconnect', () => { 
        callDisconnectHandler();
       })
       
          
}  

export const login = (data) => {
    socket.emit('user-login', data);
}


export const sendMessage = (data) => {
  socket.emit('send-message', data);
}

export const createVideoRoom = (data) => {
  socket.emit('create-video-room', data);
}

export const joinVideoRoom = (data) => {
  socket.emit('join-video-room', data);
}

export const leaveVideoRoom = (data) => {
  socket.emit('leave-video-room',data);
}