// Home.js
import React, { useContext } from "react";
import Nav from "./Nav";
import "./Home.css";
import Thumbnails from "./Thumbnails";
import Hover from "./Hover";
import { AuthContext } from "../context/authContext";


const Home = () => {
  const {profileId} = useContext(AuthContext)
  return (
    <div>
      <header>
        <Nav />
      </header>
      <div className="vid">
        <Hover />
      </div>
      <div className="thumbnails-container">
        <Thumbnails profileId={profileId}/>
      </div>
    </div>
  );
};
export default Home;
