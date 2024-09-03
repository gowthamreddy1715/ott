import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Restrict.module.css";
import Nav from "./Nav";

const UserProfilesDropdown = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [movieTitles, setMovieTitles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState({ id: "", name: "" });
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [showUnblockPopup, setShowUnblockPopup] = useState(false);
  const [showUnblockConfirmation, setShowUnblockConfirmation] = useState(false);
  const [movieToUnblock, setMovieToUnblock] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [restrictedMovies, setRestrictedMovies] = useState([]);
  const navigate = useNavigate();

  const showSuccessPopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };


  const filteredMovies = restrictedMovies.filter((movie) =>
  movie.toLowerCase().includes(searchQuery.toLowerCase())
);


  

  const showUnblockSuccessPopup = () => {
    setShowUnblockPopup(true);
    setTimeout(() => {
      setShowUnblockPopup(false);
    }, 3000);
  };

  const resetForm = () => {
    setSelectedProfile({ id: "", name: "" });
    setSelectedMovies([]);
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("http://localhost:8800/profiles", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          setProfiles(response.data.profiles);
        } else {
          throw new Error("Failed to fetch profiles");
        }
      } catch (error) {
        console.error("Error fetching profiles:", error.message);
      }
    };

    const fetchMovieTitles = async () => {
      try {
        const response = await axios.get("http://localhost:8800/movie-titles", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          setMovieTitles(response.data.titles);
        } else {
          throw new Error("Failed to fetch movie titles");
        }
      } catch (error) {
        console.error("Error fetching movie titles:", error.message);
      }
    };

    fetchProfiles();
    fetchMovieTitles();
  }, []);

  const saveMovieDetails = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8800/save-movies",
        {
          profileId: selectedProfile.id,
          profileName: selectedProfile.name,
          movieTitles: selectedMovies,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        showSuccessPopup();
        resetForm();
      } else {
        throw new Error("Failed to save movie details");
      }
    } catch (error) {
      console.error("Error saving movie details:", error.message);
    }
  };

 
  

  const handleUnblock = async (movieTitle) => {
    try {
      const response = await axios.delete(
        `http://localhost:8800/unblock-movie/${selectedProfile.id}/${encodeURIComponent(movieTitle)}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setRestrictedMovies((prevRestrictedMovies) =>
          prevRestrictedMovies.filter((title) => title !== movieTitle)
        );
        setShowUnblockConfirmation(true);
        showUnblockSuccessPopup();
        
      } else {
        throw new Error("Failed to unblock movie");
      }
    } catch (error) {
      console.error("Error unblocking movie:", error.message);
    }
  };

  useEffect(() => {
    const fetchRestrictedMovies = async () => {
      try {
        if (selectedProfile.id) {
          const response = await axios.get(`http://localhost:8800/restricted-movies/${selectedProfile.id}`, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.data.success) {
            setRestrictedMovies(response.data.restrictedMovies);
          } else {
            throw new Error("Failed to fetch restricted movies");
          }
        }
      } catch (error) {
        console.error("Error fetching restricted movies:", error.message);
      }
    };

    fetchRestrictedMovies();
  }, [selectedProfile.id]);

  const filteredProfiles = profiles.slice(1);
  const filteredMovieTitles = movieTitles.filter((title) => !restrictedMovies.includes(title));

  const navigateToProfile = (e) => {
    const selectedProfileId = e.target.value;
    const selectedProfileName = e.target.options[e.target.selectedIndex].text;

    setSelectedProfile({
      id: selectedProfileId,
      name: selectedProfileName,
    });
  };

  const handleMovieSelection = (selectedMovieValues) => {
    setSelectedMovies(selectedMovieValues);
  };

  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <div className={styles.row}>
          {/* Left Column - Blocking Form */}
          <div className={styles.colmd6}>
            <h2 className={styles.h1}>Restrict Movies</h2>
            <form
              className={styles.userprofilesdropdownform}
              onSubmit={(e) => {
                e.preventDefault();
                saveMovieDetails();
              }}
            >
              <h2 className={styles.userprofilesdropdownheading}>Select Profile </h2>
              <select
                className={styles.userprofilesdropdownselect}
                onChange={navigateToProfile}
                value={selectedProfile.id}
              >
                <option value="" disabled>
                  Select a Profile
                </option>
                {filteredProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>

              <h2 className={styles.userprofilesdropdownheading}>Select Movies</h2>
              <select
                className={styles.userprofilesdropdownselect}
                multiple
                onChange={(e) =>
                  handleMovieSelection(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
              >
                <option value="" disabled>
                  Select Movies
                </option>
                {filteredMovieTitles.map((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </select>

              <button className={styles.userprofilesdropdownbutton} type="submit">
                Block
              </button>
            </form>
            {showPopup && (
              <div className={styles.userprofilesdropdownpopup}>
                <svg className={styles.popupsvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="green" d="M20.3 5.7c-.4-.4-1-.4-1.4 0l-9 9-4.3-4.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l5 5c.2.2.5.3.7.3s.5-.1.7-.3l10-10c.4-.4.4-1 0-1.4z" />
                </svg>
                <p className={styles.popuptext}>Movies blocked successfully!</p>
              </div>
            )}
          </div>

          {/* Right Column - Blocked Movies */}
          <div className={styles.colmd6}>
       
            {selectedProfile.id && (
                
              <div className={styles.mainContainer}>
              {/* <h2>Blocked Movies for {selectedProfile.name}</h2> */}
             
             
              <div className={styles.blockedMoviesContainer}>
  <input
    type="text"
    placeholder={`Search blocked movies for ${selectedProfile.name}`}
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  {filteredMovies.length > 0 ? (
    <ul>
      {filteredMovies.map((movie, index) => (
        <li key={index}>
          {movie}
          <button
            className={`${styles.unblockButton} ${styles.popupButton}`}
            onClick={() => handleUnblock(movie)}
          >
            Unblock
          </button>
        </li>
      ))}
    </ul>
  ) : (
    searchQuery.trim() === '' ? (
      <p className={styles.message}>No movies are blocked for {selectedProfile.name}.</p>
    ) : (
      <p className={styles.message}>Nothing matched your search for {selectedProfile.name}.</p>
    )
  )}
</div>

              </div>
            )}
          </div>
        </div>
      </div>
      {showUnblockPopup && (
        <div className={styles.userprofilesdropdownpopup}>
          <svg className={styles.popupsvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="green" d="M20.3 5.7c-.4-.4-1-.4-1.4 0l-9 9-4.3-4.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l5 5c.2.2.5.3.7.3s.5-.1.7-.3l10-10c.4-.4.4-1 0-1.4z" />
          </svg>
          <p className={styles.popuptext}>Movie unblocked successfully!</p>
        </div>
      )}
    </div>
  );
};

export default UserProfilesDropdown;
