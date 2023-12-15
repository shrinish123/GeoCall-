import { v4 as uuid } from 'uuid';
import {addChatbox,addChatMessage} from '../../Messenger/messengerSlice'; 
import store  from '../store';
import { sendMessage } from '../../socketConnection/socketConn';

export const sendChatMessage = (recieverSocketId,content) => { 
    const message = {
        content,
        recieverSocketId,
        id : uuid(),
    }

    // socketConnection -> to send message to other user
    sendMessage(message);

    store.dispatch(
        addChatMessage({
        socketId : recieverSocketId,
        content,
        myMessage : true,
        id : message.id, 
    }));
}

export const recieveMessageHandler = (data) => {
    const { content, senderSocketId, id } = data;
    store.dispatch(
        addChatMessage({
        socketId : senderSocketId,
        content,
        myMessage : false,
        id,
    }));
    
    openChatbox(senderSocketId);
}

const openChatbox = (socketId) => {

    const chatboxes = store.getState().messenger.chatboxes;
    const chatbox = chatboxes.find((chatbox) => chatbox.socketId === socketId);

    if(chatbox)return;

    const onlineUsers = store.getState().map.onlineUsers;
    const user = onlineUsers.find((user) => user.socketId === socketId);

    if(user){
        store.dispatch(addChatbox({
            socketId,
            username : user.username,
        }))
    }
}