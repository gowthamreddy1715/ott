

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { AuthContext } from '../context/authContext';
import './Movie.css';
import RealmLogo from "./RealmLogo";

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profileId, currentUser } = useContext(AuthContext);
  const [movieData, setMovieData] = useState({
    backgroundImage: '',
    title: 'Title:',
    description: 'Description:',
    imagePath: '',
    videoPath: '',
  });
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [addedMessage, setAddedMessage] = useState('');

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/getMovieDetails/${id}`, {
          withCredentials: true,
        });
        const data = response.data;

        if (data && data.length > 0) {
          const movie = data[0];
          setMovieData({
            backgroundImage: `http://localhost:8800/${movie.image_path}`,
            title: `Title: ${movie.title}`,
            description: `Description: ${movie.description}`,
            imagePath: `http://localhost:8800/${movie.image_path}`,
            videoPath: movie.video_path,
          });
        } else {
          console.error('Empty or invalid data received from the API.');
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovieData();
  }, [id]);

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/isInWatchlist/${profileId}/${id}`, {
          withCredentials: true,
        });
        setIsInWatchlist(response.data.isInWatchlist);
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };

    checkWatchlist();
  }, [id, profileId]);

  const handlePlayButtonClick = async () => {
    try {
      // Check if the current user has completed payment
      const paymentResponse = await axios.get(`http://localhost:8800/checkPayment/${currentUser.id}`, {
        withCredentials: true,
      });

      const hasPayment = paymentResponse.data.hasPayment;

      if (hasPayment) {
        // User has completed payment, navigate to play page
        navigate(`/video/${encodeURIComponent(movieData.videoPath)}`);
        console.log("naveen",setMovieData.title)
      } else {
        // User hasn't completed payment, navigate to plans page
        navigate('/plans');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleToggleWatchlist = async () => {
    try {
      if (!addingToWatchlist) {
        setAddingToWatchlist(true);
  
        // Check if the movie is already in the watchlist
        const response = await axios.get(`http://localhost:8800/isInWatchlist/${profileId}/${id}`, {
          withCredentials: true,
        });
  
        if (response.data.isInWatchlist) {
          // Movie is already in watchlist, remove it
          await axios.delete(`http://localhost:8800/removeFromWatchlist/${profileId}/${id}`, {
            withCredentials: true,
          });
  
          // Update the state to reflect the movie being removed from the watchlist
          setIsInWatchlist(false);
          setAddingToWatchlist(false);
          setAddedMessage('Removed from watchlist');
          setTimeout(() => {
            setAddedMessage('');
          }, 3000);
        } else {
          // Add the movie to the watchlist
          await axios.post(`http://localhost:8800/addToWatchlist/${profileId}`, {
            movieId: id,
            title: movieData.title.split(': ')[1],
          }, {
            withCredentials: true,
          });
  
          // Update the state to reflect the movie being in the watchlist
          setIsInWatchlist(true);
          setAddingToWatchlist(false);
          setAddedMessage('Added to watchlist');
          setTimeout(() => {
            setAddedMessage('');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error.response);
      setAddingToWatchlist(false);
    }
  };
  

  return (
    <div className="movie-container">
      <div className='movie-gradient-overlay'>
        <div className="movie-background-image" style={{ backgroundImage: `url(${movieData.backgroundImage})` }}>
          <div className="movie-info-container">
            <div className="logorealm">
              <Link to="/home">
                <RealmLogo />
              </Link>
            </div>
            <h1 className="movie-title">{movieData.title}</h1>
            <p className="movie-description">{movieData.description}</p>
          </div>
          <div className="movie-image-container">
            <img className="movie-image" src={movieData.imagePath} alt={movieData.title} />
          </div>
          <button className="movie-play-button" onClick={handlePlayButtonClick}>
            <PlayArrowIcon className="playicon" />
          </button>
          <button className="movie-watchlist-button" onClick={handleToggleWatchlist}>
  {isInWatchlist ? (
    <RemoveCircleOutlineIcon className="watchlist-icon" />
  ) : (
    <AddCircleOutlineIcon className="watchlist-icon" />
  )}
</button>

          {addedMessage && <p className="added-message">{addedMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Movie;