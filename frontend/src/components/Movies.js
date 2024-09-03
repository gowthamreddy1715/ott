import React, { useState, useEffect,useContext } from "react";
import { NavLink } from "react-router-dom";
import Nav from "./Nav";
import { AuthContext } from '../context/authContext';

import "./Nav.css";
import styles from "./MoviesPage.module.css"; // Import the MoviesPage.css file for styles
import { FaSearch, FaMicrophone, FaTimes } from "react-icons/fa";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const { profileId } = useContext(AuthContext);

  const imageSrc =
    "https://images.yourstory.com/cs/2/96eabe90392211eb93f18319e8c07a74/Image5mxv-1689948556123.jpg?w=1152&fm=auto&ar=2:1&mode=crop&crop=faces";
  const videoSrc = "Videos/U-Turn.mp4";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`http://localhost:8800/getMovieDetailsSearch?profileId=${profileId}`);
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
          setFilteredMovies(data); // Initially, set filteredMovies to all movies
        } else {
          throw new Error("Failed to fetch movie details");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        // Handle error state or log the error message
      }
    };

    fetchMovies();
  }, [profileId]);

  return (
    <div className={styles.movies2}>
      <header>
        <Nav />
      </header>
  

  
      <div className={styles.movies2Container}>
        {/* Display filtered movies with proper order and hover effect */}
        
          <div className={styles.movies2Grid}>
            {filteredMovies.map((movie, index) => (
             <NavLink to={`/movie/${movie.id}`} key={index} className={styles.movies2card}>
                <div className={styles.movies2imgbox}>
                  <img
                    src={`http://localhost:8800/${movie.image_path}`}
                    alt={movie.title}
                  />
                </div>
                <div className={styles.movies2content}>
                  <h2>{movie.title}</h2>
                </div>
              </NavLink>
            ))}
          </div>
        
      </div>
    </div>
  );
};

export default MoviesPage;