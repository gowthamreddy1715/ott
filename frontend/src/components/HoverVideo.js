import React, { useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styles from "./Hovervideo.module.css";
import { Link } from "react-router-dom";

const HoverVideo = ({ imageSrc, videoSrc, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playButtonHovered, setPlayButtonHovered] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative", width: "100%", height: "500px" }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {videoSrc && isHovered ? (
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={imageSrc}
            alt="Thumbnail"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "20px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: "30px",
          }}
        >
          {isMuted ? (
            <VolumeOffIcon
              className={styles.volumeoff}
              style={{
                fontSize: "50px",
                marginBottom: "10px",
              }}
            />
          ) : (
            <VolumeUpIcon
              className={styles.volumeon}
              style={{
                fontSize: "50px",
                marginBottom: "10px",
              }}
            />
          )}
        </button>

        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            textAlign: "left",
            color: "white",
            padding: "10px",
          }}
        >
          <h2
            className={styles.title}
            style={{
              margin: 0,
              fontSize: "3em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "1.2em",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              width: "450px",
              marginBottom: "50px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {description}
          </p>
          <Link to="/hoverplayer">
            <PlayArrowIcon
              className={styles.playButton}
              onMouseEnter={() => setPlayButtonHovered(true)}
              onMouseLeave={() => setPlayButtonHovered(false)}
              style={{
                fontSize: "3em",
                color: playButtonHovered ? "white" : "white",
                cursor: "pointer",
                marginLeft: "-8px",
                paddingLeft: "13px",
                paddingRight: "13px",
              }}
            />
            </Link>
            <Link to="#" onClick={() => setIsInfoPopupOpen(!isInfoPopupOpen)}>
            <InfoOutlinedIcon
              className={styles.infoButton}
              style={{
                fontSize: "3em",
                color: playButtonHovered ? "white" : "white",
                cursor: "pointer",
                marginLeft: "4.5%",
                paddingLeft: "13px",
                paddingRight: "13px",
              }}
            />
            </Link>
          
        </div>
      </div>

      {/* Info Popup */}
      {isInfoPopupOpen && (
        <div className={styles.popupcontainer}>
          <div className={styles.popupcontent}>
            <h2 className={styles.popuptitle}>{title}</h2>
            <p className={styles.popupdescription}>{description}</p>
            
            <p>
      <b>Cast :</b>  <br />
      Nani as Viraj, <br />
      Mrunal Thakur as Yashna / Varsha (voice dubbed by Chinmayi), <br />
      Kiara Khanna as Mahi, Viraj and Varsha's daughter, <br />
      Ritika Nayak in a cameo appearance as Adult Mahi, <br />
      Nassar as Dr. Ranjan, <br />
      Jayaram as Varsha and Neha's father; Viraj's father-in-law and Mahi's grandfather, <br />
      Priyadarshi Pulikonda as Justin, Viraj's friend
    </p>
            <button
              className={styles.popupbutton}
              onClick={() => setIsInfoPopupOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverVideo;