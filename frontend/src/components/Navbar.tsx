import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.svg";
import profileIcon from "../assets/icons/profile-user.svg";
import menu from "../assets/icons/menu.svg";
import close from "../assets/icons/close.svg";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <nav className="nav-bar">
      <NavLink to="/">
        <img src={Logo} alt="logo svg" className="nav__logo-link" />
      </NavLink>

      <img
        src={isMenuOpen ? close : menu}
        alt="menu icon"
        className="menu"
        onClick={toggleMenu}
      />

      <div className={`nav-text ${isMenuOpen ? "nav--visible" : ""}`}>
        <img
          src={close}
          alt="close icon"
          className="close"
          onClick={closeMenu}
        />
        <ul className="nav__list">
          <li className="nav__list-item"> About </li>
          <li className="nav__list-item"> Features </li>
        </ul>
      </div>

      <div className="nav__right-column">
        {!isLoggedIn ? (
          <div className="nav__right-column">
            <button
              className="nav__button"
              // onClick={handleRegister}
            >
              Try for free
            </button>
            <img
              src={profileIcon}
              alt="profile icon"
              className="nav__profile-icon"
            />
          </div>
        ) : (
          <div className="nav__right-column">
            <img
              src={profileIcon}
              alt="profile icon"
              className="nav__profile-icon"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
