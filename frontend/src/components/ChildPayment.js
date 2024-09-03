import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import styles from './ChildPay.module.css';
import RealmLogo from "./RealmLogo";

const Payment = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [amount, setAmount] = useState('');
  const { currentUser } = useContext(AuthContext);
  const [showMessage, setShowMessage] = useState(false);
  const { price } = useParams();
  const validPrices = [399, 899, 699, 99];
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setAmount(price);

    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        setScriptLoaded(true);
      };

      script.onerror = (error) => {
        console.error('Error loading Razorpay script:', error);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    const initializeRazorpay = () => {
      if (!window.Razorpay) {
        console.error('Razorpay script not loaded');
        return;
      }

      const options = {
        key: 'rzp_test_JtZCJ9mkNvIlPA',
        amount: amount * 100,
        currency: 'INR',
        name: 'Defenders',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        handler: function (response) {
          setShowMessage(true);
          savePaymentDetails(response);
          window.location.href = '/success';
        },
        prefill: {
          name: 'deferences',
          email: 'realm@gmail.com',
          contact: '7997653497',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };

      try {
        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
        });

        document.getElementById('rzp-button1').onclick = function (e) {
          // Check if the entered amount is valid before proceeding to payment
          if (!validPrices.includes(Number(amount))) {
            setError('Invalid plan!! Please select a valid plan.');
            setShowMessage(true);
          } else {
            setError('');
            setShowMessage(false);
            rzp.open();
          }
          e.preventDefault();
        };

        console.log('Razorpay initialized successfully');
      } catch (error) {
        console.error('Error initializing Razorpay:', error);
      }
    };

    const cleanup = loadRazorpayScript();

    if (scriptLoaded) {
      initializeRazorpay();
    }

    return () => {
      cleanup();
    };
  }, [scriptLoaded, amount, price]);

  useEffect(() => {
    if (showMessage) {
      const timeoutId = setTimeout(() => {
        setShowMessage(false);
        navigate('/plans');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [showMessage, navigate]);

  const savePaymentDetails = async (response) => {
    try {
      const timestamp = Date.now();
      console.log("User ID:", currentUser.id);

      const paymentData = {
        userId: currentUser.id,
        amount: amount,
        timestamp,
        // Add other relevant payment details here
      };

      await axios.post('http://localhost:8800/savePayment', paymentData, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Payment details saved successfully');
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  return (
    <div>
      <Link to="/ChildHome">
        <RealmLogo style={{ marginTop: '100px' }} />
      </Link>

      <div className={styles.payContainer}>
        <h1 className={styles.payHeader}>Secure Payment</h1>
        <div className={styles.formGroup}>
          <label htmlFor="amount" className={styles.label}>
            Amount
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.inputField}
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>} {/* Error Message */}
        <button id="rzp-button1" className={styles.payButton}>
          Pay with Razorpay
        </button>
      </div>

      {/* Popup Error Message */}
      {showMessage && (
        <div className={styles.popup}>
          <p className={styles.popupText}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;