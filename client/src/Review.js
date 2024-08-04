import React, { useEffect, useState } from 'react';
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
  const [ratingArr, setRatingArr] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/reviews')
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, []);

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
        <span key={i} className={i < rating ? 'star filled' : 'star'}><i class="fa-solid fa-star"></i></span>
      );
    }
    return stars;
  };


  const add_rating = (val) => {
    console.log(ratingArr);
    if(ratingArr.find(val)){
      console.log(true);
      console.log(ratingArr);
    }
    else{
      console.log(ratingArr);
      setRatingArr(...ratingArr, val)
    }
  }

  return (
    <div>
      {reviews.length === 0 ? (
        <p className='loading'>No reviews available...</p>
      ) : (
        <div className="reviews_cart">
          <div className="rating_filter">
            <div className="rating_fil_button" onClick={() => {add_rating(0)}}>0 star</div>
            <div className="rating_fil_button" onClick={() => {add_rating(1)}}>1 star</div>
            <div className="rating_fil_button" onClick={() => {add_rating(2)}}>2 star</div>
            <div className="rating_fil_button" onClick={() => {add_rating(3)}}>3 star</div>
            <div className="rating_fil_button" onClick={() => {add_rating(4)}}>4 star</div>
            <div className="rating_fil_button" onClick={() => {add_rating(5)}}>5 star</div>
          </div>
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className="review-item">
                <div className="circle" style={{ backgroundColor: getRandomColor() }}>
                  {review.user_name.charAt(0).toUpperCase()}
                </div>
                <div className="review-content">
                  <p className='review_username'>{review.user_name} <span className='reviews_ago'>{daysAgo(review.timestamp)} days ago</span></p>
                  <div className="rating">{renderStars(review.rating)}</div>
                  <p className='review_mes'>{review.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reviews;