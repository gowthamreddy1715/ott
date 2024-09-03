// Loader.js
import React from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <img src="/images/loader3.gif" alt="Loading spinner" />
    </div>
  );
};

export default Loader;
