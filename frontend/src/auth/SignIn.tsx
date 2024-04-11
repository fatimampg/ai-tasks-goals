import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { signInUser } from "../store/authSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (userData.email && userData.password) {
      dispatch(signInUser(userData));
    }
    console.log(header);
    navigate("/tasks");
  };

  const error = useSelector((state: any) => state.auth.error);
  const header = useSelector((state: any) => state.auth.header);

  return (
    <div className="register__container">
      <div className="register__card">
        <form onSubmit={handleSignIn} className="register__form">
          <h2> SIGN IN: </h2>
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
          <button type="submit" className="button button--primary">
            SIGN IN
          </button>
        </form>
        <div className="register__signin-forward">
          <h4> Not registered? </h4>
          <button onClick={() => navigate("/register")}>REGISTER </button>
        </div>
        <div className="register__signin-forward">
          <h4> Forgot password? </h4>
          <button onClick={() => navigate("/")}>TO DO </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
