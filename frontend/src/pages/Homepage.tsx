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
    <div className="homepage">
      <Navbar />
      <div className="homepage__content">
        <div className="home-container">
          <h1 className="home__title">
            Achieve your goals with a AI-Powered Tasks Manager.
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
            <h4>
              Add tasks, associating categories, priorities and deadlines.
            </h4>
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
              Get task progress analysis and recommendations for goal
              alignement.
            </h4>
          </div>
        </div>
        <div className="home__main-description">
          <h2 id="features-summary" style={{ fontWeight: "700" }}>
            AI Tasks Manager was designed to help you align tasks with
            predefined goals, thereby boosting your productivity and goal
            achievement!
          </h2>
          <h3>
            Start by envisioning your goals across various life domains - from
            career milestones to personal growth, health and wellness, finances,
            leisure, and more. Then, break down these aspirations into
            manageable monthly goals, setting the state for a productive journey
            ahead!
          </h3>
          <h3>
            Plan your week, aligning tasks with your overarching objectives.
            Identifying their individual priority levels will help you to ensure
            that critical tasks receive the attention they deserve.
          </h3>
          <h3>
            {" "}
            As you progress, update your task status to track your journey
            effectively. By splitting larger tasks into smaller actionable
            steps, you'll enhance productivity and maintain motivation.
          </h3>
          <h3>
            Throughout your journey, monitor your progress and check the
            analysis generated by an AI model{" "}
            <span style={{ fontWeight: "700" }}>(OpenAI model GPT-4)</span> and
            receive personalized insights to stay aligned with your goals.
          </h3>
          <h3>
            Are you ready to elevate your productivity? Start your journey with
            AI Task Manager today!
          </h3>
        </div>
        <div className="home__note">
          <h3>
            This web app is a personal project, not intended for comercial use.
            It integrates OpenAI GPT-4 model for enhanced functionality. No
            sensitive information should be added. Learn about OpenAI's
            policies:{" "}
            <a
              href="https://openai.com/policies/usage-policies/"
              style={{ textDecoration: "underline" }}
            >
              OpenAI Usage Policies
            </a>
            .
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
