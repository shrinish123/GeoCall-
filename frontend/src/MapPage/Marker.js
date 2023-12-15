import React from 'react'
import './MapPage.css';
import LocationIcon from '../resources/images/location-icon.svg'
import {useDispatch} from 'react-redux';
import { setCardChosenOption } from './mapSlice';

function Marker({self,socketId,username,coords}) {
  const dispatch = useDispatch();

  const handleMarkerClick = () => {
    if(!self){
      dispatch(setCardChosenOption({socketId,username,coords}));
    }
  }

  return (
    <>
    <div className='map_page_marker_container' onClick = {handleMarkerClick}>
        <img src={LocationIcon} alt={username} className='map_page_marker_image'/>
        <p className='map_page_marker_text'>{self ?  "Me" : username}</p>
    </div>
    </>
    
  )
}

export default Marker