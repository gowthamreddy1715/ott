// GenrePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./GenrePage.module.css";
import RealmLogo from "./RealmLogo";

const GenrePage = () => {
  const { genreId } = useParams();
  const [movies, setMovies] = useState([]);
  const [genreName, setGenreName] = useState("");

  useEffect(() => {
    // Fetch genre name from the server based on genreId
    axios
      .get(`http://localhost:8800/getGenreName/${genreId}`)
      .then((response) => {
        setGenreName(response.data.genreName);
      })
      .catch((error) => {
        console.error("Error fetching genre name:", error);
      });

    // Fetch movies by genre
    axios
      .get(`http://localhost:8800/getMoviesByGenreOne/${genreId}`)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies by genre:", error);
      });
  }, [genreId]);

  return (
    <div>
      <Link to="/home"><RealmLogo /></Link> 
   
    <div>
      <h2
        style={{
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
          textDecoration:"none"
        }}
      >
        {genreName}
      </h2>
      <div className={styles.moviethumbnailscontainer}>
        {movies.map((movie) => (
          <div key={movie.id} className={styles.moviethumbnail1}>
            <Link to={`/movie/${movie.id}`} className="link">
              <img
                src={`http://localhost:8800/${movie.image_path}`}
                alt={movie.title}
              />
              <div className={styles.content1}>
                <h2>{movie.title}</h2>
                <p>{movie.description}</p>
                <button className={styles.playbutton1}>Play</button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default GenrePage;