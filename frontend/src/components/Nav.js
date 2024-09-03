import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import "./Nav.css";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const NotificationCard = ({ notification }) => {
  const timeAgo = formatDistanceToNow(new Date(notification.upload_time), {
    addSuffix: true,
  });



  return (
    <Link to={`/movie/${notification.id}`} key={notification.id}>
      <div className="notification-card">
        <img
          className="thumbnail"
          src={`http://localhost:8800/${notification.image_path}`}
          alt="Thumbnail"
        />
        <div className="notification-details">
          <h3>{notification.title}</h3>
          <p>Age Rating: {notification.age_rating}</p>
          <p>Upload Time: {timeAgo}</p>
        </div>
      </div>
    </Link>
  );
};

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { currentUser, logout, profileId } = useContext(AuthContext);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        if (profileId) {
          const response = await fetch(`http://localhost:8800/profiles/${profileId}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch profile name");
          }

          const data = await response.json();
          if (data.success) {
            setProfileName(data.profile.name);
          } else {
            throw new Error("Failed to fetch profile name");
          }
        }
      } catch (error) {
        console.error("Error fetching profile name:", error.message);
      }
    };

    fetchProfileName();
  }, [profileId]);

  useEffect(() => {
    
  }, [profileName, currentUser]);

  const dropdownItems = [
    { icon: <PersonIcon />, label: "Manage Profiles", path: "/profiles" },
    { icon: <BookmarkBorderIcon />, label: "Watchlist", path: "/watchlist" },
    { icon: <ExitToAppIcon />, label: "Sign Out", path: "/sign-out" },
  ];

  // Add Account option if profileName matches currentUser.username
  if (profileName === currentUser.username) {
    dropdownItems.push({ icon: <AccountCircleIcon />, label: "Account", path: "/restrict" });
  }

  const handleDropdownItemClick = (path) => {
    if (path === "/sign-out") {
      handleLogout();
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      await axios.post("http://localhost:8800/decrement-device-count", {
        userId: currentUser.id,
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="nav-profile-dropdown">
      {dropdownItems.map((item, index) => (
        <div
          key={index}
          className="nav-dropdown-item"
          onClick={() => handleDropdownItemClick(item.path)}
        >
          <span className="nav-dropdown-item-icon">{item.icon}</span>
          <span className="nav-dropdown-item-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};


const Nav = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);
  
  useEffect(() => {
    // Fetch data from uploads table
    axios
      .get("http://localhost:8800/notifications")
      .then((response) => {
        const storedNotifications =
          JSON.parse(localStorage.getItem("notifications")) || [];
        const unseenNotifications = response.data.filter(
          (notification) => !notification.seen
        );

        setNotifications(response.data);
        updateUnseenCount(
          unseenNotifications.length + storedNotifications.length
        );
      })
      .catch((error) => {
        console.error(error);
      });

    // Add a click event listener to the document body
    document.body.addEventListener("click", handleBodyClick);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  const updateUnseenCount = (count) => {
    localStorage.setItem("unseenCount", count.toString());
  };

  const markNotificationsSeen = () => {
    // Mark notifications as seen on the server
    axios
      .put("http://localhost:8800/mark-notifications-seen")
      .then(() => {
        // Refresh data and update unseen count
        axios
          .get("http://localhost:8800/notifications")
          .then((response) => {
            const storedNotifications =
              JSON.parse(localStorage.getItem("notifications")) || [];
            setNotifications(response.data);
            updateUnseenCount(
              response.data.length - storedNotifications.length
            );
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNotificationClick = (notificationId) => {
    // Fetch movies based on the clicked notification id
    axios
      .get(`http://localhost:8800/movies/${notificationId}`)
      .then((response) => {
        // Handle the movies data (e.g., display them in a modal)
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Toggle the visibility of notifications
    setShowNotifications(!showNotifications);

    // If notifications are being displayed, mark them as seen
    if (showNotifications) {
      markNotificationsSeen();
    } else {
      // Decrease unseen count locally without marking notifications as seen
      updateUnseenCount(0);
    }
  };

  const handleBodyClick = (event) => {
    // Check if the click target is inside the notification area or notification icon
    if (
      event.target.closest(".notification-container") ||
      event.target.closest(".notification-icon")
    ) {
      // Click is inside the notification area or on the notification icon, do nothing
      return;
    }

    // Click is outside the notification area and notification icon, hide notifications
    setShowNotifications(false);
  };

  const { profileId } = useContext(AuthContext);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        if (profileId) {
          const response = await fetch(`http://localhost:8800/profiles/${profileId}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch profile name");
          }

          const data = await response.json();
          if (data.success) {
            setProfileName(data.profile.name);
          } else {
            throw new Error("Failed to fetch profile name");
          }
        }
      } catch (error) {
        console.error("Error fetching profile name:", error.message);
      }
    };

    fetchProfileName();
  }, [profileId]);

  return (
    <div>
      <header>
        <nav className="nav-navbar">
          <div className="nav-logo">
            <Link to="/home">
              <img
                src={`/images/latest_realm.png?${Date.now()}`}
                alt="Logo"
                style={{ height: "30px", width: "auto" }}
              />
            </Link>
          </div>
          <div className="nav-container">
            <ul className="nav-nav-list">
              <li className="nav-nav-item"><Link to="/home">Home</Link></li>
            
              <li className="nav-nav-item"><Link to="/Moviespage">Movies</Link></li>
              <li className="nav-nav-item"><Link to="/watchlist">Watchlist</Link></li>
            </ul>
          </div>
          <div className="nav-profile-name">
            Hii {profileName}!
          </div>
          <div className="nav-align-right">
            <ul className="nav-nav-list">
              <li className="nav-nav-item">
                <Link to="/Search" className="nav-search-icon">
                  <SearchIcon /> {/* Use FaSearch icon */}
                </Link>
              </li>
              <li className="nav-item">
                <div
                  className="notification-icon"
                  onClick={handleNotificationClick}
                >
                  <NotificationsIcon />
                  {localStorage.getItem("unseenCount") > 0 && (
                    <span className="unseen-count">
                      {localStorage.getItem("unseenCount")}
                    </span>
                  )}
                </div>
                {showNotifications && (
                  <div className="notification-container">
                    {notifications.slice(0, 7).map((notification) => (
                      <div
                        key={notification.id}
                        className="notification-card"
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </li>
              <li className="nav-nav-item">
                <span className="nav-profile-icon"><PersonIcon /> <ProfileDropdown /></span>
                {/* Use FaUser icon */}
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Nav;
