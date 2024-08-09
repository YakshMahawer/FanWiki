import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Review.css'; // Make sure to create a CSS file for styles

const daysAgo = (timestamp) => {
  const postDate = new Date(timestamp);
  const today = new Date();
  const timeDiff = today - postDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [ratingArr, setRatingArr] = useState([0,1,2,3,4,5]);
  const { movieId } = useParams(); // Get the movie_id from the URL

  useEffect(() => {
    fetch(`http://localhost:5000/reviews/${movieId}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [movieId]); // Depend on movieId to refetch when it changes

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'star filled' : 'star'}>
          <i className="fa-solid fa-star"></i>
        </span>
      );
    }
    return stars;
  };

  const add_rating = (val) => {
    if (ratingArr.includes(val)) {
      setRatingArr(ratingArr.filter(item => item !== val));
    } else {
      setRatingArr([...ratingArr, val]);
    }
    console.log(ratingArr);
  };

  // Filter reviews based on selected ratings
  const filteredReviews = reviews.filter(review => ratingArr.includes(review.rating));

  return (
    <div>
      {reviews.length === 0 ? (
        <p className='loading'>No reviews available...</p>
      ) : (
        <div className="reviews_cart">
          <div className="review_selectors">
            <div onClick={() => add_rating(0)} className={`review_star ${ratingArr.includes(0) ? 'bg_on' : 'bg_off'}`}>0 star</div>
            <div onClick={() => add_rating(1)} className={`review_star ${ratingArr.includes(1) ? 'bg_on' : 'bg_off'}`}>1 star</div>
            <div onClick={() => add_rating(2)} className={`review_star ${ratingArr.includes(2) ? 'bg_on' : 'bg_off'}`}>2 star</div>
            <div onClick={() => add_rating(3)} className={`review_star ${ratingArr.includes(3) ? 'bg_on' : 'bg_off'}`}>3 star</div>
            <div onClick={() => add_rating(4)} className={`review_star ${ratingArr.includes(4) ? 'bg_on' : 'bg_off'}`}>4 star</div>
            <div onClick={() => add_rating(5)} className={`review_star ${ratingArr.includes(5) ? 'bg_on' : 'bg_off'}`}>5 star</div>
          </div>
          <ul>
            {filteredReviews.length === 0 ? (
              <p>No reviews match the selected ratings.</p>
            ) : (
              filteredReviews.map((review, index) => (
                <li key={index} className="review-item">
                  <div className="circle" style={{ backgroundColor: getRandomColor() }}>
                    {review.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="review-content">
                    <p className='review_username'>
                      {review.user_name} <span className='reviews_ago'>{daysAgo(review.timestamp)} days ago</span>
                    </p>
                    <div className="rating">{renderStars(review.rating)}</div>
                    <p className='review_mes'>{review.message}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reviews;
