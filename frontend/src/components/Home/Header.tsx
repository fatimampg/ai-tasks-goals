import { useNavigate } from "react-router-dom";
import cover_img from "../../assets/images/cover_img.svg";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="home__header">
      <h1 className="home__title">
        Turn goals into actions and boost your productivity with our AI-powered tasks manager
      </h1>
      <h4 className="home__subtitle">
        Empower your productivity! Break goals into actionable steps and let us help align your tasks for success.
      </h4>
      <button
        className="home__button button arrow-button"
        onClick={() => navigate("/register")}
      >
        Try for free <span className="arrow"></span>
      </button>
      <img
        src={cover_img}
        alt="img home"
        className="home__img"
        loading="lazy"
      />
    </div>
  );
};
export default Header;
