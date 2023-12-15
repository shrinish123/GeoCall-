import  store  from '../store/store';
import {setLocalStream,setRemoteStream } from '../realTimeComm/videoRoomSlice';
import { Peer } from 'peerjs';

let peer;
let peerId;

export const getPeerId = () => {
    return peerId;
}

export const getAccessToLocalStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    if(localStream){
        store.dispatch(setLocalStream(localStream));
    }

    return Boolean(localStream);
}


export const connectWithPeerServer = () => {
    peer = new Peer(undefined,{
        host : 'localhost',
        port : 9000,
        path : '/peer'
    })

    peer.on('open',(id)=>{
        peerId = id;
    })

    peer.on('call',async (call) => { 
        const localStream = store.getState().videoRooms.localStream;

        call.answer(localStream);
        call.on('stream',(remoteStream)=>{
            console.log(remoteStream,localStream);
            store.dispatch(setRemoteStream(remoteStream));
        })
    })

}

export const call  = (data) => { 
    const { newParticipantPeerId } = data;
    console.log(newParticipantPeerId);

    const localStream = store.getState().videoRooms.localStream;

    const peerCall = peer.call(newParticipantPeerId,localStream);

    peerCall.on('stream',(remoteStream)=>{
        store.dispatch(setRemoteStream(remoteStream));
        
    })

}

export const callDisconnectHandler = () => {
    // close all peer connections 

    for( let connections in peer.connections){
        peer.connections[connections].forEach((connection)=>{
            connection.peerConnection.close();

            if(connection.close){
                connection.close();
            }
        })
    }

    store.dispatch(setRemoteStream(null));
}