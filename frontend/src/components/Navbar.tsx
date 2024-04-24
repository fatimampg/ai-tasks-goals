import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.svg";
import profileIcon from "../assets/icons/profile-user.svg";
import menu from "../assets/icons/menu.svg";
import close from "../assets/icons/close.svg";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import my_profile from "../assets/icons/my-profile.svg";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { signOutUser } from "../store/authSlice";
import { clearTaskList } from "../store/tasksSlice";
import { clearGoalList } from "../store/goalsSlice";
import { Goal } from "../types";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [profileDropdownMenuOpen, setProfileDropdownMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Handle clicking outside the dropdown menu:
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleProfileMenuToggle = () => {
    setProfileDropdownMenuOpen(!profileDropdownMenuOpen);
  };
  const handleClickOutsideMenu = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as HTMLDivElement)
    ) {
      e.stopPropagation();
      setProfileDropdownMenuOpen(false);
    }
  };
  useEffect(() => {
    // console.log("profileDropdownMenuOpen", profileDropdownMenuOpen);
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);
  //--------------------------

  const header = useSelector((state: RootState) => state.auth.header);
  console.log("header", header);
  useEffect(() => {
    if (header && header.Authorization) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [header]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ----------- sign out:
  const handleSignOut = () => {
    // console.log("signout");
    dispatch(signOutUser());
    dispatch(clearTaskList());
    dispatch(clearGoalList());
    setProfileDropdownMenuOpen(false);
    navigate("/");
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
          {isLoggedIn ? (
            <>
              <li className="nav__list-item" onClick={() => navigate("/goals")}>
                {" "}
                Goals{" "}
              </li>
              <li className="nav__list-item" onClick={() => navigate("/tasks")}>
                {" "}
                Tasks{" "}
              </li>
            </>
          ) : null}
        </ul>
      </div>

      <div className="nav__right-column">
        <div className="nav__right-column">
          {!isLoggedIn && (
            <button
              className="nav__button"
              // onClick={handleRegister}
            >
              Try for free
            </button>
          )}

          <img
            src={profileIcon}
            alt="profile icon"
            className="nav__profile-icon"
            id="profile_icon"
            onClick={handleProfileMenuToggle}
          />
          <div ref={dropdownRef}>
            {profileDropdownMenuOpen && (
              <div className="dropdown-content__profile">
                {!isLoggedIn ? (
                  <>
                    <button
                      className="button button--primary"
                      onClick={() => {
                        navigate("/signin");
                        setProfileDropdownMenuOpen(false);
                      }}
                    >
                      LOG IN NOW
                    </button>
                    <h4>
                      {" "}
                      Haven't got an account? <br /> Register{" "}
                      <a href="/register">here</a>{" "}
                    </h4>
                  </>
                ) : (
                  <>
                    <button
                      className="button button--primary"
                      onClick={handleSignOut}
                    >
                      LOG OUT
                    </button>
                    <button
                      className="dropdown-menu-button-secondary__profile"
                      // onClick={() => navigate("/profile")}
                    >
                      <img
                        src={my_profile}
                        alt="my profile icon"
                        className="icon__dropdown"
                      />
                      My account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
