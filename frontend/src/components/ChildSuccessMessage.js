import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChildSuccessMessage.module.css';
import RealmLogo from "./RealmLogo";
import { Link } from 'react-router-dom';

const ChildSuccessMessage = () => {
  const navigate = useNavigate();

  const handleStartWatching = () => {
    // Handle the logic for starting to watch content
    console.log('Start Watching clicked');
    
    // Redirect to the home page or any other desired route
    navigate('/ChildHome');
  };

  return (
    <div>
    <Link to="/ChildHome">  {/* Use Link to make the logo clickable and redirect to the home page */}
      <RealmLogo style={{ marginTop: '100px' }} />
    </Link>
    <div className={styles.successMessageContainer}>
      <h1>Subscription Successful</h1>
      <p>Thank you for subscribing to our Realm. You now have access to premium content.</p>
      <p>Enjoy unlimited streaming of your favorite movies and shows.</p>
      <button onClick={handleStartWatching} className={styles.startWatchingButton}>
        Start Watching
      </button>
    </div>
    </div>
  );
};

export default ChildSuccessMessage;
