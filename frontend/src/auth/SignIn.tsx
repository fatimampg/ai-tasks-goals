import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { signInUser, clearMessageCounter } from "../store/authSlice";
import { toast } from "../components/ToastManager";
import { RootState } from "../store";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  // Manage show toastmessages:
  const typeMessage = useSelector((state: RootState) => state.auth.typeMessage);
  const message = useSelector((state: RootState) => state.auth.message);
  const messageCounter = useSelector(
    (state: RootState) => state.auth.messageCounter,
  );
  useEffect(() => {
    if (message && messageCounter !== 0) {
      console.log("MESSAGE COUNTER", messageCounter);
      toast.show({
        message: message,
        duration: 2500,
        type: typeMessage,
      });
    }
  }, [messageCounter, message, typeMessage]);

  useEffect(() => {
    return () => {
      dispatch(clearMessageCounter());
    };
  }, [dispatch]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    if (userData.email && userData.password) {
      dispatch(signInUser(userData));
    }
  };

  const error = useSelector((state: any) => state.auth.error);
  // console.log(error, "error");
  const header = useSelector((state: any) => state.auth.header);
  // console.log(header, "header");

  useEffect(() => {
    if (error !== null) {
      const signInMessage = document.querySelector(
        ".signin-message",
      ) as HTMLElement;
      if (signInMessage) {
        signInMessage.style.display = "block";
      }
    }
  }, [error]);

  useEffect(() => {
    if (header && header.Authorization) {
      navigate("/tasks");
    }
  }, [header]);

  return (
    <div className="register__container">
      <div className="register__card">
        <form onSubmit={handleSignIn} className="register__form">
          <h2> SIGN IN: </h2>
          <label htmlFor="email"> Email: </label>
          <input
            type="email"
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
          <div>{error && <h4 className="signin-message"> {error}</h4>}</div>
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
