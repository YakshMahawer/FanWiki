import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './theory.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [expandedTheories, setExpandedTheories] = useState([]);
  const [showReadMore, setShowReadMore] = useState({});
  const [replyInputVisible, setReplyInputVisible] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [visibleComments, setVisibleComments] = useState({}); // New state for comment visibility
  const userToken = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/fantheories')
      .then((response) => response.json())
      .then((data) => {
        setTheories(data);
        checkReadMore(data);
      })
      .catch((error) => console.error('Error fetching theories:', error));
  }, []);

  const checkReadMore = (theories) => {
    const tempShowReadMore = {};
    theories.forEach(theory => {
      const element = document.createElement('div');
      element.className = 'review_mes';
      element.style.visibility = 'hidden';
      element.style.position = 'absolute';
      element.innerText = theory.message;
      document.body.appendChild(element);
      const height = element.clientHeight;
      document.body.removeChild(element);
      tempShowReadMore[theory._id] = height > 58;
    });
    setShowReadMore(tempShowReadMore);
  };

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
        checkReadMore(theories);
        toast.success('Comment Liked');
      })
      .catch((error) => {console.error('Error liking theory:', error); toast.error(error);});
  };

  const handleViewReplies = async (theory_id, comment_id) => {
    try {
      const token = localStorage.getItem('token');
      const data = { theory_id, comment_id };
      const response = await axios.post('http://localhost:5000/viewreplies', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setReplies((prevReplies) => ({
        ...prevReplies,
        [comment_id]: response.data,
      }));
      setVisibleReplies((prevVisibleReplies) => ({
        ...prevVisibleReplies,
        [comment_id]: !prevVisibleReplies[comment_id],
      }));
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error);
    }
  };

  const postComment = async (parent_id, comment, theory_id) => {
    try {
      const token = localStorage.getItem('token');
      const data = { parent_id, comment, theory_id };
      await axios.post('http://localhost:5000/postcomment', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Comment Added Succesfully');
      setComment('');
      fetch('http://localhost:5000/fantheories')
      .then((response) => response.json())
      .then((data) => {
        setTheories(data);
        checkReadMore(data);
      })
      .catch((error) => console.error('Error fetching theories:', error));
    } catch (error) {
      toast.error(error);
      console.error(error.response.data.message);
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
        checkReadMore(theories);
        toast.success('Comment Disliked')
      })
      .catch((error) => {console.error('Error disliking theory:', error);toast.error(error)});
  };

  const toggleReadMore = (id) => {
    setExpandedTheories((prevExpandedTheories) =>
      prevExpandedTheories.includes(id)
        ? prevExpandedTheories.filter((theoryId) => theoryId !== id)
        : [...prevExpandedTheories, id]
    );
  };

  const toggleReplyInput = (comment_id) => {
    setReplyInputVisible((prevReplyInputVisible) => ({
      ...prevReplyInputVisible,
      [comment_id]: !prevReplyInputVisible[comment_id],
    }));
  };

  const toggleCommentVisibility = (theory_id) => {
    setVisibleComments((prevVisibleComments) => ({
      ...prevVisibleComments,
      [theory_id]: !prevVisibleComments[theory_id],
    }));
  };

  return (
    <div>
      {theories.length === 0 ? (
        <p className='loading'>No theories available.</p>
      ) : (
        <div className="theory_cart">
          <ul>
            {theories.map((theory) => (
              <li key={theory._id}>
                <div className="t_circle" style={{ backgroundColor: getRandomColor() }}>
                  {theory.user_name.charAt(0).toUpperCase()}
                </div>
                <div className="review-content">
                  <p className='review_username'>{theory.user_name} <span className='reviews_ago'>{daysAgo(theory.timestamp)} days ago</span></p>
                  <p className="review_title">{theory.title}</p>
                  <p className={`review_mes theory_mes ${expandedTheories.includes(theory._id) ? 'expanded' : ''}`}>
                    {theory.message}
                  </p>
                  {showReadMore[theory._id] && !expandedTheories.includes(theory._id) && (
                    <button className='readmore' onClick={() => toggleReadMore(theory._id)}>Read More</button>
                  )}
                  {expandedTheories.includes(theory._id) && (
                    <button className='readmore' onClick={() => toggleReadMore(theory._id)}>Read Less</button>
                  )}
                  <div className="theory_buttons">
                    <button onClick={() => handleLike(theory._id)}>
                      <i className="fa-solid like_dislike_icon fa-thumbs-up"></i>
                      <span className='ld_count'>{theory.likes ? theory.likes.length : '0'}</span> 
                    </button>
                    <button onClick={() => handleDislike(theory._id)}>
                      <i className="fa-solid like_dislike_icon fa-thumbs-down"></i>
                      <span className='ld_count'>{theory.dislikes ? theory.dislikes.length : '0'}</span>
                    </button>
                    <button className='like_dislike_icon view_write_comment_button' onClick={() => toggleCommentVisibility(theory._id)}>
                      <i className="fa-solid fa-message"></i>
                    </button>
                  </div>
                  {visibleComments[theory._id] && (
                    <div className="post_comment">
                      <input type="text" value={comment} placeholder='Add a comment...' onChange={(e) => setComment(e.target.value)} />
                      <button type="button" onClick={() => postComment(null, comment, theory._id)}>
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                      {theory.comments.map((c) => (
                        <div key={c._id} className={(c.parent_id == null)? '':'shift'}>
                          <div className='who_commented'><span className='c_who'>@{c.name}</span><span className='c_when'>commented {daysAgo(c.timestamp)} days ago</span></div>
                          <div>{c.comment}</div>
                          <div className="reply_buttons">
                            <button className="reply_to_comment" onClick={() => toggleReplyInput(c._id)}>Reply</button>
                            <button type="button" onClick={() => handleViewReplies(theory._id, c._id)}>
                              {visibleReplies[c._id] ? 'Hide Replies' : 'View Replies'}
                            </button>
                          </div>
                          {replyInputVisible[c._id] && (
                            <div className='reply_to_comment'>
                              <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
                              <button type="button" onClick={() => postComment(c._id, comment, theory._id)}>
                                <i className="fa-solid fa-paper-plane"></i>
                              </button>
                            </div>
                          )}
                          {visibleReplies[c._id] && (
                            <div className='replies'>
                              {replies[c._id] && replies[c._id].length > 0 ? (
                                replies[c._id].map((r) => (
                                  <div key={r._id} className='shift'>
                                    <div className='who_commented'><span className='c_who'>@{r.name}</span><span className='c_when'>replied {daysAgo(r.timestamp)} days ago</span></div>
                                    <div>{r.comment}</div>
                                    <div className="reply_buttons">
                                      <button className="reply_to_comment" onClick={() => toggleReplyInput(r._id)}>Reply</button>
                                      <button type="button" onClick={() => handleViewReplies(theory._id, r._id)}>
                                        {visibleReplies[r._id] ? 'Hide Replies' : 'View Replies'}
                                      </button>
                                    </div>
                                    {replyInputVisible[r._id] && (
                                      <div className='reply_to_comment'>
                                        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
                                        <button type="button" onClick={() => postComment(r._id, comment, theory._id)}>
                                          <i className="fa-solid fa-paper-plane"></i>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div>No replies yet.</div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default FanTheories;
