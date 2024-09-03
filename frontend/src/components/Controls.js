import React, { forwardRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Forward10Icon from "@mui/icons-material/Forward10";
import Replay10Icon from "@mui/icons-material/Replay10";
import FullScreen from "@material-ui/icons/Fullscreen";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeMute from "@material-ui/icons/VolumeOff";
import Popover from "@material-ui/core/Popover";
import { useNavigate } from 'react-router-dom';
import { fontWeight } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  controlsWrapper: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  thumbnail: {
    position: "absolute",
    width: "160px",
    height: "90px",
    backgroundSize: "cover",
    borderRadius: "4px",
    pointerEvents: "none",
    marginTop: "45%",
  },
  videoTitle: {
    color: "#fff",
    fontSize: "150%",
    marginLeft: "42%",
    marginRight: "auto",
    fontWeight: "bold",

    
  },
  controlIcons: {
    color: "#fff",
    fontSize: 60,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1.1)",
    },
  },
  bottomIcons: {
    color: "#fff",
    "&:hover": {
      color: "#fff",
      transform: "scale(1.3)",
    },
  },
  volumeSlider: {
    width: 150,
    marginLeft: "10px",
    color: "#FF5F1F",
  },
}));

const CustomSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const PrettoSlider = withStyles({
  root: {
    height: 8,
    color: "#fff",
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
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
  },
  track: {
    height: 8,
    borderRadius: 4,
    color: "#FF5F1F",
    
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function Controls(props, ref) {
  const {
    onSeek,
    onSeekMouseDown,
    onSeekMouseUp,
    onDuration,
    onRewind,
    onPlayPause,
    onFastForward,
    playing,
    played,
    elapsedTime,
    totalDuration,
    onMute,
    muted,
    setVolume,
    onVolumeChange,
    onVolumeSeekDown,
    onChangeDispayFormat,
    playbackRate,
    onPlaybackRateChange,
    onToggleFullScreen,
    volume,
    onAnimationComplete,
    onPlayPauseClick,
    playerRef,
    onBackButtonClick,
    videoTitle,
  } = props;

  const classes = useStyles();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProgressBarHovered, setIsProgressBarHovered] = useState(false);
  const [hoveredTime, setHoveredTime] = useState(null);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);

  function handleProgressBarHover(e) {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const left = e.nativeEvent.offsetX;
    const percentage = (left / rect.width) * 100;
    // setThumbnailPosition({ left: `${percentage}%`, top: "-120px" });
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMute = () => {
    onMute(!muted); // Toggle the mute state
  };

  const handleVolumeKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      // Calculate the new volume
      const step = 0.1;
      const newVolume =
        e.key === "ArrowUp"
          ? Math.min(volume + step, 1)
          : Math.max(volume - step, 0);
      // Update the volume state
      setVolume(newVolume);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "Space":
          e.preventDefault();
          onPlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onRewind();
          break;
        case "ArrowRight":
          onFastForward();
          break;
        case "ArrowUp":
          e.preventDefault();
          // Increase volume
          const newVolumeUp = Math.min(volume + 0.1, 1);
          onVolumeChange(null, newVolumeUp);
          break;
        case "ArrowDown":
          e.preventDefault();
          // Decrease volume
          const newVolumeDown = Math.max(volume - 0.1, 0);
          onVolumeChange(null, newVolumeDown);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keydown", handleVolumeKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keydown", handleVolumeKeyDown);
    };
  }, [onPlayPause, onRewind, onFastForward, onVolumeChange, volume]);

  return (
    <div ref={ref} className={classes.controlsWrapper} tabIndex="0">
      <Grid container direction="column" justify="space-between" style={{ flexGrow: 1 }}>
        <Grid container direction="column" justify="space-between" style={{ flexGrow: 1 }}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
            style={{ padding: 16 }}
          >
            <Grid item>
              <IconButton
                 onClick={() => navigate(-1)} // Navigate back to the previous page
                className={classes.controlIcons}
                aria-label="back"
              >
                <ArrowBackIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid item className={classes.videoTitle}>
              <Typography variant="h5">{videoTitle}</Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center" justify="center">
            <IconButton
              onClick={onRewind}
              className={classes.controlIcons}
              aria-label="rewind"
            >
              <Replay10Icon className={classes.controlIcons} fontSize="inherit" />
            </IconButton>
            <IconButton
              onClick={onPlayPauseClick}
              className={`${classes.bottomIcons} play-pause-button`}
            >
              {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
            </IconButton>
            <IconButton
              onClick={onFastForward}
              className={classes.controlIcons}
              aria-label="forward"
            >
              <Forward10Icon fontSize="inherit" />
            </IconButton>
          </Grid>
          {/* bottom controls */}
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ padding: 16 }}
          >
            <Grid item xs={12}>
              <PrettoSlider
                min={0}
                max={100}
                aria-label="custom thumb label"
                value={played * 100}
                onChange={onSeek}
                onMouseDown={onSeekMouseDown}
                onChangeCommitted={onSeekMouseUp}
                onDuration={onDuration}
                onMouseMove={(e) => handleProgressBarHover(e)}
                onMouseEnter={() => setIsProgressBarHovered(true)}
                onMouseLeave={() => setIsProgressBarHovered(false)}
              />
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <IconButton
                  onClick={onPlayPauseClick}
                  className={`${classes.bottomIcons} play-pause-button`}
                >
                  {playing ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                </IconButton>
                <IconButton
                  onClick={handleMute}
                  className={`${classes.bottomIcons} ${classes.volumeButton}`}
                >
                  {muted ? (
                    <VolumeMute fontSize="large" />
                  ) : volume > 0.5 ? (
                    <VolumeUp fontSize="large" />
                  ) : (
                    <VolumeDown fontSize="large" />
                  )}
                </IconButton>
                <CustomSlider
                  min={0}
                  max={1}
                  step={0.02}
                  value={muted ? 0 : volume}
                  onChange={onVolumeChange}
                  aria-labelledby="input-slider"
                  className={classes.volumeSlider}
                  onMouseDown={onSeekMouseDown}
                  onChangeCommitted={onVolumeSeekDown}
                  onKeyDown={handleVolumeKeyDown}
                />
                <Button variant="text" onClick={onChangeDispayFormat}>
                  <Typography variant="body1" style={{ color: "#fff", marginLeft: 16 }}>
                    {elapsedTime}/{totalDuration}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Button
                onClick={handleClick}
                aria-describedby={id}
                className={classes.bottomIcons}
                variant="text"
              >
                <Typography style={{fontWeight:"bold",color:'white'}}>{playbackRate}X</Typography>
              </Button>
              <Popover
                container={ref.current}
                open={open}
                id={id}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid container direction="column-reverse">
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <Button
                      key={rate}
                      onClick={() => onPlaybackRateChange(rate)}
                      variant="text"
                    >
                      <Typography color={rate === playbackRate ? "secondary" : "inherit"}>
                        {rate}X
                      </Typography>
                    </Button>
                  ))}
                </Grid>
              </Popover>
              <Button onClick={onToggleFullScreen} className={classes.bottomIcons}>
                <FullScreen fontSize="large" />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

Controls.propTypes = {
  onSeek: PropTypes.func,
  onSeekMouseDown: PropTypes.func,
  onSeekMouseUp: PropTypes.func,
  onDuration: PropTypes.func,
  onRewind: PropTypes.func,
  onPlayPause: PropTypes.func,
  onFastForward: PropTypes.func,
  onVolumeSeekDown: PropTypes.func,
  onVolumeChange: PropTypes.func,
  volume: PropTypes.number,
  muted: PropTypes.bool,
  onChangeDispayFormat: PropTypes.func,
  onPlaybackRateChange: PropTypes.func,
  onToggleFullScreen: PropTypes.func,
  onMute: PropTypes.func,
  playing: PropTypes.bool,
  played: PropTypes.number,
  elapsedTime: PropTypes.string,
  totalDuration: PropTypes.string,
  muted: PropTypes.bool,
  setVolume: PropTypes.func,
  onBookmark: PropTypes.func,
  playbackRate: PropTypes.number,
  playerRef: PropTypes.object,
  videoTitle: PropTypes.string,
  bookmarks: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      // Add other properties as needed
    })
  ),
  onRemoveBookmark: PropTypes.func,
};

export default forwardRef(Controls);
