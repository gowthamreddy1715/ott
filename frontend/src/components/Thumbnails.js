import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import styles from "./Thumbnails.module.css";
import { AuthContext } from "../context/authContext";

const Thumbnails = ({ profileId }) => {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [currentPositions, setCurrentPositions] = useState({});
  const containerRefs = useRef({});
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredGenreId, setHoveredGenreId] = useState(null);
  const [watchlist, setWatchlist] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
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
  const [clickCountLeft, setClickCountLeft] = useState(0);
  const [clickCountRight, setClickCountRight] = useState(0);

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
    axios
      .get("http://localhost:8800/genres")
      .then((response) => {
        const genresData = response.data;
        setGenres(genresData);
        const initialPositions = {};
        genresData.forEach((genre) => {
          initialPositions[genre.genre] = 0;
        });
        setCurrentPositions(initialPositions);
        fetchMoviesByGenre(genresData);
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });

    fetchWatchlistData();

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  const fetchMoviesByGenre = (genres) => {
    const genrePromises = genres.map((genre) => {
      return axios
        .get(`http://localhost:8800/getMoviesByGenre/${genre.id}/${profileId}`)
        .then((response) => response.data)
        .catch((error) => {
          console.error(
            `Error fetching movies for genre ${genre.genre}:`,
            error
          );
          return [];
        });
    });

    Promise.all(genrePromises)
      .then((results) => {
        const moviesByGenreObject = {};
        results.forEach((movies, index) => {
          moviesByGenreObject[genres[index].genre] = movies;
        });
        setMoviesByGenre(moviesByGenreObject);
      })
      .catch((error) => {
        console.error("Error fetching movies by genre:", error);
      });
  };

  const fetchWatchlistData = () => {
    axios.get(`http://localhost:8800/watchlist/${profileId}`)
      .then(response => {
        setWatchlist(response.data);
      })
      .catch(error => {
        console.error('Error fetching watchlist data:', error);
      });
  };

  const handleForwardClick = (genre) => {
    if (clickCountRight < 4) {
      const containerWidth = containerRefs.current[genre].offsetWidth;
      const numMovies = moviesByGenre[genre]?.length || 0;
      const maxThumbnailsToShow = Math.min(4, numMovies); // Maximum number of thumbnails to show
      const maxPosition = containerWidth * (numMovies - maxThumbnailsToShow); // Calculate the maximum position based on the number of thumbnails
    
      // Calculate the new position by moving the container width / 6
      let newPosition = currentPositions[genre] + containerWidth / 6;
    
      // Ensure the newPosition doesn't exceed the maximum position or go beyond the last thumbnail
      newPosition = Math.min(newPosition, maxPosition, containerWidth * (numMovies - 1));
    
      // Check if there are enough thumbnails to display after the current position
      if (newPosition >= maxPosition) {
        newPosition = currentPositions[genre]; // If not, keep the current position
      }
    
      setCurrentPositions({
        ...currentPositions,
        [genre]: newPosition
      });

      setClickCountRight(clickCountRight + 1);
    } else {
      // Reset the click count and positions
      setClickCountRight(0);
      setCurrentPositions({ ...currentPositions, [genre]: 0 });
    }
  };

  const handleBackwardClick = (genre) => {
    if (clickCountLeft < 4) {
      const containerWidth = containerRefs.current[genre].offsetWidth;
    
      // Calculate the new position by moving the container width / 6
      const newPosition = currentPositions[genre] - containerWidth / 6;
    
      // Ensure the newPosition doesn't go below 0
      setCurrentPositions({
        ...currentPositions,
        [genre]: Math.max(newPosition, 0)
      });

      setClickCountLeft(clickCountLeft + 1);
    } else {
      // Reset the click count and positions
      setClickCountLeft(0);
      setCurrentPositions({ ...currentPositions, [genre]: 0 });
    }
  };

  const handleBodyClick = (event) => {
    if (
      Object.values(containerRefs.current).some(ref =>
        ref.contains(event.target)
      ) ||
      event.target.closest(".card")
    ) {
      return;
    }

    setShowNotifications(false);
  };

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setShowNotifications(true);
  };

  const handleToggleWatchlist = async (movieId, title) => {
    try {
      setAddingToWatchlist(true);

      // Check if the movie is already in the watchlist
      const response = await axios.get(`http://localhost:8800/isInWatchlist/${profileId}/${movieId}`, {
        withCredentials: true,
      });

      const isInWatchlist = response.data.isInWatchlist;

      if (isInWatchlist) {
        // Movie is already in watchlist, remove it
        await axios.delete(`http://localhost:8800/removeFromWatchlist/${profileId}/${movieId}`, {
          withCredentials: true,
        });
        setWatchlist(prevWatchlist => {
          const updatedWatchlist = { ...prevWatchlist };
          delete updatedWatchlist[movieId];
          return updatedWatchlist;
        });
      } else {
        // Add the movie to the watchlist
        await axios.post(`http://localhost:8800/addToWatchlist/${profileId}`, {
          movieId: movieId,
          title: title,
        }, {
          withCredentials: true,
        });
        setWatchlist(prevWatchlist => {
          return { ...prevWatchlist, [movieId]: true };
        });
      }

      setAddingToWatchlist(false);
      setAddedMessage(isInWatchlist ? 'Removed from watchlist' : 'Added to watchlist');
      setTimeout(() => {
        setAddedMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error toggling watchlist:', error.response);
      setAddingToWatchlist(false);
    }
  };

  return (
    <div>
      {showNotifications && (
        <div className={styles.notification}>
          {/* Notification content goes here */}
        </div>
      )}

      {genres.map((genre) => (
        <div key={genre.genre}>
          <Link
            to={`/genre/${genre.id}`}
            className={styles.genrelink}
            onClick={() => handleGenreClick(genre.id)}
            onMouseEnter={() => setHoveredGenreId(genre.id)}
            onMouseLeave={() => setHoveredGenreId(null)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <h2 className={styles.genretitle}>{genre.genre}</h2>
              </div>
              {hoveredGenreId === genre.id && (
                <div style={{ marginLeft: "10px" }}>
                  <p
                    style={{
                      color: "orangered",
                      marginBottom: "3%",
                      fontSize: "15px",
                      fontWeight: "light",
                      textDecoration: "none",
                    }}
                  >
                    Explore All >
                  </p>
                </div>
              )}
            </div>
          </Link>

          <div className={styles.slidercontainer}>
          <button onClick={() => handleBackwardClick(genre.genre)}>
              <ChevronLeftIcon className={styles.arrow}  style={{ fontSize: 80 }}/>
            </button>
            <div
              className={styles.container}
              ref={(ref) => containerRefs.current[genre.genre] = ref}
              style={{ transform: `translateX(-${currentPositions[genre.genre]}px)` }}
            >
              {moviesByGenre[genre.genre]?.map((movie, index) => (
                <div key={index} className={styles.card}>
                  <div className={styles.imgbox}>
                    <img
                      src={`http://localhost:8800/${movie.image_path}`}
                      alt={movie.title}
                    />
                  </div>
                  <div className={styles.content}>
                    
                    <h2 className={styles.movietitle}>{movie.title}</h2>
                    <p className={styles.moviedesc}>{movie.description}</p>
                    <div className={styles.buttonContainer}>
                    <Link to={`/movie/${movie.id}`}>

<button className={styles.playbutton}>

  Play

</button>
</Link>
                      <button onClick={() => handleToggleWatchlist(movie.id, movie.title)} className={styles.watchlisticon}>
                        {watchlist[movie.id] ? (
                          <RemoveCircleOutlineIcon className={styles.watchlisticon} />
                        ) : (
                          <AddCircleOutlineIcon className={styles.watchlisticon} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => handleForwardClick(genre.genre)}>
              <ChevronRightIcon className={styles.arrow2}  style={{ fontSize: 80 }}/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Thumbnails;