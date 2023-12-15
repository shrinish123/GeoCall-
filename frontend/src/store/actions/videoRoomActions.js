import {v4 as uuid } from 'uuid';
import store from '../store';
import {setInRoom,setRooms} from '../../realTimeComm/videoRoomSlice';
import * as socketConn from '../../socketConnection/socketConn';
import { getAccessToLocalStream } from '../../realTimeComm/webRTCHandler';
import { getPeerId,callDisconnectHandler } from '../../realTimeComm/webRTCHandler'

export const createVideoRoom = async() =>{ 
        // get local video stream tracks
        const success = await getAccessToLocalStream();

        if(!success) return;

        const newRoomId = uuid();
         
        socketConn.createVideoRoom({newRoomId,peerId:getPeerId()});
        store.dispatch(setInRoom(newRoomId));
}

export const addVideoRoomsHandler = (videoRooms) => {
    
    
    let rooms = [];

    Object.keys(videoRooms).forEach((roomId)=>{
        const room = {
            id : roomId,
            participants : videoRooms[roomId].participants
        }
        rooms.push(room);
    })

    store.dispatch(setRooms(rooms));
};

export const joinVideoRoom = async (data) => {
    
    // get local video stream tracks
    const success = await getAccessToLocalStream();

    if(!success) return;

    const {roomId} = data;
    /// make sure to set inRoom with this roomId if success
    store.dispatch(setInRoom(roomId));
    socketConn.joinVideoRoom({roomId,peerId:getPeerId()});
}

export const leaveVideoRoom = (roomId) => { 
    // disconnect 
    console.log(roomId);
    callDisconnectHandler();
    socketConn.leaveVideoRoom(roomId);
    store.dispatch(setInRoom(null));
}
