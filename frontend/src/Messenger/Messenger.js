import React from 'react'
import './Messenger.css';
import Chatbox from './Chat/Chatbox';
import { useSelector } from 'react-redux';

function Messenger(){

    const chatboxes = useSelector((state) => state.messenger.chatboxes);

  return (
    <>
        <div className='messenger_container'>
            {chatboxes.map((chatbox) => {
               return <Chatbox key = {chatbox.socketId} socketId ={chatbox.socketId} username={chatbox.username}/>
            })}
        </div>
    </>
  )
}

export default Messenger