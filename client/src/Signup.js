import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WolverineLogin from './wolverine_login.png'
import WolChain from './wol_chain-removebg-preview.png'

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', { name, email, password });
      navigate('/login');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className='loginDiv'>
    <div className="go_to_signup_div wol_signup_div">
        <img src={WolverineLogin} alt="" srcset="" />
        <div className="login_message wol_login_message">
          <div className="text_dont_have">Already An Account? Log In, Bub </div>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
      <div className="login_content">
      <div className="locket_img_dp locket_img_wol">
          <img src={WolChain} alt="" srcset="" />
        </div>
        <div className="login_text_top">
          COME ON SIGN UP
        </div>
        <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className='wol_signup' type="submit">Signup</button>
      </form>
      </div>
    </div>
  );
}

export default Signup;