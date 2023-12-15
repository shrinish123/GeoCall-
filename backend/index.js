const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const { PeerServer } = require('peer');

const peerServer = PeerServer({ port: 9000, path: '/peer' });

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});    

app.get('/', (req, res) => {
  res.send('Hello World!');
});

let onlineUsers = {};
let videoRooms = {};


  io.on("connection", (socket) => { 
    console.log("a user connected :D", socket.id);

    socket.on('user-login', (data)=> loginEventHandler(socket, data));

   
    socket.on('send-message', (data) => {
      sendMessageEventHandler(socket, data);
    });

    socket.on('create-video-room', (data) => {
      videoRoomCreatedEventHandler(socket, data);
    })

    socket.on('join-video-room', (data) => {
      videoRoomJoinHandler(socket, data);
    })

    socket.on('leave-video-room', (data) => {
      videoRoomLeaveHandler(socket, data);
    })

    socket.on("disconnect", () => {
      disconnectEventHandler(socket); 
     console.log("user disconnected :(");
   });



  });  



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Socket Events

const loginEventHandler = (socket, data) => {

  socket.join('logged-users');

   onlineUsers[socket.id] = {
       username: data.username,
       coords : data.coords
   };
   console.log(onlineUsers);

   io.to('logged-users').emit('online-users', convertOnlineUsersToArray());
   broadCastVideoRooms();
}

const disconnectEventHandler = (socket) => {
    console.log("disconnectEventHandler", socket.id);
    checkIfUserIsInCall(socket);
    removeOnlineUser(socket.id);
    broadcastDisconnectedUser(socket.id);

};

const broadcastDisconnectedUser = (socketId) => {
  io.to('logged-users').emit('user-disconnected', socketId);
}

const sendMessageEventHandler = (socket, data) => {
  const { recieverSocketId,content,id } = data;

  if(onlineUsers[recieverSocketId]){
    io.to(recieverSocketId).emit('recieve-message', {
      content,
      senderSocketId : socket.id,
      id,
    });
  }
}

const videoRoomCreatedEventHandler = (socket, data) => {
  const {newRoomId,peerId} = data;
 
  videoRooms[newRoomId] = {
    participants : [
      {
        socketId : socket.id,
        peerId,
        username : onlineUsers[socket.id].username,
      }
    ]
  };
  

  broadCastVideoRooms();
}

const broadCastVideoRooms = () => {
   io.to('logged-users').emit('video-rooms', videoRooms);
}


const videoRoomJoinHandler = (socket, data) => {

      const {roomId,peerId} = data;

      if(videoRooms[roomId]){
        videoRooms[roomId].participants.forEach((participant)=>{
            socket.to(participant.socketId).emit('video-room-init',{
              newParticipantPeerId : peerId,
              roomId
            });
        })
      }

      videoRooms[roomId].participants.push({
        socketId : socket.id,
        peerId,
        username : onlineUsers[socket.id].username,
      });
}

const videoRoomLeaveHandler = (socket, data) => {
  const roomId = data;
  
  console.log(roomId,videoRooms[roomId]);

  if(videoRooms[roomId]){
    videoRooms[roomId].participants = videoRooms[roomId].participants.filter((participant)=> participant.socketId !== socket.id);
  }

  if(videoRooms[roomId]?.participants.length > 0){
    //emit event to other user to close the peer connection
    socket
    .to(videoRooms[roomId].participants[0].socketId)
    .emit('video-call-disconnect');
  }

  if(videoRooms[roomId].participants.length === 0){
    delete videoRooms[roomId];
  }

  broadCastVideoRooms();
}



// helper function


const removeOnlineUser = (socketId) => {
  if(onlineUsers[socketId]){
    delete onlineUsers[socketId];
  }
  console.log(onlineUsers);
}

const convertOnlineUsersToArray = () => {
  
  let onlineUsersArray = [];
  for (const [key, value] of Object.entries(onlineUsers)) {
    onlineUsersArray.push({
      socketId: key,
      username: value.username,
      coords: value.coords
    });
  }
  return onlineUsersArray;
}


const checkIfUserIsInCall = (socket) => {

  Object.entries(videoRooms).forEach(([key,value])=>{
    value.participants.forEach((participant)=>{
      if(participant.socketId === socket.id){
        removeUserFRomVideoRoom(socket.id,key);
      }
    })
  })
}

const removeUserFRomVideoRoom = (socketId,roomId) => {

  videoRooms[roomId].participants = videoRooms[roomId].participants.filter((participant)=> participant.socketId !== socketId);

  if(videoRooms[roomId].participants.length === 0){
    delete videoRooms[roomId];
  }
  else{
    io.to(videoRooms[roomId].participants[0].socketId).emit('video-call-disconnect');
  }

  broadCastVideoRooms();
}



