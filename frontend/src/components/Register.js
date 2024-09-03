import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RealmLogo from "./RealmLogo";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const val = {
    username: "",
    email: "",
    password: "",
    mobile: "",
  };

  const [inputs, setInputs] = useState(val);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    general: "",
  });
  const [signupSuccess, setSignupSuccess] = useState(false); // State for success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{6,14}$/;
    return passwordRegex.test(password);
  };

  const closeError = () => {
    setTimeout(() => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: "", // Clear the general error message
      }));
    }, 2500); // 2000 milliseconds = 2 seconds
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { ...errors };

    if (!inputs.username) {
      valid = false;
      newErrors.username = "Name is required";
    }

    if (!inputs.email || !validateEmail(inputs.email)) {
      valid = false;
      newErrors.email = "Please enter a valid email address";
    }

    if (!inputs.password || !validatePassword(inputs.password)) {
      valid = false;
      newErrors.password =
        "Password must be 6 to 14 characters long with at least one uppercase letter, one lowercase letter, and one special character";
    }

    if (valid) {
      try {
        const response = await axios.post("http://localhost:8800/signup", inputs);

        if (response.status === 200) {
          setSignupSuccess(true); // Set success message to display
          setTimeout(() => {
            navigate("/login");
          }, 1500); // Redirect after 1.5 seconds
        } else {
          newErrors.general = "Registration failed. Please try again.";
          setErrors(newErrors);
          closeError(); // Close the error message after 2 seconds
        }
      } catch (err) {
        if (err.response && err.response.data) {
          newErrors.general = err.response.data.message || "Registration failed. Please try again.";
        } else {
          newErrors.general = "An unexpected error occurred. Please try again later.";
        }
        setErrors(newErrors);
        closeError(); // Close the error message after 2 seconds
      }
    }

    setErrors(newErrors);
  };

  return (
    <div>
      <RealmLogo />
      <div className="register">
        <div className="card">
          <div className="right">
            <h1>Signup</h1>
            <div className="success-icon"></div>
            {signupSuccess && ( // Display success message if signup was successful
              <div className="success-popup">Signup Successful! Please login.</div>
            )}
            {errors.username && <div className="error-message">{errors.username}</div>}
            {errors.email && <div className="error-message">{errors.email}</div>}
            {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
              {errors.general && <div className="error-message">{errors.general}</div>}
             <form>
              <input
                type="text"
                placeholder="Name"
                name="username"
                value={inputs.username}
                onChange={handleChange}
              />
              
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
              />
            
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="MobileNumber"
                name="mobile"
                value={inputs.mobile}
                onChange={handleChange}
              />
           
              <button className="register-button" onClick={handleClick}>
                Signup
              </button>
              <div className="left">
                <span>Already have an account?</span>
                <Link to="/login">
                  <button className="login-button">Login</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
