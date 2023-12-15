import store from '../store';
import { setOnlineUsers, removeDisconnectedUser } from '../../MapPage/mapSlice';

export const onlineUsersHandler = (socketId, onlineUsers) => {
   
    store.dispatch(setOnlineUsers(onlineUsers.map((user) => {
        if(user.socketId === socketId){
            user.self = true;
        }
        return user;
    })));
}

export const userDisconnectedHandler = (socketId) => {
    store.dispatch(removeDisconnectedUser(socketId));
}
