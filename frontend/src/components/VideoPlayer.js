import React, { useState, useRef, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import ReactPlayer from 'react-player/lazy';

import axios from "axios";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Controls from "./Controls";
import screenfull from "screenfull";
import Loader from "./Loader";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 1000,
  },
    
  
  controlsWrapper: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    // overflow: "hidden",
    zIndex: 1000,
  },
  
  topControls: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(2),
  },
  middleControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomWrapper: {
    display: "flex",
    flexDirection: "column",

    // background: "rgba(0,0,0,0.6)",
    // height: 60,
    padding: theme.spacing(2),
  },

  bottomControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // height:40,
  },

  button: {
    margin: theme.spacing(1),
  },
  controlIcons: {
    color: "#777",

    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },

  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },

  volumeSlider: {
    width: 100,
  },
}));

const PrettoSlider = withStyles({
  root: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
    margin: 0,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff", // White color for the thumb
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
    visibility: "hidden",
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff8c00", // Orange color for the track
  },
  rail: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff", // White color for the rail
  },
})(Slider);
function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function VideoPlayer() {
  const classes = useStyles();
  
  const [showControls, setShowControls] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
  const [bookmarks, setBookmarks] = useState([]);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const { path } = useParams();
  const{videoPath} = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  
  console.log("Video path in VideoPlayer:", videoPath); 

  useEffect(() => {
    if (videoPath) {
      // Remove the "uploads/" prefix from the video path
      const fileName = videoPath.substring(videoPath.lastIndexOf("/") + 1);
      // Remove the file extension
      const fileNameWithoutExtension = fileName.split(".")[0];
      // Extract the middle part as the movie title
      const movieTitle = fileNameWithoutExtension.substring(8);
      setVideoTitle(movieTitle);
  
      axios
        .get(`http://localhost:8800/getVideoInfo/${videoPath}`)
        .then((response) => {
          console.log("Server Response:", response.data);
          setVideoTitle(response.data.videoTitle || movieTitle);
        })
        .catch((error) => {
          console.error("Error fetching video info:", error);
          setIsLoading(false);
        });
    }
  }, [videoPath]);
  
    
  const [state, setState] = useState({

    pip: false,
    playing: true,
    controls: false,
    light: false,

    muted: true,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);
  const {
    playing,
    controls,
    light,
    loop,
    playbackRate,
    pip,
    played,
    seeking,
    
  } = state;

 

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (count > 3) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility === "visible") {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    console.log({ newValue });
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    console.log({ value: e.target });
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100, "fraction");
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleVolumeChange = (_, newVolume) => {
    setVolume(newVolume);
  };
  

  const handleFullScreenClick = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(playerContainerRef.current);
    }
  };
  
  const handleDoubleClick = () => {
    handleFullScreenClick();
  };
  const handleContainerClick = (event) => {
    // Check if the clicked element or its parent is the play/pause icon button
    const isPlayPauseButton =
      event.target.classList.contains("play-pause-button") ||
      event.target.closest(".play-pause-button");
  
    // Check if the click is on the video element
    const isVideo = event.target.closest("video");
  
    // Check if the click is on the top controls
    const isTopControls =
      event.target.classList.contains(classes.topControls) ||
      event.target.closest(`.${classes.topControls}`);
  
    // Check if the click is on the empty space of the video (where there are no controls)
    const isVideoEmptySpace = isVideo && !isTopControls;
  
    // Toggle play/pause state only if the play/pause icon button is clicked, the click is on the empty space of the video, and not on the top controls
    if (isPlayPauseButton || isVideoEmptySpace) {
      setState((prevState) => ({ ...prevState, playing: !prevState.playing }));
    }
  };
  
  
  const handleMouseMove = () => {
    console.log("mousemove");
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const hanldeMouseLeave = () => {
    controlsRef.current.style.visibility = "hidden";
    count = 0;
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };

  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const handleMute = () => {
    setMuted((prevMuted) => !prevMuted);
  };

  const currentTime =
    playerRef && playerRef.current
      ? playerRef.current.getCurrentTime()
      : "00:00";

  const duration =
    playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00";
  const elapsedTime =
    timeDisplayFormat === "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  return (
    <>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={hanldeMouseLeave}
          onDoubleClick={handleDoubleClick}
          onClick={handleContainerClick}
          ref={playerContainerRef}
          className={classes.playerWrapper}
        >
       <ReactPlayer
  ref={playerRef}
  width="100%"
  height="100%"
  url={`http://localhost:8800/${videoPath}`}  // Correct URL with .m3u8 extension
  pip={pip}
  playing={state.playing}
  controls={false}
  light={light}
  loop={loop}
  playbackRate={playbackRate}
  volume={volume}
  muted={muted}
 
  onProgress={handleProgress}
  config={{
    file: {
      attributes: {
        crossOrigin: "use-credentials", // or "anonymous"
      },
      hlsOptions: {
        // Additional options for HLS playback
        xhrSetup: (xhr, url) => {
          // You can add custom headers if needed
          xhr.setRequestHeader('Authorization', 'Bearer your_token');
        },
      },
    },
  }}
  onError={(error) => console.error('Player error:', error)}
/>



          <Controls
            ref={controlsRef}
            playerRef={playerRef}
            onSeek={handleSeekChange}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            onDuration={handleDuration}
            onRewind={handleRewind}
            onPlayPause={handlePlayPause}
            onFastForward={handleFastForward}
            playing={playing}
            played={played}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onMute={handleMute}
            muted={muted}
            onVolumeChange={handleVolumeChange}
            setVolume={setVolume} 
            volume={volume}
            onChangeDispayFormat={handleDisplayFormat}
            playbackRate={playbackRate}
            onPlaybackRateChange={handlePlaybackRate}
            onToggleFullScreen={handleFullScreenClick}
            onPlayPauseC ={handlePlayPause}
            setState={setState}
            videoTitle={videoTitle}
          />
        </div>
        {isLoading && <Loader />} 
        <canvas ref={canvasRef} />
       
    </>
  );
}
export default VideoPlayer;