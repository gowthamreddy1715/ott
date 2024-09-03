// Import necessary modules
import { useContext, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import styles from "./EditAuth.module.css";
import RealmLogo from "./RealmLogo";
import { useParams } from "react-router-dom";

const EditAuthentication = () => {
  // State declarations
  const [inputs, setInputs] = useState({
    password: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const { profileId } = useParams();
  const { currentUser } = useContext(AuthContext);

  // Handling login action
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Assuming you have an API endpoint to verify the password
      const response = await fetch(`http://localhost:8800/verify-password`, { // Updated endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id, // Assuming currentUser contains the user's ID
          password: inputs.password,
        }),
      });

      if (response.ok) {
        // If the password is correct, navigate to edit profile page for that profile only
        navigate(`/edit-profile/${profileId}`);
      } else {
        // If not, display an error
        setErr("Incorrect password");

        // Clear the error after 3 seconds
        setTimeout(() => {
          setErr(null);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setErr("Error verifying password");

      // Clear the error after 3 seconds
      setTimeout(() => {
        setErr(null);
      }, 3000);
    }
  };

  // JSX return
  return (
    <div>
      <Link to="/profiles"><RealmLogo style={{ marginTop: '100px' }} /></Link>

      <div className={styles["login-container"]}>
        <div className={styles.card}>
          <div className={styles.right}>
            <h1 className="head">Enter Your Password</h1>
            <form>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => setInputs({ password: e.target.value })}
              />
              {err && <div className={styles.errormessage}>{err}</div>}
              <div className={styles["button-container"]}>
                <button onClick={handleLogin}>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAuthentication;
