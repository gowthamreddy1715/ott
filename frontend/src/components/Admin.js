// Import necessary libraries and components
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import axios from 'axios';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styles from './Admin.module.css';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import RealmLogo from './RealmLogo';

const AdminComponent = () => {
  const [movieTitles, setMovieTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMovieList, setShowMovieList] = useState(false);
  const [showUsernames, setShowUsernames] = useState(false);

  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const fetchMovieTitles = async () => {
      try {
        const response = await axios.get('http://localhost:8800/movie-titles');
        if (response.data.success) {
          setMovieTitles(response.data.titles);
        } else {
          console.error('Failed to fetch movie titles');
        }
      } catch (error) {
        console.error('Error fetching movie titles:', error.message);
      }
    };

    const fetchUsernames = async () => {
      try {
        const response = await axios.get('http://localhost:8800/users');
        if (response.data.success) {
          setUsernames(response.data.usernames);
        } else {
          console.error('Failed to fetch usernames');
        }
      } catch (error) {
        console.error('Error fetching usernames:', error.message);
      }
    };

    fetchMovieTitles();
    fetchUsernames();
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      await axios.post("http://localhost:8800/decrement-device-count", {
        userId: currentUser.id,
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (title) => {
    try {
      const response = await axios.post('http://localhost:8800/delete-movie-titles', { title });
      if (response.data.success) {
        setMovieTitles((prevTitles) => prevTitles.filter((t) => t !== title));
      } else {
        console.error('Failed to delete movie title');
      }
    } catch (error) {
      console.error('Error deleting movie title:', error.message);
    }
  };

  const filteredMovieTitles = movieTitles.filter((title) =>
    title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className={styles.header}>
        <RealmLogo />
        <div className={styles.headerButtonsContainer}>
        <Link to="/upload" className={`${styles.headerButton} ${styles.uploadLink}`}>
            Upload Movie
          </Link>
          <button
            className={`${styles.headerButton} ${showMovieList ? styles.active : ''}`}
            onClick={() => {
              setShowMovieList(true);
              setShowUsernames(false);
            }}
          >
            Movies List  {movieTitles.length}
          </button>
          <button
  className={`${styles.headerButton} ${showUsernames ? styles.active : ''}`}
  onClick={() => {
    setShowMovieList(false);
    setShowUsernames(true);
  }}
>
  <PeopleOutlineIcon />
  <span className="count">{usernames.length}</span>
</button>
          <Link to="/login" className={styles.headerButton} onClick={handleLogoutClick}>
            <ExitToAppIcon />
          </Link>
        </div>
      </header>
     <hr></hr>

      {showMovieList && (
        <div className={styles.moviesAndUsernamesContainer}>
          <div className={styles.movieTitlesContainer}>
            <input
              type="text"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul className={styles.movieTitlesList}>
              {filteredMovieTitles.map((title, index) => (
                <li key={index}>
                  {title}
                  <button onClick={() => handleDelete(title)}>
                    <DeleteOutlineIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showUsernames && (
        <div className={styles.moviesAndUsernamesContainer}>
          <div className={styles.usernamesContainer}>
            <h3>Users</h3>
            <ul className={styles.usernamesList}>
              {usernames.map((username, index) => (
                <li key={index}>{username}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComponent;
