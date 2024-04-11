import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import menu_vertical from "../assets/icons/menu-vertical.svg";

const GoalCard = ({ description, month, year, status, category }) => {
  //TO DO

  console.log(description, month, year, status, category);
  // const [isCheckedAchieved, setIsCheckedAchieved] = useState(false);
  // const [isCheckedInProgress, setIsCheckedInProgress] = useState(false);
  // const [isCheckedNeedsImprovement, setIsCheckedNeedsImprovement] =
  //   useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  // if (status === "ACHIEVED") {
  //   setIsCheckedAchieved(true);
  // } else if (status === "IN_PROGRESS") {
  //   setIsCheckedInProgress(true);
  // } else {
  //   setIsCheckedNeedsImprovement(true);
  // }
  let isCheckedAchieved;
  let isCheckedInProgress;
  let isCheckedNeedsImprovement;

  if (status === "ACHIEVED") {
    isCheckedAchieved = true;
  } else if (status === "IN_PROGRESS") {
    isCheckedInProgress = true;
  } else {
    isCheckedNeedsImprovement = true;
  }

  useEffect(() => {
    console.log("menuOpen", menuOpen);
  }, [menuOpen]);

  const handleEditClick = () => {
    // to do
  };

  const handleRemoveClick = () => {
    // to do
  };
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="dashboard__task-items dashboard__card">
      <div
        className="square center_square"
        style={{
          borderColor: `var(--${category})`,
        }}
      ></div>
      <h3 className="">{description}</h3>
      <input
        type="checkbox"
        id="checkboxAchieved"
        checked={isCheckedAchieved}
        disabled
      />
      <input
        type="checkbox"
        id="checkboxInProgress"
        checked={isCheckedInProgress}
        disabled
      />
      <input
        type="checkbox"
        id="checkboxNeedsImprovement"
        checked={isCheckedNeedsImprovement}
        disabled
      />

      <div className="task__menu">
        <img
          src={menu_vertical}
          alt="menu_vertical"
          id="menu_vertical"
          onClick={handleMenuToggle}
        />
        {menuOpen && (
          <div className="dropdown-content">
            <h4> Month: {month}</h4>
            <h4> Year: {year}</h4>
            <button className="dropdown-menu-button" onClick={handleEditClick}>
              Edit
            </button>
            <button
              className="dropdown-menu-button"
              onClick={handleRemoveClick}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
