import React, { useState, useEffect, useContext } from "react";
import RealmLogo from "./RealmLogo";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { AuthContext } from "../context/authContext";

const ProfilesList = () => {
  const [profiles, setProfiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { currentProfile } = useContext(AuthContext);

  const handleLoginAndEdit = (profileId) => {
    navigate(`/edit-auth/${profileId}`);
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:8800/profiles", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }

        const data = await response.json();
        if (data.success) {
          
          setProfiles(data.profiles);
        } else {
          throw new Error("Failed to fetch profiles");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchProfiles();
  }, []);



  const handlePinValidation = async (profileId, isChildProfile) => {
    const profile = profiles.find((p) => p.id === profileId);

    if (profile && profile.pin) {
      navigate(`/pin/${profileId}`);
    } else {
      await currentProfile(profileId);
      const redirectTo = isChildProfile ? '/ChildHome' : '/home';
      navigate(redirectTo);
    }
  };

  const handleAddProfile = () => {
    if (profiles.length < 4) {
      navigate("/add-profile");
    } else {
      console.log("Maximum profiles reached");
      setErrorMessage("Maximum profiles reached");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    
    <div className={styles.addprofilebuttoncontainer}>
      <div className={styles.profilesContainer}>
        <div className={styles.profiles}>
          <h2>Choose your profile and dive in</h2>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          <div className={styles.profilesList}>
            {profiles.map((profile, index) => (
              <div key={index} className={styles.profileItem}>
                <div className={styles.profileinfo}>
                  <p onClick={() => handlePinValidation(profile.id, profile.isChildProfile)}>
                    {profile.name}
                    {profile.pin && (
                      <span className={styles.lockicon} title="PIN protected">
                        <LockPersonIcon />
                      </span>
                    )}
                  </p>
                  {profile.profilePhotoPath ? (
                    <img
                      src={`http://localhost:8800/${profile.profilePhotoPath}`}
                      alt={profile.name}
                      className={styles.pic}
                    />
                  ) : (
                    <img
                      onClick={() => handlePinValidation(profile.id, profile.isChildProfile)}
                      src={
                        profile.isChildProfile
                    ? 'data:image/jpeg;base64,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'
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRlaW-gbWq8T-wdtC66Ck6oPKuloNsPnJ8K814sO_VmA&s'
                }
                alt='Default Image'
                className={styles.pic}
              />
                  )}
                 
                  <button className={styles.editpro} onClick={() => handleLoginAndEdit(profile.id)}>
                    <EditIcon />
                  </button>
             
          </div>
        </div>
      ))}
 

      {profiles.length < 4 && (
            <button
              className={`${styles.addProfileButton} ${styles.addProfileButtonDynamic}`}
              onClick={handleAddProfile}
              disabled={profiles.length >= 4}
            >
              <AddIcon />
            </button>
         
        )}
      </div>
    </div>
    </div>
    </div>
  );
};
 
export default ProfilesList;