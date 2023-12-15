import React from 'react'
import {useState,useEffect} from 'react';
import { validateMessage } from '../../utils/messageValidator';
import { sendChatMessage } from '../../store/actions/messengerActions';
import { useSelector } from 'react-redux';


function MessageInput({socketId}) {
   
    const [message,setMessage] = useState('');
    const [inputDisabled,setInputDisabled] = useState(false);

    const onlineUsers = useSelector((state) => state.map.onlineUsers);

    const handleChange = (event) => {
        setMessage(event.target.value);
    }

    useEffect(() => {
      if(!onlineUsers.find(user=> user.socketId === socketId)){
        //show error message that user is offline
        //remove chatbox
        setInputDisabled(true);
      }
    }, []);

    const sendMessage = () => {
        if(!onlineUsers.find((user) => user.socketId === socketId)){
            setInputDisabled(true);
            setMessage('');
            return;
            // show error message that user is offline 
        }
        sendChatMessage(socketId,message);
        setMessage('');
    }

    const handleKeys = (event) => {
        if(event.code === 'Enter' && !event.shiftKey && validateMessage(message)){
            sendMessage();
        }
    }
    /// use debouncing over here for message validation 

  return (
    <>
    <div className='chatbox_new_message_container'>
            <input className='chatbox_new_message_input' 
            placeholder='Type a message'
            type='text'
            value ={message}
            onChange ={handleChange}
            onKeyDown={handleKeys}
            disabled={inputDisabled}
            />
    </div>
    </>
  )
}

export default MessageInput