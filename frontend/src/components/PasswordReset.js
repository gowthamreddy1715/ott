import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RealmLogo from './RealmLogo';
import styles from './PasswordReset.module.css';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const navigate = useNavigate(); // Access the navigate function

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const resetPassword = () => {
    axios
      .post('http://localhost:8800/reset-password', { newPassword, confirmPassword })
      .then((response) => {
        setResetMessage('Password changed successfully.'); // Set success message after password reset
        setTimeout(() => {
          navigate('/login'); // Navigate to the sign-in page after 2 seconds
        }, 2000); // 2000 milliseconds = 2 seconds
      })
      .catch((error) => {
        setResetError('Failed to reset password. Please try again.');
        console.error('Error:', error);
      });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please re-enter.');
      return;
    }

    resetPassword();
  };

  return (
    <div>
      <RealmLogo />
      {resetMessage && <div className={styles.successmessage}>{resetMessage}</div>}
      <div className={styles.passwordresetcontainer}>
        <h2 className={styles.HEADING}>Password Reset</h2>
        <form onSubmit={handleResetSubmit} className={styles.passwordresetform}>
          {resetError && <div className={styles.errormessage}>{resetError}</div>}
         
          <div className={styles.formgroup}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <button type="submit" className={styles.rbtn}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
