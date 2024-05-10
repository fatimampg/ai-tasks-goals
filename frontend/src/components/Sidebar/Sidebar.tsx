import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, addTask } from "../../store/tasksSlice";
import { fetchGoals, addGoal } from "../../store/goalsSlice";
import {
  storedTaskDateSearch,
  storedGoalMonthSearch,
} from "../../store/searchDatesSlice";
import { RootState } from "../../store";
import type { AppDispatch } from "../../store";
import Modal from "../Modal";
import TaskAddEditModal from "../Tasks/TaskAddEditModal";
import GoalAddEditModal from "../Goals/GoalAddEditModal";
import Categories from "./Categories";
import MonthInput from "./MonthInput";
import { toast } from "../Toasts/ToastManager";
import { formatMonthYear, formatDateToString } from "../../utils/formatDate";
import {
  Task,
  Goal,
  AddTasksParams,
  AddGoalsParams,
  FetchGoalsParams,
  FetchTasksParams,
} from "../../types";
import "./sidebar.css";
import DateStartEndInput from "./DateStartEndInput";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  // Get last search (dates) for tasks and goals:
  const taskDates = useSelector(
    (state: RootState) => state.searchDates.taskDates,
  );
  let startDateStored: string | null = null;
  let endDateStored: string | null = null;
  if (taskDates) {
    startDateStored = formatDateToString(taskDates.gte);
    endDateStored = formatDateToString(taskDates.lte);
  }

  const goalsMonth = useSelector(
    (state: RootState) => state.searchDates.goalsMonth,
  );
  let monthYearStored: string = "";
  if (goalsMonth) {
    monthYearStored = `${goalsMonth.year}-0${goalsMonth.month}`;
  }

  const [startDate, setStartDate] = useState<string>(startDateStored ?? "");
  const [endDate, setEndDate] = useState<string>(endDateStored ?? "");
  const [monthYear, setMonthYear] = useState(monthYearStored ?? "");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedDeadline, setUpdatedDeadline] = useState<Date>(new Date());
  const [updatedPriority, setUpdatedPriority] = useState<string>("MODERATE");
  const [updatedCategory, setUpdatedCategory] = useState<string>("CAREER");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [updatedMonth, setUpdatedMonth] = useState<number>(currentMonth);
  const [updatedYear, setUpdatedYear] = useState<number>(currentYear);

  const taskList = useSelector((state: RootState) => state.tasks.taskList);
  const [numberTasksCompleted, setNumberTasksCompleted] = useState(0);
  const [numberTasksInProgress, setNumberTasksInProgress] = useState(0);
  const [numberTasksToDo, setNumberTasksToDo] = useState(0);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // Count number of tasks completed, in progress and to do:
  const countTaskStatus = (taskList: Task[]) => {
    const countTasksCompleted = taskList.filter(
      (task: Task) => task.status === "COMPLETED",
    ).length;
    setNumberTasksCompleted(countTasksCompleted);

    const countTasksInProgress = taskList.filter(
      (task: Task) => task.status === "IN_PROGRESS",
    ).length;
    setNumberTasksInProgress(countTasksInProgress);

    const countTasksToDo = taskList.filter(
      (task: Task) => task.status === "TO_DO",
    ).length;
    setNumberTasksToDo(countTasksToDo);
  };

  useEffect(() => {
    countTaskStatus(taskList);
  }, [taskList]);

  // Extract month and year from monthYear (format compatible with the DB):
  useEffect(() => {
    const { month, year } = formatMonthYear(monthYear);
    setMonth(parseInt(month));
    setYear(parseInt(year));
    dispatch(
      storedGoalMonthSearch({ month: parseInt(month), year: parseInt(year) }),
    );
  }, [monthYear]); //format: YYYY-MM

  const handleRequestTasks = async () => {
    if (!startDate || !endDate) {
      toast.show({
        message: "Please select a start date and an end date.",
        duration: 3500,
        type: "error",
      });
      return;
    } else {
      const dateObjStartDate = new Date(startDate);
      const dateObjEndDate = new Date(endDate);
      if (
        isNaN(dateObjStartDate.getTime()) ||
        isNaN(dateObjEndDate.getTime())
      ) {
        console.log("Invalid date format");
        return;
      }
      const params: FetchTasksParams = {
        gte: dateObjStartDate,
        lte: dateObjEndDate,
      };
      dispatch(fetchTasks(params));
      dispatch(storedTaskDateSearch(params));
    }
  };

  const handleRequestGoals = async () => {
    if (!month || !year) {
      toast.show({
        message: "Please select month and year.",
        duration: 3500,
        type: "error",
      });
      return;
    } else {
      const params: FetchGoalsParams = {
        month: month,
        year: year,
      };
      dispatch(fetchGoals(params));
      dispatch(storedGoalMonthSearch(params));
    }
  };

  const handleAddTask = () => {
    setShowAddTaskModal(false);
    const dateObjDeadline = new Date(updatedDeadline);
    if (isNaN(dateObjDeadline.getTime())) {
      console.log("Invalid date format");
      return;
    }
    const params: AddTasksParams = {
      description: updatedDescription,
      priority: updatedPriority,
      category: updatedCategory,
      deadline: dateObjDeadline,
    };
    dispatch(addTask(params));
  };

  const handleAddGoal = () => {
    setShowAddGoalModal(false);
    const params: AddGoalsParams = {
      description: updatedDescription,
      month: updatedMonth,
      year: updatedYear,
      category: updatedCategory,
    };
    dispatch(addGoal(params));
  };

  return (
    <div>
      <div className="sidebar-container">
        {location.pathname === "/progress" && (
          <>
            <div
              className="sidebar__progress-items"
              style={{ marginTop: "5px" }}
            >
              <MonthInput monthYear={monthYear} setMonthYear={setMonthYear} />
            </div>
          </>
        )}
        <Categories />

        {location.pathname === "/goals" && (
          <div className="sidebar__goals-items">
            <h1>Goals</h1>
            <MonthInput monthYear={monthYear} setMonthYear={setMonthYear} />
            <button
              className="sidebar__button-secondary"
              onClick={handleRequestGoals}
            >
              Search Goals
            </button>
            <div className="add-task-goal-button">
              <button
                className="sidebar__button-secondary"
                onClick={() => setShowAddGoalModal(true)}
              >
                Add new goal
              </button>
            </div>
          </div>
        )}

        {location.pathname === "/tasks" && (
          <div className="sidebar__tasks-items">
            <h1>Tasks</h1>
            <DateStartEndInput
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              handleRequestTasks={handleRequestTasks}
            />
            <ul>
              <div className="sidebar__icon-title-pair">
                <li>{numberTasksCompleted}</li>
                <li>Completed</li>
              </div>
              <div className="sidebar__icon-title-pair">
                <li>{numberTasksInProgress}</li>
                <li>In progress</li>
              </div>
              <div className="sidebar__icon-title-pair">
                <li>{numberTasksToDo}</li>
                <li>Pending</li>
              </div>
            </ul>
            <div className="add-task-goal-button">
              <button
                className="sidebar__button-secondary"
                onClick={() => setShowAddTaskModal(true)}
              >
                Add new task
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="addTask">
        {showAddTaskModal ? (
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
              onSave={handleAddTask}
              onClose={() => setShowAddTaskModal(false)}
            />
          </Modal>
        ) : null}
      </div>
      <div className="addTask">
        {showAddGoalModal ? (
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
              onSave={handleAddGoal}
              onClose={() => setShowAddGoalModal(false)}
            />
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default Sidebar;
