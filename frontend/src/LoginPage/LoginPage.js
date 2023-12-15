import React,{useEffect, useState} from 'react'
import './LoginPage.css';
import {useNavigate} from 'react-router-dom';
import {useDispatch , useSelector}  from 'react-redux';
import {setMyLocation} from '../MapPage/mapSlice';
import { getFakeLocation } from './FakeLocation';
import { connectwithSocketIOServer } from '../socketConnection/socketConn';
import { connectWithPeerServer } from '../realTimeComm/webRTCHandler';
import { proceedWithLogin } from '../store/actions/loginPageActions';


const isUsernameValid = (username) => {
   return username.length > 0 && username.length < 10 && username.includes(' ') === false;
}

const locationOptions = {
  enableHighAccuracy: true,
  timeout: 5000, 
  maximumAge: 0
}  

const Logo = () => { 
  return <p className='logo'> GeoCall </p>
}

const LoginInput = ({username,setUsername}) => {

  const handleChange = (e) => {
    setUsername(e.target.value);
  }

  return <input className='l_page_input' type='text' placeholder='Username' value = {username} onChange={handleChange}/>
}

const LoginButton = ({onClickHandler,disabled}) => {
  return <button disabled={disabled} onClick ={onClickHandler} className='l_page_login_button'> Login </button>
}  



function LoginPage() {

  const [username, setUsername] = useState('');
  const [locationError, setLocationError] = useState(false);

  const myLocation = useSelector((state) => state.map.myLocation);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogin = () => {
    proceedWithLogin({
      username,coords:{
        lat:myLocation.lat,
        lng:myLocation.lng
      }});
    navigate('/map');
  }

  const onSuccess = (position) => {
   
    dispatch(setMyLocation({
      lat:position.coords.latitude,
      lng:position.coords.longitude}));
  }

  const onError = (error) => {
    console.log(error);
    setLocationError(true);
  }

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(
    //   onSuccess,
    //   onError,
    //   locationOptions)

    onSuccess(getFakeLocation());

  }, []);

  useEffect(() => {
    if(myLocation !== null){
      connectwithSocketIOServer();
      connectWithPeerServer();
    }
  }, [myLocation]);

  return (
    <>
      <div className="l_page_main_container">
        <div className="l_page_box">
            <Logo/>
            <LoginInput username = {username} setUsername={setUsername}/>
            <LoginButton disabled ={!isUsernameValid(username) || locationError} onClickHandler ={handleLogin}/>
          </div>
       </div> 
    </>
  )
}

export default LoginPage