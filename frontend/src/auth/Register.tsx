import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";
import { toast } from "../components/Toasts/ToastManager";
import LoadingSpinner from "../components/LoadingSpinner";

const Register = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    e.preventDefault();
    setError("");

    if (userData.password !== passwordConfirm) {
      setError("Passwords don't match.");
      setIsLoading(false);
      toast.show({
        message: "Passwords don't match.",
        duration: 2500,
        type: "error",
      });
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
      toast.show({
        message: "You are now registered. Please sign-in.",
        duration: 2500,
        type: "success",
      });
      if (!newUser) {
        setError("Registration failed. Please try again.");
        toast.show({
          message: "Registration failed. Please try again.",
          duration: 2500,
          type: "error",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error.response.data);
      console.log(error);
      toast.show({
        message: "Registration failed. Please try again.",
        duration: 2500,
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
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
              required
              data-testid="register-name"
            />
            <label htmlFor="email"> Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              className="register__email-input"
              value={userData.email}
              onChange={handleInputChange}
              required
              data-testid="register-email"
            />
            <label htmlFor="password"> Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              className="register__password-input"
              value={userData.password}
              onChange={handleInputChange}
              required
              data-testid="register-password"
            />
            <label htmlFor="passwordConfirm"> Confirm password: </label>
            <input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              className="register__password-input"
              value={passwordConfirm}
              onChange={handleInputChange}
              required
              data-testid="register-passwordConfirm"
            />
            <button
              type="submit"
              data-testid="register-submit"
              className="button button--primary"
            >
              REGISTER
            </button>
          </form>
          <div className="register__signin-forward">
            <h4> Already have an account?</h4>
            <button
              data-testid="redirect-signin"
              onClick={() => navigate("/signin")}
            >
              SIGN IN{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
