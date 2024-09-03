import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import styles from './LandingPage.module.css'; // New CSS file for updated styling



const NewLandingPage = () => {
  const videoUrl = '/videos/OTT1.mp4';
  const [showButton, setShowButton] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate(); // Get the navigate function

  // Simulating user authentication status (true if authenticated, false if not)
  const isAuthenticated = true; // Replace this with your actual authentication logic

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      const duration = 7; // Duration in seconds

      const onTimeUpdate = () => {
        if (video.currentTime >= duration) {
          video.pause();
          setShowButton(true);
        }
      };

      const onLoadedMetadata = () => {
        video.play();
        video.addEventListener('timeupdate', onTimeUpdate);
      };

      video.addEventListener('loadedmetadata', onLoadedMetadata);

      return () => {
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('timeupdate', onTimeUpdate);
      };
    }
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect to profiles page if the user is already authenticated
      navigate('/profiles'); // Change '/profiles' to your actual profiles page URL
    } else {
      // Redirect to signin page if the user is not authenticated
      navigate('/login'); // Use navigate function to go to the signin page
    }
  };

  return (
    <div className={styles.newlandingpage}>
      <video autoPlay loop muted className={styles.newbackgroundvideo} ref={videoRef}>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.newcontent}>
        {showButton && (
          <button className={styles.newgetstartedbutton} onClick={handleGetStarted}>
            Get Started  
          </button>
        )}
      </div>
    </div>
  );
};

export default NewLandingPage;
