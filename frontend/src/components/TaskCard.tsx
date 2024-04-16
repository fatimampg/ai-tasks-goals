import { useState, useEffect, useRef, SetStateAction } from "react";
import { UseDispatch, useDispatch } from "react-redux";
import "../styles/dashboard.css";
import menu_vertical from "../assets/icons/menu-vertical.svg";
import { Task } from "../types";
import checkPercentageInput from "../utils/checkPercentageInput";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { deleteTask, updateTask } from "../store/tasksSlice";
import { AppDispatch } from "../store";
import TaskAddEditModal from "./TaskAddEditModal";

export interface UpdateTasksParams {
  id: number;
  description: string;
  priority: string;
  category: string;
  deadline: Date;
  percentageCompleted?: number | null;
  status: string;
}

const TaskCard = (props: Task) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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

  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedDeadline, setUpdatedDeadline] = useState<string>(deadline);
  const [updatedPriority, setUpdatedPriority] = useState<string>(priority);
  const [updatedCategory, setUpdatedCategory] = useState<string>(
    category || "CAREER",
  );
  const [selectedOption, setSelectedOption] = useState<string>(status);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPercentageCompleted, setUpdatedPercentageCompleted] = useState<
    number | null
  >(null);
  const [percentageInput, setPercentageInput] = useState<number>(
    percentageCompleted !== null && percentageCompleted !== undefined
      ? percentageCompleted
      : 0,
  );
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

  // Update status (to be sent to the DB):
  useEffect(() => {
    setUpdatedStatus(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    setUpdatedPercentageCompleted(percentageInput);
  }, [percentageInput]);

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

  const handleRemoveTask = () => {
    dispatch(deleteTask(props.id));
    console.log(
      "id from the task to remove - sent to Redux store - action: deleteTasks",
      props.id,
    );
  };

  const handleUpdateTask = async () => {
    setShowModal(false);
    const dateObjDeadline = new Date(updatedDeadline);
    if (isNaN(dateObjDeadline.getTime())) {
      console.log("Invalid date format");
      return;
    }
    const params: UpdateTasksParams = {
      id: id,
      description: updatedDescription,
      priority: updatedPriority,
      category: updatedCategory,
      deadline: dateObjDeadline,
      percentageCompleted: updatedPercentageCompleted,
      status: updatedStatus,
    };

    dispatch(updateTask(params));
    console.log("params sent to Redux store - action: updateTasks", params);
  };

  const handleCloseEditTask = () => {
    setShowModal(false);
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
            <button
              className="dropdown-menu-button"
              onClick={() => setShowModal(true)}
            >
              Edit
            </button>
            <button className="dropdown-menu-button" onClick={handleRemoveTask}>
              Remove
            </button>
          </div>
        )}
      </div>
      <div className="editTask">
        {showModal ? (
          <Modal>
            <TaskAddEditModal
              //Pass current values into TaskEditAddModal:
              updatedDescription={updatedDescription}
              updatedPriority={updatedPriority}
              updatedCategory={updatedCategory}
              updatedDeadline={updatedDeadline}
              //Pass functions set... to TaskEditAddModal to update the values (here) by the ones obtained in TaskEditAddModal:
              onUpdateDescription={setUpdatedDescription}
              onUpdatePriority={setUpdatedPriority}
              onUpdateCategory={setUpdatedCategory}
              onUpdateDeadline={setUpdatedDeadline}
              onSave={handleUpdateTask}
              onClose={() => setShowModal(false)}
            />
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default TaskCard;
