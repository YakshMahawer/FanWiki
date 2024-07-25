import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Review() {
  const [selectedOptionValue, setSelectedOptionValue] = useState('Review');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelectedOptionValue(event.target.value);
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
      await axios.post('http://localhost:5000/review', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Post added successfully');
      navigate('/home/write');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="write_div">
      <div className="writing_window">
        <div className="selection">
          Post As :
        </div>
        <label>
          <input
            type="radio"
            value="Review"
            checked={selectedOptionValue === 'Review'}
            onChange={handleChange}
          />
          Review
        </label>
        <label>
          <input
            type="radio"
            value="Theory"
            checked={selectedOptionValue === 'Theory'}
            onChange={handleChange}
          />
          Theory
        </label>
      </div>
      <div>
        Selected Value: {selectedOptionValue}
      </div>
      <div className="writing_area">
        {selectedOptionValue === 'Review' && (
          <div>Rating: <input type="text" value={rating} onChange={(e) => setRating(e.target.value)} /></div>
        )}
        <div>Message: <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
        <br />
        <button onClick={handlePost}>Post</button>
      </div>
    </div>
  );
}

export default Review;