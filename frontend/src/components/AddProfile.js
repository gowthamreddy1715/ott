import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import styles from "./AddProfile.module.css";
import RealmLogo from './RealmLogo';

const AddProfileForm = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    isChildProfile: false,
    pin: "",
    profilePhoto: null, // For storing the selected file
  });

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.type === "file") {
      // Handle file input separately
      setProfileData({ ...profileData, profilePhoto: e.target.files[0] });
    } else if (e.target.name === "isChildProfile") {
      // Convert the checkbox value to a boolean
      setProfileData({ ...profileData, isChildProfile: e.target.checked });
    } else {
      const { name, value } = e.target;
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("isChildProfile", profileData.isChildProfile ? 1 : 0);
      formData.append("pin", profileData.pin);
      formData.append("profilePhoto", profileData.profilePhoto);

      const response = await axios.post(
        "http://localhost:8800/add-profile",
        formData,
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error("Failed to add profile");
      }

      // Show the popup
      setShowPopup(true);

      // Hide the popup after 1 seconds
      setTimeout(() => {
        setShowPopup(false);
        // Navigate to the profiles page after successful addition
        navigate("/profiles");
      }, 1000);

    } catch (error) {
      console.error("Error:", error.message);
      // Handle error 
    }
  };

  return (
    <div>
      <Link to="/profiles"><RealmLogo /></Link> 
      <div className={styles.addprofilecontainer}>
        <div className={styles.addprofilebox}>
          <form className={styles.addprofileform} onSubmit={handleSubmit}>
            <div className={styles.addprofilefield}>
              <h2>Add Profile</h2>
              <label className={styles.addprofilelabel}>Name:</label>
              <input
                type="text"
                name="name"
                maxLength={10}
                value={profileData.name}
                onChange={handleChange}
                required
                className={styles.addprofileinput}
              />
            </div>

            <div className={styles.addprofilefield}>
              <label className={styles.addprofilelabel}>Is Child Profile:</label>
              <input
                type="checkbox"
                name="isChildProfile"
                checked={profileData.isChildProfile}
                onChange={handleChange}
                className={styles.addprofilecheckbox}
              />
            </div>

            <div className={styles.addprofilefield}>
              <label className={styles.addprofilelabel}>PIN:</label>
              <input
                type="text"
                name="pin"
                value={profileData.pin}
                onChange={handleChange}
                className="add-profile-input"
                minLength={4}
                maxLength={4}
                title="PIN must be exactly 4 digits long"
              />
            </div>

            <div className={styles.addprofilefield}>
              <label className={styles.addprofilelabel}>Profile Photo:</label>
              <input
                type="file"
                name="profilePhoto"
                onChange={handleChange}
                accept="image/*"
                className={styles.addprofileinput}
              />
            </div>

            <button className={styles.addprofilebuttonnn} type="submit">
              Add Profile
            </button>
          </form>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <span role="img" aria-label="checkmark">✅</span>     Profile added successfully
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProfileForm;