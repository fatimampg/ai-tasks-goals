import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import GoalAddEditModal from "./GoalAddEditModal";
import { deleteGoal, updateGoal } from "../store/goalsSlice";
import { AppDispatch } from "../store";
import { Goal } from "../types";

import menu_vertical from "../assets/icons/menu-vertical.svg";

const GoalCard = ({ goal }: { goal: Goal }) => {
  const { id, description, month, year, belongsToId, category, status } = goal;
  const dispatch = useDispatch<AppDispatch>(); // TypeScript infer the type of the dispacth function
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  //State of inputs that will be updated in the DB using a button in this component:
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedMonth, setUpdatedMonth] = useState<number>(month);
  const [updatedYear, setUpdatedYear] = useState<number>(year);
  const [updatedCategory, setUpdatedCategory] = useState<string>(
    category || "CAREER",
  );
  const [updatedStatus, setUpdatedStatus] = useState<string>(status ?? ""); //Status will be updated based on the response of the AI model.

  // Handle clicking outside the dropdown menu:
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  const handleClickOutsideMenu = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as HTMLDivElement)
    ) {
      e.stopPropagation();
      setMenuOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  });

  // Display checked box depending on the status fetched from DB:
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

  const handleUpdateGoal = async () => {
    setShowModal(false);

    const monthF = updatedMonth;
    const yearF = updatedYear;

    const params: Goal = {
      id: id,
      description: updatedDescription,
      month: monthF,
      year: yearF,
      category: updatedCategory,
      status: updatedStatus,
      belongsToId: goal.belongsToId,
      tasks: goal.tasks,
    };

    dispatch(updateGoal(params));
    // console.log("params sent to Redux store - action: updateGoal", params);
  };

  const handleCloseEditGoal = () => {
    setShowModal(false);
  };
  const handleRemoveGoal = () => {
    dispatch(deleteGoal(goal.id));
  };

  return (
    <div className="dashboard__task-items dashboard__card">
      <div
        className="square center_square"
        style={{
          borderColor: `var(--${category})`,
        }}
      ></div>
      <h3 className="dashboard__task-description">{description}</h3>
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
          <div className="dropdown-content" ref={dropdownRef}>
            <h4> Month: {month}</h4>
            <h4> Year: {year}</h4>
            <button
              className="dropdown-menu-button"
              onClick={() => setShowModal(true)}
            >
              Edit
            </button>
            <button className="dropdown-menu-button" onClick={handleRemoveGoal}>
              Remove
            </button>
          </div>
        )}
      </div>
      <div className="editTask">
        {showModal ? (
          <Modal>
            <GoalAddEditModal
              //Pass current values into GoalEditAddModal:
              updatedDescription={updatedDescription}
              updatedCategory={updatedCategory}
              updatedMonth={updatedMonth}
              updatedYear={updatedYear}
              onUpdateDescription={setUpdatedDescription}
              onUpdateCategory={setUpdatedCategory}
              onUpdateMonth={setUpdatedMonth}
              onUpdateYear={setUpdatedYear}
              onSave={handleUpdateGoal}
              onClose={() => setShowModal(false)}
            />
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default GoalCard;
