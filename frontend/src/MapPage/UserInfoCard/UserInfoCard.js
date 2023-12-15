import React from 'react'
import {useSelector} from 'react-redux';
import chatIcon from '../../resources/images/chat-icon.svg';
import { useDispatch } from 'react-redux';
import { addChatbox } from '../../Messenger/messengerSlice';

const Label = ({fontSize, text}) => { 
    return (
      <p className='map_page_card_label' style = {{fontSize}}> 
          {text}
      </p>
    ) 
}

const deg2rad = (deg) => {
  return deg * (Math.PI/180)
}

const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);  
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function UserInfoCard({username, userLocation ,socketId}) {

  const {myLocation} = useSelector((state) => state.map);
  const distance = getDistanceFromLatLonInKm(myLocation.lat,myLocation.lng,userLocation.lat,userLocation.lng).toFixed(2);
  
  return (
    <div className='map_page_card_container'>
      <Label fontSize = '16px' text = {username}/>
      <Label fontSize = '14px' text = {`${distance} km`}/>
      <ActionButtons socketId = {socketId} username = {username}/>
    </div>
  )
}

export default UserInfoCard;

const ActionButtons = ({socketId,username}) => {
    
  return (
    <div className='map_page_card_buttons_container'>
      <ChatButton socketId = {socketId} username = {username}/>
    </div>
  )
}

const ChatButton = ({socketId,username}) => {

  const dispatch = useDispatch();

  const handleAddChat = () => {
    dispatch(addChatbox({socketId,username}));
  }
    
  return (
      <img onClick={handleAddChat} src = {chatIcon} className='map_page_card_img' alt={'chat-icon'}></img>
  )
}