import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import styles from "./login.module.css";
import RealmLogo from "./RealmLogo";

const Login = () => {
  const [inputs, setInputs] = useState({
    identifier: "",
    password: "",
  });
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      await login(inputs);
  
      // Assuming "uploader@gmail.com" is the email of the admin
      if (inputs.identifier === "uploader@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/profiles");
      }
    } catch (err) {
      console.error(err);
      setErr(err.response?.data?.message || "An error occurred");
    } finally {
      // Move setTimeout outside of the try block
      setTimeout(() => {
        setErr(null);
      }, 2000);
  
      setIsLoading(false);
    }
  };
  
  

  return (
    <div>
      <RealmLogo style={{ marginTop: '100px'}} />

      <div className={styles["login-container"]}>
        <div className={styles.card}>
          <div className={styles.right}>
            <h1 className="head">Login</h1>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Email or Mobile Number"
                name="identifier"
                value={inputs.identifier}
                onChange={handleChange}
              />

              <input
                type="password"
                placeholder="Password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
              />

              {err && <p className={styles["error-message"]}>{err}</p>}
              
              <div className={styles["button-container"]}>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                 <Link to="/forgotpassword" className={styles["forgot-password-link"]}>
  Forgot Password?
</Link>
</div>
             
              <div className={styles["new-user"]}>
                <span>New User?</span>
                <Link to="/register">
                  <button>Register</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
