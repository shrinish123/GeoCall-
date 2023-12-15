import React,{useEffect,useRef} from 'react'
import { useSelector } from 'react-redux';
import callIcon from '../resources/images/call-icon.svg';
import micIcon from '../resources/images/mic-icon.svg';
import micOffIcon from '../resources/images/mic-off-icon.svg';
import cameraIcon from '../resources/images/camera-icon.svg';
import cameraOffIcon from '../resources/images/camera-off-icon.svg';
import { createVideoRoom,joinVideoRoom } from '../store/actions/videoRoomActions';
import  disconnectIcon  from '../resources/images/call-disconnect-icon.svg';
import { leaveVideoRoom } from '../store/actions/videoRoomActions';
import { useDispatch } from 'react-redux';
import { setMicOn,setVideoOn } from '../realTimeComm/videoRoomSlice';

function VideoRooms() {
  return (
    <>
    <RoomsList/>   
    <ParticipantsVideos/> 
    </>
  )
}

const RoomsList = () => { 

    const rooms = useSelector((state) => state.videoRooms.rooms);
    
    return (
        <>
        <div className='map_page_v_rooms_list'>
            <CreateRoomButton/>
            {rooms.map((room) => {
                return <RoomJoinButton key={room.id} room={room}/>
            })}
        </div>      
        </>
    )
}


const CreateRoomButton = () => { 

    const inRoom = useSelector((state)=> state.videoRooms.inRoom); 


    const handleCreateRoom = () => { 
        if(inRoom) {
            return alert('You are already in a room');
        }
       createVideoRoom();
    }


    return (
        <>
        <img className='map_page_card_img' alt='create_room_button' src ={callIcon} onClick={handleCreateRoom}/>  
        </>
    )
}

const RoomJoinButton = ({room}) => { 

    
    const creatorUsername = room.participants[0].username;
    const roomId = room.id;

    const inRoom = useSelector((state)=> state.videoRooms.inRoom); 

    const handleJoinRoom = () => { 
        if(inRoom) {
            return alert('You are already in a room');
        }
        if(room.participants.length > 1) {
            return alert('Room is full');
        }

        joinVideoRoom({roomId});
    } 


    return (
        <>
        <button onClick={handleJoinRoom} className='map_page_v_rooms_join_button'>
            {creatorUsername[0]}
        </button>
        </> 
    )
}

const ParticipantsVideos = () => {

    const inRoom = useSelector((state)=> state.videoRooms.inRoom);
    const localStream = useSelector((state)=> state.videoRooms.localStream);
    const remoteStream = useSelector((state)=> state.videoRooms.remoteStream);



    return (
        <div className='map_page_v_rooms_videos_container'>
                { inRoom && localStream && <Video stream = {localStream} muted = {true}/>}
                { inRoom && remoteStream && <Video stream = {remoteStream} muted = {false}/>}
                { inRoom && <VideoRoomButtons inRoom = {inRoom}/>}
        </div>
    )
}

const Video = ({stream,muted}) => {

    const videoRef = useRef();

    useEffect(()=> {
        const video = videoRef.current;
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            video.play();
        }
    },[stream]);

       
    return (
        <div className='map_page_v_rooms_video_container'>
            <video 
            ref={videoRef}
            width='98%' 
            height='98%'
            playsInline
            autoPlay
            muted={muted}/>
            
        </div>
    )
}

const VideoRoomButtons = ({inRoom}) => {

    const micOn = useSelector((state)=> state.videoRooms.micOn);
    const cameraOn = useSelector((state)=> state.videoRooms.videoOn);

    const localStream = useSelector((state)=> state.videoRooms.localStream);  


    const dispatch = useDispatch();

    const handleLeave = () => { 
        leaveVideoRoom(inRoom)
    }

    const handleMuteChange = () => { 
        localStream.getAudioTracks()[0].enabled = !micOn;
        dispatch(setMicOn(!micOn));
    }

    const handleCameraChange = () => {
        localStream.getVideoTracks()[0].enabled = !cameraOn;
        dispatch(setVideoOn(!cameraOn));
    }    

    return (
        <>
        <div className='m_page_v_rooms_video_buttons_container'>
                <button onClick={handleMuteChange} className='m_page_v_rooms_video_button'>
                    <img src={micOn ? micIcon : micOffIcon} width='25px' height='25px' alt='mic'/> 
                </button>
                <button className='m_page_v_rooms_video_button' onClick={handleLeave}>
                    <img src={disconnectIcon} width='25px' height='25px' alt='disconnect'/>
                </button>
                <button onClick={handleCameraChange} className='m_page_v_rooms_video_button'>
                <img src={cameraOn ? cameraIcon : cameraOffIcon} width='25px' height='25px' alt='mic'/> 
                </button>n
            </div>
        </>
    )
}

export default VideoRooms