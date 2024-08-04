import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Write.css'; // Ensure you have a CSS file for styling

function Write() {
  const [selectedOptionValue, setSelectedOptionValue] = useState('Review');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleChange = (option) => {
    setSelectedOptionValue(option);
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handlePost = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {
        type: selectedOptionValue,
        message: message,
      };
      if (selectedOptionValue === 'Review') {
        data.rating = rating;
      }
      if (selectedOptionValue === 'Theory') {
        data.title = title;
      }
      await axios.post('http://localhost:5000/review', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(selectedOptionValue + ' added successfully');
      setMessage('');
      setTitle('');
      navigate('/home/write');
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error)
    }
  };

  return (
    <div className="write_div">
      <div className="writing_window">
        <div 
          className={`option ${selectedOptionValue === 'Review' ? 'selected' : ''}`}
          onClick={() => handleChange('Review')}
        >
          Write a Review
        </div>
        <div 
          className={`option ${selectedOptionValue === 'Theory' ? 'selected' : ''}`}
          onClick={() => handleChange('Theory')}
        >
          write a Theory
        </div>
      </div>
      <div className="writing_area">
        {selectedOptionValue === 'Review' && (
          <div className="rating">
            <span className="give_rating">Give the Rating: </span>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? 'filled' : ''}`}
                onClick={() => handleStarClick(star)}
              >
                <i class="fa-solid fa-star"></i>
              </span>
            ))}
          </div>
        )}
        {selectedOptionValue === 'Theory' && (
          <div><span className="give_rating">Theory Title: </span><textarea className='message_input' type="text" value={title} rows='1' onChange={(e) => setTitle(e.target.value)} /></div>
        )}
        <div><span className="give_rating">Message: </span><textarea className='message_input' type="text" value={message} rows='5' onChange={(e) => setMessage(e.target.value)} /></div>
        <br />
        <button className='post_write' onClick={handlePost}>Post</button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Write;
