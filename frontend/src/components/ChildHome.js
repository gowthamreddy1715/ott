// ChildHome.js
import React from "react";

import "./Home.css"; // You can reuse the styles from Home.css
import ChildThumbnails from "./ChildThumbnails"; // Import the ChildThumbnails component

import Hoverchild from "./HoverChild";
import NavChild from "./NavChild";

const ChildHome = () => {
  return (
    <div>
      <header>
    <NavChild/>
      </header>
      <div className="vid">
        <Hoverchild/>
      </div>
      <div className="thumbnails-container">
        <ChildThumbnails /> {/* Use the ChildThumbnails component here */}
      </div>
    </div>
  );
};

export default ChildHome;