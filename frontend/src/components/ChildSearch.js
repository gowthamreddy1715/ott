
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { FaSearch, FaMicrophone, FaTimes } from "react-icons/fa";
import RealmLogo from './RealmLogo';
import styles from "./ChildSearch.module.css"; // Make sure to import your CSS module

const ChildSearch = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch child-friendly movie details from the backend
    fetch("http://localhost:8800/getChildFriendlyMovies?isChildProfile=true")
    .then((response) => response.json())
    .then((data) => {
      setMovies(data);
      setFilteredMovies(data); // Initially, set filteredMovies to all movies

      // Check for query parameter 'search' in URL
      const params = new URLSearchParams(location.search);
      const searchParam = params.get('search');

      if (searchParam) {
        setSearchTerm(searchParam);
        handleSearch(searchParam);
      }
    })
    .catch((error) => {
      console.log("Error fetching movie details:", error);
    });
}, [location.search]); // Run useEffect when location.search changes

const handleSearch = (searchTerm) => {
  setSearchTerm(searchTerm);
  if (searchTerm.trim() === "") {
    // If search term is empty, show all movies
    setFilteredMovies(movies);
  } else {
    const soundex = (str) => {
      // Implementation of a simple Soundex algorithm
      const chars = str.toLowerCase().split('');
      const firstLetter = chars.shift();
      const mappedChars = chars.map((char) => {
        switch (char) {
          case 'b':
          case 'f':
          case 'p':
          case 'v':
            return '1';
          case 'c':
          case 'g':
          case 'j':
          case 'k':
          case 'q':
          case 's':
          case 'x':
          case 'z':
            return '2';
          case 'd':
          case 't':
            return '3';
          case 'l':
            return '4';
          case 'm':
          case 'n':
            return '5';
          case 'r':
            return '6';
          default:
            return '';
        }
      });

      const cleaned = mappedChars
        .filter((char, index, arr) => char !== arr[index - 1])
        .join('')
        .replace(/0/g, '');

      const soundexCode =
        (firstLetter.toUpperCase() +
          cleaned.substring(0, 3).padEnd(3, '0')).substring(0, 4) +
        cleaned.substring(3).padEnd(3, '0');

      return soundexCode;
    };

    const searchTermSoundex = soundex(searchTerm);

    const filtered = movies.filter((movie) => {
      const movieTitleSoundex = soundex(movie.title);

      return (
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movieTitleSoundex === searchTermSoundex
      );
    });

    setFilteredMovies(filtered);
  }
};


// Function to handle voice search
const handleVoiceSearch = () => {
  if (!voiceSearchActive) {
    setVoiceSearchActive(true);
    inputRef.current.focus();
    const recognition = new window.webkitSpeechRecognition(); // For Chrome
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      handleSearch(transcript);
    };

    recognition.start();

    recognition.onend = () => {
      setVoiceSearchActive(false);
    };
  }
};

// Function to clear the search term
const clearSearch = () => {
  setSearchTerm("");
  inputRef.current.focus();
  handleSearch("");
};

const handleChange = (event) => {
  handleSearch(event.target.value);
};

return (

  <div>
  <Link to="/home"><RealmLogo/></Link>
  <div className={styles.search1}>
 
    <div className={styles.searchbar}>
      <div className={styles.searchinput}>
        <input
          type="text"
          placeholder={
            voiceSearchActive ? "Listening..." : "Search movies..."
          }
          value={searchTerm}
          onChange={handleChange}
          ref={inputRef}
        />
        {searchTerm && (
          <FaTimes className={styles.clearicon} onClick={clearSearch} />
        )}
        <FaSearch className={styles.searchicon} />
        <FaMicrophone
        className={voiceSearchActive ? `${styles.microphoneicon} ${styles.active}` : styles.microphoneicon}
        onClick={handleVoiceSearch}
        />
      </div>
    </div>

    <div className={styles.searchcontainer2}>
      {/* Display filtered movies with proper order and hover effect */}
      {filteredMovies.length === 0 && searchTerm !== "" /* Check if search term is not empty */ ? (
        <p className={styles.alert}>Results not found</p>
      ) : (
        filteredMovies.map((movie, index) => (
          <NavLink to={`/movie/${movie.id}`} key={index}>
            <div className={styles.searchcard} key={index}>
              <div className={styles.searchimgbox}>
                <img
                  src={`http://localhost:8800/${movie.image_path}`}
                  alt={movie.title}
                />
              </div>
              <div className={styles.searchcontent}>
                <h2>{movie.title}</h2>
              </div>
            </div>
          </NavLink>
        ))
      )}
    </div>
  </div>
  </div>
);
};

export default ChildSearch;