import React,{useRef,useEffect} from 'react'
import { useSelector } from 'react-redux';

function Messages({socketId}) {

    const messages  = useSelector((state) => state.messenger.chatHistory[socketId]);

    const scrollRef = useRef();

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({behavior : 'smooth'});
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]); 

    console.log(scrollRef);

  return (
    <>
    <div className='chatbox_messages_container'>
        {messages?.map((message) => {
            return <Message key={message.id} message={message.content} myMessage={message.myMessage}/>
        })}
        <div ref={scrollRef}></div>
    </div> 
    </>
  )
}

const Message = ({message,myMessage}) => {
    return (
        <>
        <div className={`chatbox_message_wrapper`} style={myMessage ? {justifyContent : 'flex-end'} : {justifyContent:'flex-start'}}>
           <p className = {`chatbox_message_${myMessage ? 'right' : 'left'}`}>{message}</p>
        </div>
        </>
    )
}





export default Messages