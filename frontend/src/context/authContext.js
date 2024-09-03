import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [profileId, setProfileId] = useState(
    JSON.parse(localStorage.getItem("profileId")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/signin", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axios.post("http://localhost:8800/logout", null, {
      withCredentials: true,
    });

    setCurrentUser(null);
    setProfileId(null);
    localStorage.removeItem("user");
    localStorage.removeItem("profileId");
  };

  const currentProfile = (profileId) => {
    setProfileId(profileId);
    localStorage.setItem("profileId", JSON.stringify(profileId));
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]); 

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, currentProfile, profileId }}>
      {children}
    </AuthContext.Provider>
  );
};