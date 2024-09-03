import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Nav from "./NavChild";



import styles from "./ChildMovies.module.css"; // You may want to create a separate CSS file for ChildMovies styles
import { FaSearch, FaMicrophone, FaTimes } from "react-icons/fa";

const ChildMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    // Assuming you have an authentication system to get the user's profileId
    const profileId = 1; // Replace with actual profileId retrieval logic

    fetch(`http://localhost:8800/getChildFriendlyMovies?isChildProfile=true`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch child-friendly movie details");
        }
      })
      .then((data) => {
        setMovies(data);
        setFilteredMovies(data); // Initially, set filteredMovies to all child-friendly movies
      })
      .catch((error) => {
        console.error("Error fetching child-friendly movie details:", error);
        // Handle error state or log the error message
      });
  }, []);

  return (
    <div className={styles.childMovies}>
      <header>
        <Nav />
      </header>

      <div className={styles.childMoviesContainer}>
        {/* Display child-friendly movies with proper order and hover effect */}
        <div className={styles.childMoviesGrid}>
          {filteredMovies.map((movie, index) => (
            <NavLink to={`/movie/${movie.id}`} key={index} className={styles.childMoviesCard}>
              <div className={styles.childMoviesImgBox}>
                <img
                  src={`http://localhost:8800/${movie.image_path}`}
                  alt={movie.title}
                />
              </div>
              <div className={styles.childMoviesContent}>
                <h2>{movie.title}</h2>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildMovies;