import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/index.css";
import img_homepage from "../assets/images/img_homepage.jpg";
import check_circle from "../assets/icons/check-circle.svg";

const Homepage = () => {
  const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
      <div>
        <Navbar />
        <div className="home-container">
          <h1 className="home__title">
            Achieve your goals with a AI-Powered Taks Manager.
          </h1>
          <h3 className="home__subtitle">
            Empower your productivity journey with inteligente task tracking and
            goal setting.
          </h3>
          <button
            className="button button--primary home__button"
            onClick={() => navigate("/register")}
          >
            Try for free
          </button>
          <img src={img_homepage} alt="img home" className="home__img" />
        </div>
        <div className="home__board">
          <div className="home__card card1">
            <img
              src={check_circle}
              alt="check mark icon"
              className="icon__card"
            />
            <h3>
              Empower your productivity journey with inteligente task tracking
              and goal setting.
            </h3>
          </div>
          <div className="home__card card2">
            <img
              src={check_circle}
              alt="check mark icon"
              className="icon__card"
            />
            <h3>
              Empower your productivity journey with inteligente task tracking
              and goal setting.
            </h3>
          </div>
          <div className="home__card card3">
            <img
              src={check_circle}
              alt="check mark icon"
              className="icon__card"
            />
            <h3>
              Empower your productivity journey with inteligente task tracking
              and goal setting.
            </h3>
          </div>
          <div className="home__card card4">
            <img
              src={check_circle}
              alt="check mark icon"
              className="icon__card"
            />
            <h3>
              Empower your productivity journey with inteligente task tracking
              and goal setting.
            </h3>
          </div>
        </div>
      </div>
    );
};

export default Homepage;
