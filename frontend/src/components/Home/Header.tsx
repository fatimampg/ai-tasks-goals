import { useNavigate } from "react-router-dom";
import img_homepage from "../../assets/images/img_homepage.jpg";

const Header = () => {
  const navigate = useNavigate();
  return (
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
  );
};
export default Header;
