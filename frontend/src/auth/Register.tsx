import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

const Register = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name !== "passwordConfirm") {
      setUserData({
        ...userData,
        [name]: value,
      });
    } else {
      setPasswordConfirm(value);
    }
  };

  const registerUser = async (e: any) => {
    e.preventDefault();
    setError("");

    if (userData.password !== passwordConfirm) {
      setError("Passwords don't match.");
      alert("Passwords don't match.");
      setUserData({
        ...userData,
        password: "",
      });
      setPasswordConfirm("");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/user`,
        userData,
      );
      const newUser = await response.data;
      console.log(newUser);
      navigate("/");
      if (!newUser) {
        setError("Registration failed. Please try again.");
      }
    } catch (error: any) {
      setError(error.response.data);
      console.log(error);
    }
  };

  return (
    <div className="register__container">
      <div className="register__card">
        <form onSubmit={registerUser} className="register__form">
          <h2> REGISTER: </h2>
          <label htmlFor="text"> Name: </label>
          <input
            type="text"
            id="name"
            name="name"
            className="register__email-input"
            value={userData.name}
            onChange={handleInputChange}
          />
          <label htmlFor="email"> Email: </label>
          <input
            type="text"
            id="email"
            name="email"
            className="register__email-input"
            value={userData.email}
            onChange={handleInputChange}
          />
          <label htmlFor="password"> Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            className="register__password-input"
            value={userData.password}
            onChange={handleInputChange}
          />
          <label htmlFor="passwordConfirm"> Confirm password: </label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            className="register__password-input"
            value={passwordConfirm}
            onChange={handleInputChange}
          />
          <button type="submit" className="button button--primary">
            REGISTER
          </button>
        </form>
        <div className="register__signin-forward">
          <h4> Already have an account?</h4>
          <button onClick={() => navigate("/signin")}>SIGN IN </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
