import React from 'react'
import './MapPage.css';
import {useSelector} from 'react-redux';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import UserInfoCard from './UserInfoCard/UserInfoCard';
import Messenger from '../Messenger/Messenger';
import VideoRooms from '../realTimeComm/VideoRooms';

function MapPage() {

  const myLocation = useSelector((state) => state.map.myLocation);
  const onlineUsers = useSelector((state) => state.map.onlineUsers);
  const {cardChosenOption} = useSelector((state) => state.map);
  
  const defaultProps = {
    center: {
      lat: myLocation.lat,
      lng: myLocation.lng
    },
    zoom: 11 
  };

  console.log(onlineUsers);

  return (
    <>
    <div className='map_page_container'>
      <GoogleMapReact
      bootstrapURLKeys={{ key: ''}}
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
      >
        {onlineUsers.map((user) => {
          return (
            <Marker
            lat={user.coords.lat}
            lng={user.coords.lng}
            key={user.socketId}
            self={user.self}
            socketId={user.socketId}
            username={user.username}
            coords={user.coords}
            />
          ) 
        })}
      </GoogleMapReact>
      <Messenger/>
      {cardChosenOption && <UserInfoCard 
        username = {cardChosenOption.username}
        socketId={cardChosenOption.socketId}
        userLocation = {cardChosenOption.coords} />}

      <VideoRooms/>  
    </div>  
    
    </>
  )
}

export default MapPage