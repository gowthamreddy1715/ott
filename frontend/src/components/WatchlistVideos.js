import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import styles from './Watchlist.module.css';
import Nav from './Nav';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const ConfirmationPopup = ({ movieName, onCancel, onConfirm }) => (
  <div className={styles.confirmationPopup}>
    <p>{`Are you sure you want to remove "${movieName}" from your watchlist?`}</p>
    <button onClick={onCancel}>Cancel</button>
    <button onClick={onConfirm}>Confirm</button>
  </div>
);

const WatchlistDisplay = () => {
  const { profileId } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [movieIdToRemove, setMovieIdToRemove] = useState(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (profileId) {
      const fetchWatchlist = async () => {
        try {
          const response = await axios.get(`http://localhost:8800/watchlist/${profileId}`, {
            withCredentials: true,
          });

          if (response.data.success) {
            setWatchlist(response.data.watchlist);
          } else {
            console.error('Failed to fetch watchlist:', response.data.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchWatchlist();
    }
  }, [profileId]);

  const removeFromWatchlist = (movieId, movieName) => {
    setShowConfirmation(true);
    setMovieIdToRemove({ movieId, movieName });
  };

  

  const handleRemoveConfirmation = async ({ movieId, movieName }) => {
    setShowConfirmation(false);

    try {
      const response = await axios.delete(`http://localhost:8800/removeFromWatchlist/${profileId}/${movieId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setWatchlist(watchlist.filter((video) => video.movieId !== movieId));
        console.log('Removed from watchlist:', movieId);
      } else {
        console.error('Failed to remove from watchlist:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Nav />
      <div className={styles.videocontainer}>
        <h2 className={styles.videoheader}>Watchlist Videos</h2>
        <div className={styles.videolist}>
          {watchlist.map((video) => (
            <div className={styles.videoitem} key={video.movieId}>
              <Link to={`/movie/${video.movieId}`} className="link" style={{ color: "white" }}>
                <h3 className={styles.videotitle}>{video.uploadTitle}</h3>
                <div className={styles.videothumbnailcontainer}>
                  <img className={styles.videothumbnail} src={`http://localhost:8800/${video.image_path}`} alt="Video Thumbnail" />
                </div>
              </Link>

              <div className={styles.buttonsContainer}>
                <button className={styles.removeButton} onMouseEnter={() => setShowText(true)} onMouseLeave={() => setShowText(false)}>
                  <div className={styles.removeIconContainer} onClick={() => removeFromWatchlist(video.movieId, video.uploadTitle)}>
                    <RemoveCircleOutlineIcon className={styles.removeIcon} />
                    {showText && <span className={styles.removeText}>Remove</span>}
                  </div>
                </button>
                <button onClick={() => window.location.href=`/movie/${video.movieId}`} className={styles.playButton}>
                  <PlayArrowIcon className={styles.playIcon} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationPopup
          movieName={movieIdToRemove.movieName}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={() => handleRemoveConfirmation(movieIdToRemove)}
        />
      )}
    </div>
  );
};

export default WatchlistDisplay;