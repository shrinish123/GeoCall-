import React from 'react'
import CloseButtonImg from '../../resources/images/close-icon.svg';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { removeChatBox } from '../messengerSlice';
import { useDispatch } from 'react-redux';

function Chatbox({socketId,username}) {
  return (
    <>
    <div className='chatbox_container'>
        <ChatBoxHeader username = {username} socketId={socketId}/>
        <Messages socketId={socketId}/>
        <MessageInput socketId={socketId}/>
    </div>
    </>
  )
}

const ChatBoxHeader = ({username,socketId}) => {

    return (
        <>
        <div className='chatbox_nav_bar_container'>
        <p className='chatbox_nav_bar_label'>{username}</p>
        <CloseButton socketId={socketId}/>
        </div>
        </>
    )
}

const CloseButton = ({socketId}) => {

  const dispatch = useDispatch();

  const handleRemoveChat = () => {
    dispatch(removeChatBox({socketId}));
  }

  return (
    <div className='chatbox_close_icon_container' onClick ={handleRemoveChat}>
      <img alt='close' src ={CloseButtonImg} className='chatbox_close_icon_img'/>
    </div>
  );
}

export default Chatbox;