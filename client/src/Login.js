import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css'
import DeadpoolLogin from './deadpool_right.png'
import DpChain from './pool_chain-removebg-preview.png'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      navigate('/movies');
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className='loginDiv'>
      <div className="login_content">
        <div className="locket_img_dp">
          <img src={DpChain} alt="" srcSet="" />
        </div>
        <div className="login_text_top">
          COME ON LOG IN
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <br />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="go_to_signup_div">
        <img src={DeadpoolLogin} alt="" srcSet="" />
        <div className="login_message">
          <div className="text_dont_have">No Account Yet? Quit Messing Up and </div>
          <button onClick={() => navigate('/signup')}>SIGNUP NOW</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;