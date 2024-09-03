import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link from your routing library
import { AuthContext } from '../context/authContext';
import styles from './Watchlist.module.css';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'; 
import NavChild from './NavChild';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";


const WatchlistDisplay = () => {
  const { profileId } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (profileId) {
      const fetchWatchlist = async () => {
        try {
          const response = await axios.get(`http://localhost:8800/watchlist/${profileId}`, {
            withCredentials: true,
          });

          if (response.data.success) {
            console.log('Watchlist Data:', response.data.watchlist);
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
  

  const removeFromWatchlist = async (movieId) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this video from your watchlist?");

    if (!isConfirmed) {
      return;
    }

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
    <NavChild />
    <div className={styles.videocontainer}>
      <h2 className={styles.videoheader}>Watchlist Videos</h2>
      <div className={styles.videolist}>
        {watchlist.map((video) => (
          <div className={styles.videoitem} key={video.movieId}>
            <Link to={`/Childmovie/${video.movieId}`} className="link" style={{ color: "white" }}>
              <h3 className={styles.videotitle}>{video.uploadTitle}</h3>
              <div className={styles.videothumbnailcontainer}>
                <img className={styles.videothumbnail} src={`http://localhost:8800/${video.image_path}`} alt="Video Thumbnail" />
              </div>
            </Link>
           
           
               <div className={styles.buttonsContainer}>
              
              <button onClick={() => removeFromWatchlist(video.movieId)} className={styles.removeButton}>
                <RemoveCircleOutlineIcon className={styles.removeIcon} />
                
              </button>
              <button onClick={() => window.location.href=`/movie/${video.movieId}`} className={styles.playButton}>
                <PlayArrowIcon className={styles.playIcon}  />
              </button>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  
);
};

export default WatchlistDisplay;