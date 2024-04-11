import { useState, useEffect, SetStateAction } from "react";
import "../styles/dashboard.css";
import menu_vertical from "../assets/icons/menu-vertical.svg";
import { Task } from "../types";
import checkPercentageInput from "../utils/checkPercentageInput";
import { useRef } from "react";

const TaskCard = (props: Task) => {
  const {
    id,
    description,
    deadline,
    belongsToId,
    status,
    percentageCompleted,
    priority,
    relatedGoalId,
    category,
  } = props;

  console.log(
    description,
    deadline,
    status,
    percentageCompleted,
    priority,
    category,
  );
  const [percentageInput, setPercentageInput] = useState<number>(
    percentageCompleted !== null && percentageCompleted !== undefined
      ? percentageCompleted
      : 0,
  );
  const [selectedOption, setSelectedOption] = useState<string>(status);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPercentageCompleted, setUpdatedPercentageCompleted] =
    useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      console.log(menuOpen, "menuOpen withing handleClickOutsideMenu");
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  });

  //Load state stored in the DB:
  useEffect(() => {
    setSelectedOption(status);
    if (percentageCompleted !== null && percentageCompleted !== undefined) {
      setPercentageInput(percentageCompleted);
    }
  }, [status, percentageCompleted]);

  // TO BE SENT TO DB: Update status based on user input:
  useEffect(() => {
    setUpdatedStatus(selectedOption);
  }, [selectedOption]);

  // TO BE SENT TO DB: Update percentageCompleted based on user input:
  useEffect(() => {
    setUpdatedPercentageCompleted(
      (percentageInput !== null && percentageInput !== undefined
        ? percentageInput
        : null) as SetStateAction<null>,
    );
  }, [percentageInput]);

  // Update selectedOption and percentage based on the changes made by the user:
  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const handlePercentageChange = (e) => {
    setPercentageInput(e.target.value);
  };
  //Clear %input in case another option (besides IN_PROGRESS) is selected:
  useEffect(() => {
    if (selectedOption !== "IN_PROGRESS") {
      setPercentageInput(0);
    }
  }, [selectedOption]);

  const handleEditClick = () => {
    // to do
  };

  const handleRemoveClick = () => {
    // to do
  };
  const formattedDeadline = new Date(deadline).toLocaleDateString();
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
        type="radio"
        id={`checkboxToDo_${id}`}
        name={`progress_${id}`}
        value="TO_DO"
        onClick={handleRadioChange}
        checked={selectedOption === "TO_DO"}
      />
      <input
        type="radio"
        id={`checkboxPercentage_${id}`}
        name={`progress_${id}`}
        value="IN_PROGRESS"
        onClick={handleRadioChange}
        checked={selectedOption === "IN_PROGRESS"}
      />
      <input
        type="text"
        name={`percentageCompleted_${id}`}
        id={`percentageCompleted_${id}`}
        placeholder="%"
        value={percentageInput || ""}
        onChange={handlePercentageChange}
        disabled={selectedOption !== "IN_PROGRESS"}
        onKeyDown={checkPercentageInput}
      />
      <input
        type="radio"
        id={`checkboxCompleted_${id}`}
        name={`progress_${id}`}
        value="COMPLETED"
        onClick={handleRadioChange}
        checked={selectedOption === "COMPLETED"}
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
            <h4> Priority: {priority}</h4>
            <h4> Deadline: {formattedDeadline}</h4>
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

export default TaskCard;
