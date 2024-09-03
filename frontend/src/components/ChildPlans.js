import React from 'react';
import styles from './ChildPlans.module.css';
import RealmLogo from "./RealmLogo";
import { Link } from 'react-router-dom';


const ChildPlans = () => {
  
  return (
    <div>
    <Link to="/ChildHome">  {/* Use Link to make the logo clickable and redirect to the home page */}
      <RealmLogo style={{ marginTop: '100px' }} />
    </Link>
    <div className={styles.container}>
      <h1>Choose a Plan</h1>
      <div className={styles.cardsContainer}>
        {/* First Row: Three Cards */}
        <div className={styles.planCard}>
          {/* Plan 1 */}
          <h2>RECOMMENDED</h2>
          <p>4K · Dolby 5.1 · Telugu + Tamil Movies & Web series · 1 Year</p>
          <div className={styles.planDetails}>
            <p className={styles.price}>INR 899 / year <span className={styles.originalPrice}>₹1499</span></p>
            <br />
            <a href="/ChildPlan1"><button className={styles.subscribeButton}>Subscribe</button></a>
          </div>
        </div>

        <div className={styles.planCard}>
          {/* Plan 2 */}
          <h2>NEW PLAN</h2>
          <p>Telugu Annual Premium Plan</p>
          <p>Full HD (1080p) · Stereo · Telugu Movies & Web series · 1 Year</p>
          <div className={styles.planDetails}>
            <p className={styles.price}>INR 699 / year <span className={styles.originalPrice}>₹1299</span></p>
            <br />
            <a href="/ChildPlan2"><button className={styles.subscribeButton}>Subscribe</button></a>
          </div>
        </div>

        <div className={styles.planCard}>
          {/* Plan 3 */}
          <h2>FIRST TIME ONLY</h2>
          <p>Telugu Quarterly Mobile Plan</p>
          <p>HD (720p) · Stereo · Telugu Movies & Web series · 3 Months · First time subscribers only</p>
          <div className={styles.planDetails}>
            <p className={styles.price}>INR 99 / 3 months</p>
            <br />
            <a href="/ChildPlan3"><button className={styles.subscribeButton}>Subscribe</button></a>
          </div>
        </div>

        {/* Second Row: Two Cards */}
        <div className={styles.planCard}>
          {/* Plan 4 */}
          <h2>Save 43%</h2>
          <p>Telugu Annual Plan</p>
          <p>Full HD (1080p) · Stereo · Telugu Movies & Web series · 1 Year</p>
          <div className={styles.planDetails}>
            <p className={styles.price}>INR 399 / year <span className={styles.originalPrice}>₹699</span></p>
            <br />
            <a href={"/ChildPlan4"}><button className={styles.subscribeButton}>Subscribe</button></a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChildPlans;
