import { createSlice } from "@reduxjs/toolkit"

const initialState = {
   chatboxes : [],
   chatHistory : {},
};

export const messengerSlice = createSlice({
    name : 'messenger',
    initialState,
    reducers:{
        addChatbox : (state,action) => {
            if(!state.chatboxes.find((chatbox)=> chatbox.socketId === action.payload.socketId)){
                state.chatboxes.push(action.payload);
            }
        },
        removeChatBox : (state,action) => {
            state.chatboxes = state.chatboxes.filter((chatbox)=> chatbox.socketId !== action.payload.socketId);
        },
        addChatMessage : (state,action) => {
            const {content,myMessage,id,socketId} = action.payload; 
            const newMessage = {content,myMessage,id};
            if(!state.chatHistory[socketId]){
                state.chatHistory[socketId] = [];
            }
            state.chatHistory[socketId].push(newMessage);
        },
    }
});

export const { addChatbox , removeChatBox ,addChatMessage } = messengerSlice.actions;

export default messengerSlice.reducer;