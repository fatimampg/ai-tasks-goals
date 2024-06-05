import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteTask, updateTask } from "../../store/tasksSlice";
import { AppDispatch } from "../../store";
import Modal from "../Modal";
import TaskAddEditModal from "./TaskAddEditModal";
import { Task } from "../../types";
import checkPercentageInput from "../../utils/checkPercentageInput";
import menu_vertical from "../../assets/icons/menu-vertical.svg";

const TaskCard = ({
  task,
  onUpdatefromTaskCardToTaskList, // triggered when status change - send updated task status to the parent component (TasksList)
}: {
  task: Task;
  onUpdatefromTaskCardToTaskList: (
    taskId: number,
    updatedTaskData: Partial<Task>,
  ) => void;
}) => {
  const [showModal, setShowModal] = useState(false);

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
  } = task;

  // Task status update:
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedPercentageCompleted, setUpdatedPercentageCompleted] = useState<
    number | null
  >(null);
  const [percentageInput, setPercentageInput] = useState<number>(
    percentageCompleted !== null && percentageCompleted !== undefined
      ? Number(percentageCompleted)
      : 0,
  );
  //To be passed into TaskList.tsx:
  useEffect(() => {
    onUpdatefromTaskCardToTaskList(id, {
      status: updatedStatus,
      percentageCompleted: updatedPercentageCompleted,
    });
  }, [updatedStatus, updatedPercentageCompleted]);

  //State of inputs that will be updated in the DB within this component:
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedDeadline, setUpdatedDeadline] = useState<Date>(deadline);
  const [updatedPriority, setUpdatedPriority] = useState<string>(priority);
  const [updatedCategory, setUpdatedCategory] = useState<string>(
    category || "CAREER",
  );
  const [selectedOption, setSelectedOption] = useState<string>(status);
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

  const handleRadioChange = (e: any) => {
    setSelectedOption(e.target.value);
  };
  const handlePercentageChange = (e: any) => {
    const inputValue = e.target.value.trim(); //remove white spaces if added
    if (inputValue > 100) {
      alert("Percentage completed shouldn't be higher than 100%"); //for input using smartphone
      setPercentageInput(0);
    }
    const numberInputValue = parseFloat(inputValue);
    setPercentageInput(numberInputValue);
  };

  //Clear %input in case another option (besides IN_PROGRESS) is selected:
  useEffect(() => {
    if (selectedOption !== "IN_PROGRESS") {
      setPercentageInput(0);
    }
  }, [selectedOption]);

  const handleRemoveTask = () => {
    dispatch(deleteTask(task.id));
  };

  const handleUpdateTask = async () => {
    setShowModal(false);
    const dateObjDeadline = new Date(updatedDeadline);

    if (isNaN(dateObjDeadline.getTime())) {
      console.log("Invalid date format");
      return;
    }
    const params: Task = {
      id: id,
      description: updatedDescription,
      priority: updatedPriority,
      category: updatedCategory,
      deadline: dateObjDeadline,
      percentageCompleted: updatedPercentageCompleted,
      status: updatedStatus,
      belongsToId: task.belongsToId,
      relatedGoalId: task.relatedGoalId,
    };
    dispatch(updateTask(params));
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
      <h3 className="dashboard__task-description">{description}</h3>
      <input
        type="radio"
        id={`checkboxToDo_${id}`}
        name={`progress_${id}`}
        value="TO_DO"
        onChange={handleRadioChange}
        checked={selectedOption === "TO_DO"}
      />
      <input
        type="radio"
        id={`checkboxPercentage_${id}`}
        name={`progress_${id}`}
        value="IN_PROGRESS"
        onChange={handleRadioChange}
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
        onChange={handleRadioChange}
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
          <div
            className="dropdown-content"
            data-testid="dropdown-content"
            ref={dropdownRef}
          >
            <h4> Priority: {priority}</h4>
            <h4> Deadline: {formattedDeadline}</h4>
            <div className="task-progress">
              <label id={`checkboxToDo_${id}`}> To do:</label>
              <input
                type="radio"
                id={`checkboxToDo_${id}`}
                name={`progress_${id}`}
                value="TO_DO"
                onChange={handleRadioChange}
                checked={selectedOption === "TO_DO"}
              />
              <label id={`checkboxPercentage_${id}`}> In progress:</label>
              <input
                type="radio"
                id={`checkboxPercentage_${id}`}
                name={`progress_${id}`}
                value="IN_PROGRESS"
                onChange={handleRadioChange}
                checked={selectedOption === "IN_PROGRESS"}
              />
              <label id={`percentageCompleted_${id}`} />
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
              <label id={`checkboxCompleted_${id}`}> Completed:</label>
              <input
                type="radio"
                id={`checkboxCompleted_${id}`}
                name={`progress_${id}`}
                value="COMPLETED"
                onChange={handleRadioChange}
                checked={selectedOption === "COMPLETED"}
              />
            </div>
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
              updatedDescription={updatedDescription}
              updatedPriority={updatedPriority}
              updatedCategory={updatedCategory}
              updatedDeadline={updatedDeadline}
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
