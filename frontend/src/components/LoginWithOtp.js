import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from './firebase';


const Otp = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      const formattedPhoneNumber = `+91${phoneNumber}`;
      const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
      const result = await firebase.auth().signInWithPhoneNumber(formattedPhoneNumber, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error.message);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const code = verificationCode.join('');
      await confirmationResult.confirm(code);
      console.log('OTP verified successfully');
      navigate("/home");
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
    }
  };


  
  const handleInputChange = (index, value) => {
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;

    if (value && index < newVerificationCode.length - 1) {
      // Move to the next input box
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    setVerificationCode(newVerificationCode);
  };

  return (
    <div className='container-fluid2'>
      <div className="login-container" style={{ marginTop: '15%' }}>
        <h2>Enter Details</h2>

        {!otpSent && (
          <>
            <input type="text" placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder='Your Phone Number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <button onClick={handleSendOTP}>Send OTP</button>
          </>
        )}

        {otpSent && confirmationResult && (
          <div>
            <label>Verification Code:</label>
            <div className="otp-input-container">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={verificationCode[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              ))}
            </div>
            <br />

            <button onClick={handleVerifyOTP}>Verify OTP</button>
          </div>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Otp;