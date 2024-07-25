import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import type { AppDispatch } from "../../store";
import { signOutUser } from "../../store/authSlice";
import { clearTaskList } from "../../store/tasksSlice";
import { clearGoalList } from "../../store/goalsSlice";
import "./navbar.css";
import Logo from "../../assets/images/Logo.svg";
import profileIcon from "../../assets/icons/profile-user.svg";
import my_profile from "../../assets/icons/my-profile.svg";
import menu from "../../assets/icons/menu.svg";
import close from "../../assets/icons/close.svg";

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
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  // Check signed in state based on the auth header:
  const header = useSelector((state: RootState) => state.auth.header);
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

  const handleSignOut = () => {
    dispatch(signOutUser());
    dispatch(clearTaskList());
    dispatch(clearGoalList());
    setProfileDropdownMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="nav-bar">
      <NavLink
        to="/"
        onClick={() => {
          setMenuOpen(false);
        }}
      >
        <img src={Logo} alt="logo svg" className="nav__logo-link" />
      </NavLink>

      <img
        src={isMenuOpen ? close : menu}
        alt="menu icon"
        className="menu"
        onClick={toggleMenu}
      />

      <div className={`nav-text ${isMenuOpen ? "nav--visible" : ""}`}>
        <ul className="nav__list">
          <li
            className="nav__list-item"
            onClick={() => {
              navigate("/features");
              setMenuOpen(false);
            }}
          >
            {" "}
            Features{" "}
          </li>
          {isLoggedIn ? (
            <>
              <li
                className="nav__list-item"
                onClick={() => {
                  navigate("/tasks");
                  setMenuOpen(false);
                }}
              >
                {" "}
                Tasks{" "}
              </li>
              <li
                className="nav__list-item"
                onClick={() => {
                  navigate("/goals");
                  setMenuOpen(false);
                }}
              >
                {" "}
                Goals{" "}
              </li>
              <li
                className="nav__list-item"
                onClick={() => {
                  navigate("/progress");
                  setMenuOpen(false);
                }}
              >
                {" "}
                Progress{" "}
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
              onClick={() => {
                navigate("/register");
              }}
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
            data-testid="profile"
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
                      <a onClick={() => navigate("/register")}>here</a>{" "}
                    </h4>
                  </>
                ) : (
                  <>
                    <button
                      className="button button--primary"
                      onClick={handleSignOut}
                      data-testid="logout-button"
                    >
                      LOG OUT
                    </button>
                    <button className="dropdown-menu-button-secondary__profile">
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
