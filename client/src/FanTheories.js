import React, { useEffect, useState } from 'react';
import axios from 'axios';

const daysAgo = (timestamp) => {
  const postDate = new Date(timestamp);
  const today = new Date();
  const timeDiff = today - postDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

const FanTheories = () => {
  const [theories, setTheories] = useState([]);
  const [comment, setComment] = useState('');
  const [replies, setReplies] = useState({});
  const userToken = localStorage.getItem('token'); // Assuming token is stored in localStorage

  useEffect(() => {
    fetch('http://localhost:5000/fantheories')
      .then((response) => response.json())
      .then((data) => setTheories(data))
      .catch((error) => console.error('Error fetching theories:', error));
  }, []);

  const handleLike = (id) => {
    fetch(`http://localhost:5000/theories/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTheories((prevTheories) =>
          prevTheories.map((theory) => (theory._id === id ? data : theory))
        );
      })
      .catch((error) => console.error('Error liking theory:', error));
  };

  const handleViewReplies = async (theory_id, comment_id) => {
    try {
      const token = localStorage.getItem('token');
      const data = { theory_id, comment_id };
      const response = await axios.post('http://localhost:5000/viewreplies', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReplies((prevReplies) => ({
        ...prevReplies,
        [comment_id]: response.data.replies,
      }));
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const postComment = async (parent_id, comment, theory_id) => {
    try {
      const token = localStorage.getItem('token');
      const data = { parent_id, comment, theory_id };
      await axios.post('http://localhost:5000/postcomment', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Comment posted successfully');
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleDislike = (id) => {
    fetch(`http://localhost:5000/theories/${id}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTheories((prevTheories) =>
          prevTheories.map((theory) => (theory._id === id ? data : theory))
        );
      })
      .catch((error) => console.error('Error disliking theory:', error));
  };

  return (
    <div>
      <h1>Fan Theories</h1>
      {theories.length === 0 ? (
        <p>No theories available.</p>
      ) : (
        <ul>
          {theories.map((theory) => (
            <li key={theory._id}>
              <p>{theory.message}</p>
              <p>By: {theory.user_name}</p>
              <p>{daysAgo(theory.timestamp)} days ago</p>

              <button onClick={() => handleLike(theory._id)}>
                Like {theory.likes ? theory.likes.length : '0'}
              </button>
              <button onClick={() => handleDislike(theory._id)}>
                Dislike {theory.dislikes ? theory.dislikes.length : '0'}
              </button>
              <input type="text" onChange={(e) => setComment(e.target.value)} />
              <button type="button" onClick={() => postComment(null, comment, theory._id)}>
                Post Comment
              </button>
              {theory.comments.map((c) => (
                <div key={c._id}>
                  <div>Message: {c.comment} by {c.name}</div>
                  <div>{daysAgo(c.timestamp)} days ago</div>
                  <div>
                    <button type="button" onClick={() => handleViewReplies(theory._id, c._id)}>
                      View Replies
                    </button>
                  </div>
                  <div>
                    <input type="text" onChange={(e) => setComment(e.target.value)} />
                    <button type="button" onClick={() => postComment(c._id, comment, theory._id)}>
                      Reply
                    </button>
                  </div>
                  {replies[c._id] && (
                    <div>
                      {replies[c._id].map((reply) => (
                        <div key={reply._id}>
                          <div>Reply: {reply.comment} by {reply.name}</div>
                          <div>{daysAgo(reply.timestamp)} days ago</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FanTheories;