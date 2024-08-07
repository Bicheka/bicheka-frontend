import React, { useEffect, useState} from 'react';
import "../css/Login.css";
import axios from 'axios';
import { useDispatch, useSelector} from 'react-redux';
import { setJwt } from './redux/slices/jwtSlices';
import { setUserInfo } from './redux/slices/userInfoSlice';
import { useNavigate } from 'react-router';
import { setIsLogged } from './redux/slices/loginSlices';
import { fetchUser } from '../service/client';
import { API_URL } from "./global/GlobalConsts"

function Login(props) {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const jwt = useSelector(state => state.jwt.jwt);
  //useEffect hook will update every time the jwt changes (at first jwt is gonna be null, so thats why we use the if statement)
  useEffect(() => {
    if(jwt){
      console.log("This should be the redux token -> " + jwt);
    }
  }, [jwt]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked");
    console.log(email);
    console.log(password);

    try {

      const response = await axios.post(API_URL+'/authenticate', { 
        email,
        password 
      });
      
      let token = response.headers.authorization;
  

      dispatch(setJwt(token));  //store the token in redux (globally)
      localStorage.setItem('token', token); //store the token in local storage (globally)

      // console.log("here should be the token -> " + token);

      if (rememberMe) {
        // Set the token in a persistent cookie that expires after 30 days
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        document.cookie = `token=${token};expires=${date.toUTCString()}`;
      } 

      const user = await fetchUser(token);
      console.log(user);

      console.log("user: ")
      console.log(user)


      // setUserName(user.data.firstName);
      dispatch(setIsLogged(true));
      dispatch(setUserInfo(user.data));
      
      console.log(user.data);


      navigate('/');


    } catch (erroR) {
      setError(erroR);
      console.log(erroR);
      console.log(erroR.response.data.message);
    }
  
  };

  return (
    <div className="login">
      <h1>Login</h1>
      {/* <h1>{isLogged ? "Hello "+userName : ""}</h1> */}
      <form onSubmit={handleLogin}>
        <div>{error && <div className='error'><p>Error when trying to connect to server</p></div>}</div>
        <div className='field'>
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={e => setemail(e.target.value)} />
        </div>
        <div className='field'>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className='checkBox'>
          <label>Remember me</label>
          <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
        </div>
        <button type="submit">Login</button>
      </form>

      <button className='registerButton' type='button' onClick={() => navigate('/register')}>Register</button>

    </div>
  );
}

export default Login;