import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './PinPage.module.css';
import { AuthContext } from '../context/authContext.js';
import RealmLogo from './RealmLogo';

const PinPage = () => {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [pinInputs, setPinInputs] = useState(['', '', '', '']);
  const [profileDetails, setProfileDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { currentProfile } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8800/profiles/${profileId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile details');
        }

        const data = await response.json();
        if (data.success) {
          setProfileDetails(data.profile);
        } else {
          throw new Error('Failed to fetch profile details');
        }
      } catch (error) {
        console.error('Error in fetchProfileDetails:', error.message);
      }
    };

    fetchProfileDetails();
  }, [profileId]);

  const handlePinInputChange = (index, value) => {
    const newPinInputs = [...pinInputs];

    // Check if the entered value is numeric, if not, set it to an empty string
    const numericValue = /^[0-9]$/.test(value) ? value : '';

    newPinInputs[index] = numericValue;

    if (numericValue === '' && index > 0) {
      // Move focus to the previous input when backspace is pressed
      document.getElementById(`pin-input-${index - 1}`).focus();
    } else if (index < 3 && numericValue !== '') {
      // Move focus to the next input when a digit is entered
      document.getElementById(`pin-input-${index + 1}`).focus();
    }

    setPinInputs(newPinInputs);
    setErrorMessage(''); // Clear error message on PIN input change
  };



 

 


  const handlePinValidation = async () => {
    const enteredPin = pinInputs.join('');

    if (profileDetails) {
      const isChildProfile = profileDetails.isChildProfile === 1;

      if (enteredPin === profileDetails.pin || profileDetails.pin === null) {
        console.log('Correct PIN entered or no PIN found');
        await currentProfile(profileId);

        if (isChildProfile) {
          navigate('/ChildHome');
        } else {
          navigate('/home');
        }
      } else {
        // Set an error message for incorrect PIN
        setErrorMessage('Incorrect PIN. Please try again.');
      }
    } else {
      console.log('No profile details found');
    }
  };
  
  
  
  
  return (
    <div>
      <Link to="/profiles"><RealmLogo /></Link>

      <div className={styles['pin-page-container']}>
        <h2 className={styles.h2}>Enter PIN for {profileDetails && profileDetails.name}</h2>
        <div className={styles['pin-input-container']}>
          {pinInputs.map((value, index) => (
            <input
              key={index}
              id={`pin-input-${index}`}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handlePinInputChange(index, e.target.value)}
              className={styles['pin-input']}
            />
          ))}
        </div>
      
        <button onClick={handlePinValidation} className={styles['pin-button']}>
          Submit
        </button>
      
          
        
        {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}
      </div>
    </div>
  );
};

export default PinPage;
