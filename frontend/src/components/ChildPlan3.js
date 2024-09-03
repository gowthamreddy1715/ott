import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ChildPlan3.module.css';
import RealmLogo from "./RealmLogo";

const ChildPlan3 = () => {
  const proceedToPayment = (planName) => {
    // Redirect to the payment page or perform payment processing here
    alert('Proceeding to payment for ' + planName);
    // You can use window.location.href to redirect to a payment page.
  };

  return (
    <div>
    <Link to="/ChildPlans">  {/* Use Link to make the logo clickable and redirect to the home page */}
      <RealmLogo style={{ marginTop: '100px' }} />
    </Link>
    <div className={styles.container}>
      <h1>Plan 3</h1>
      <div className={styles.cardsContainer}>
        {/* Plan 3 Card */}
        <div className={styles.planCard}>
          {/* Plan 3 content */}
          <h2>FIRST TIME ONLY</h2>
          <p>Telugu Quarterly Mobile Plan</p>
          <p>HD (720p) · Stereo · Telugu Movies & Web series · 3 Months · First time subscribers only</p>
          <div className={styles.planDetails}>
            <p className={styles.price}>INR 99 / 3 months</p>
            <br />
           
            <Link to="/ChildPayment/99" className={styles.subscribeButton}>
              Proceed to Payment
            </Link>
         
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChildPlan3;
