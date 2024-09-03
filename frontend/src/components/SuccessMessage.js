import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SuccessMessage.module.css';

const SuccessMessage = () => {
  const navigate = useNavigate();

  const handleStartWatching = () => {
    // Handle the logic for starting to watch content
    console.log('Start Watching clicked');
    
    // Redirect to the home page or any other desired route
    navigate('/home');
  };

  return (
    <div className={styles.successMessageContainer}>
      <h1>Subscription Successful</h1>
      <p>Thank you for subscribing to our Realm. You now have access to premium content.</p>
      <p>Enjoy unlimited streaming of your favorite movies and shows.</p>
      <button onClick={handleStartWatching} className={styles.startWatchingButton}>
        Start Watching
      </button>
    </div>
  );
};

export default SuccessMessage;