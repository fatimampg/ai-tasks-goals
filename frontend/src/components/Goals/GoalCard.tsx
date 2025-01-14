import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteGoal, updateGoal } from "../../store/goalsSlice";
import { AppDispatch } from "../../store";
import Modal from "../Modal";
import GoalAddEditModal from "./GoalAddEditModal";
import { Goal } from "../../types";
import menu_vertical from "../../assets/icons/menu-vertical.svg";

const GoalCard = ({ goal }: { goal: Goal }) => {
  const { id, description, month, year, belongsToId, category, status } = goal;
  const dispatch = useDispatch<AppDispatch>();
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedMonth, setUpdatedMonth] = useState<number>(month);
  const [updatedYear, setUpdatedYear] = useState<number>(year);
  const [updatedCategory, setUpdatedCategory] = useState<string>(
    category || "CAREER",
  );

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
      status: status,
      belongsToId: goal.belongsToId,
      tasks: goal.tasks,
    };
    dispatch(updateGoal(params));
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
      <p className="dashboard__task-description">{description}</p>
      <input
        type="checkbox"
        id="checkboxAchieved"
        checked={status === "ACHIEVED"}
        disabled
        data-testid="checkboxAchieved"
      />
      <input
        type="checkbox"
        id="checkboxInProgress"
        checked={status === "IN_PROGRESS"}
        disabled
        data-testid="checkboxInProgress"
      />
      <input
        type="checkbox"
        id="checkboxNeedsImprovement"
        checked={status === "NEEDS_IMPROVEMENT"}
        disabled
        data-testid="checkboxNeedsImprovement"
      />

      <div className="task__menu">
        <img
          src={menu_vertical}
          alt="menu_vertical"
          id="menu_vertical"
          onClick={handleMenuToggle}
        />
        {menuOpen && (
          <div
            className="dropdown-content"
            ref={dropdownRef}
            data-testid="dropdown-content"
          >
            <p> Month: {month}</p>
            <p> Year: {year}</p>
            <div className="task-progress">
              <div className="task-progress-state-set">
                <input
                  type="checkbox"
                  id="checkboxAchieved"
                  checked={status === "ACHIEVED"}
                  disabled
                  />
                  <label> Achieved</label>
              </div>
              <div className="task-progress-state-set">
                <input
                  type="checkbox"
                  id="checkboxInProgress"
                  checked={status === "IN_PROGRESS"}
                  disabled
                />
                <label> In progress</label>
              </div>
              <div className="task-progress-state-set">
                <input
                  type="checkbox"
                  id="checkboxNeedsImprovement"
                  checked={status === "NEEDS_IMPROVEMENT"}
                  disabled
                />
                <label> Needs Improvement:</label>
              </div>

            </div>
              <div className="dropdown-menu__set">
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
            </div>
        )}
      </div>
      <div className="editTask">
        {showModal ? (
          <Modal>
            <GoalAddEditModal
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
