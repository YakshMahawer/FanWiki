import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './NavigationButtons.css';

const NavigationButtons = () => {
  const navigate = useNavigate();
  const { movieId } = useParams(); // Extract the movieId from the URL

  const handleWriteReview = () => {
    if (localStorage.getItem('token')) {
      navigate(`/home/${movieId}/write`);
    } else {
      navigate('/login');
    }
  };


  const handleHome = () => {
    navigate('/movies');
  }
  const handleLogout = async () => {
    try {
      // Make a POST request to the logout endpoint
      await axios.post('http://localhost:5000/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Clear token from local storage
      localStorage.removeItem('token');

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <div className="black_div"></div>
      <div className="wide_poster_div">
        <div className="invisible_poster"></div>
        <div className="title_tribute">fan wiki</div>
      </div>
      <div className="nav_buttons_div">
          <button className='button_class' onClick={handleHome}><i class="fa-solid fa-house-chimney"></i></button>
        <Link to={`/home/${movieId}/info`}>
          <button className={`button_class ${window.location.pathname.includes(`/home/${movieId}/info`) ? 'active_class' : ''}`}>Info</button>
        </Link>
        <Link to={`/home/${movieId}/characters`}>
          <button className={`button_class ${window.location.pathname.includes(`/home/${movieId}/characters`) ? 'active_class' : ''}`}>Characters</button>
        </Link>
        <Link to={`/home/${movieId}/reviews`}>
          <button className={`button_class ${window.location.pathname.includes(`/home/${movieId}/reviews`) ? 'active_class' : ''}`}>Reviews</button>
        </Link>
        <Link to={`/home/${movieId}/fantheories`}>
          <button className={`button_class ${window.location.pathname.includes(`/home/${movieId}/fantheories`) ? 'active_class' : ''}`}>Fan Theories</button>
        </Link>
        <Link to={`/home/${movieId}/write`}>
          <button className={`button_class ${window.location.pathname.includes(`/home/${movieId}/write`) ? 'active_class' : ''}`} onClick={handleWriteReview}>Write</button>
        </Link>
        <button className="button_class" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i></button>
      </div>
    </div>
  );
};

export default NavigationButtons;
