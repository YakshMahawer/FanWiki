import React, { useEffect, useState } from 'react';
const daysAgo = (timestamp) => {
  const postDate = new Date(timestamp);
  const today = new Date();
  const timeDiff = today - postDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};
const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/reviews')
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, []);

  return (
    <div>
      <h1>Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              <p>{review.message}</p>
              <p>Rating: {review.rating}</p>
              <p>By: {review.user_name}</p>
              <p>{daysAgo(review.timestamp)} days ago</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews;