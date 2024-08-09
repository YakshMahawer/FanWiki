import './info.css'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Info = () => {

    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const apiKey = 'e90669b9';
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    useEffect(() => {
        const fetchMovieDetails = async () => {
          setLoading(true);
          setError('');
          try {
            const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`);
            const data = await response.json();
            if (data.Response === 'True') {
              setMovie(data);
              console.log(data);
            } else {
              setError(data.Error);
            }
            setLoading(false);
          } catch (error) {
            console.error('Error fetching the movie details:', error);
            setError('Failed to fetch movie details.');
            setLoading(false);
          }
        };
    
        fetchMovieDetails();
      }, [movieId]);
    return(
        
        <div className="info_div">
        {
            (movie != null)?
            <div className="info_1">
                <div className="director_info">
                    <div className="director_title">Movie Name: </div>
                    <div className="director_name">{movie.Title}</div>
                </div>
                <div className="info_title">Overview</div>
                <div className="info_detail">
                {movie.Plot}
                </div>
                <div className="director_info">
                    <div className="director_title">Director: </div>
                    <div className="director_name">{movie.Director}</div>
                </div>
                <div className="director_info">
                    <div className="director_title">Actors: </div>
                    <div className="director_name">{movie.Actors}</div>
                </div>
                <div className="director_info">
                    <div className="director_title">Genre: </div>
                    <div className="director_name">{movie.Genre}</div>
                </div>
                <div className="director_info">
                    <div className="director_title">Release Date: </div>
                    <div className="director_name">{movie.Released}</div>
                </div>
                <div className="director_info">
                    <div className="director_title">Runtime: </div>
                    <div className="director_name">{movie.Runtime}</div>
                </div>
                <div className="director_info">
                    <div className="director_title">Imbd Rating: </div>
                    <div className="director_name">{movie.imdbRating}</div>
                </div>
            </div>
            :''

        }
        </div>
    )
}

export default Info;