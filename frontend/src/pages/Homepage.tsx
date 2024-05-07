import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/index.css";
import img_homepage from "../assets/images/img_homepage.jpg";
import check_circle from "../assets/icons/check-circle.svg";
import one from "../assets/icons/one.svg";
import two from "../assets/icons/two.svg";
import three from "../assets/icons/three.svg";
import four from "../assets/icons/four.svg";

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
        <img
          src={img_homepage}
          alt="img home"
          className="home__img"
          loading="lazy"
        />
      </div>
      <div className="home__board">
        <div className="home__card card1">
          <img src={one} alt="one icon" className="icon__card" />
          <h3>Task Management:</h3>
          <h4>Add tasks, associating categories, priorities and deadlines.</h4>
        </div>
        <div className="home__card card2">
          <img src={two} alt="two icon" className="icon__card" />
          <h3>Goal setting:</h3>
          <h4>Set monthly goals and categorize them accordingly.</h4>
        </div>
        <div className="home__card card3">
          <img src={three} alt="three icon" className="icon__card" />
          <h3>Progress Tracking:</h3>
          <h4>Update task progress regularly.</h4>
        </div>
        <div className="home__card card4">
          <img src={four} alt="four icon" className="icon__card" />
          <h3>AI Progress Analysis:</h3>
          <h4>
            Get task progress analysis and recommendations for goal alignement.
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
