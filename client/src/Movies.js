import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('Batman');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiKey = 'e90669b9'; // Your OMDB API key

  const fetchMovies = async (term) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${term}&apikey=${apiKey}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setError(data.Error);
        setMovies([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching the movies:', error);
      setError('Failed to fetch movies.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.elements.search.value.trim();
    if (term) {
      setSearchTerm(term);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/home/${movieId}/info`);
  };

  return (
    <div>
      <div className="project_name">FAN-WIKI: ONE STOP DESTINATION FOR MOVIE LOVERS...</div>
      <form className='form_search' onSubmit={handleSearch}>
        <input className='search_input' type="text" name="search" placeholder="Search for a movie..." />
        <button className='search_button' type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className='all_movies'>
          {movies.map((movie) => (
            <div
            className='each_movie'
              key={movie.imdbID}
              onClick={() => handleMovieClick(movie.imdbID)}
            >
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300'}
                alt={movie.Title}
                style={{ width: '200px', height: '300px' }}
              />
              <div className='each_movie_title'>{movie.Title}</div>
              <div className='each_movie_year'>{movie.Year}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;