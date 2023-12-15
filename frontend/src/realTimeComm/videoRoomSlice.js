import { createSlice } from "@reduxjs/toolkit"

const initialState = {
   inRoom : null , //  roomId of the room in which the user is currently in
   rooms : [],
   localStream : null,
   remoteStream : null,
   micOn : true,
   videoOn : true
};

export const videoRoomsSlice = createSlice({
    name : 'videoRooms',
    initialState,
    reducers:{
        setInRoom : (state,action) => { 
            state.inRoom = action.payload;
        },
        setRooms : (state,action) => {
            state.rooms = action.payload;
        },
        setLocalStream : (state,action) => {
            state.localStream = action.payload;
        },
        setRemoteStream : (state,action) => {
            state.remoteStream = action.payload;
        },
        setMicOn : (state,action) => {
            state.micOn = action.payload;
        },
        setVideoOn : (state,action) => {
            state.videoOn = action.payload;
        }
    }
});

export const {setInRoom,setRooms,setLocalStream,setRemoteStream,setMicOn,setVideoOn} = videoRoomsSlice.actions;

export default videoRoomsSlice.reducer;