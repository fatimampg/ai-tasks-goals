import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks, addTask } from "../../store/tasksSlice";
import { fetchGoals, addGoal } from "../../store/goalsSlice";
import {
  storedTaskDateSearch,
  storedGoalMonthSearch,
  storedSidebarOpenState
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
import { Task, AddTasksParams, AddGoalsParams } from "../../types";
import "./sidebar.css";
import DateStartEndInput from "./DateStartEndInput";
import downArrow from "../../assets/icons/down-arrow.svg";
import upArrow from "../../assets/icons/up-arrow.svg";
import { set } from "cypress/types/lodash";
import { boolean } from "zod";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const taskDates = useSelector(
    (state: RootState) => state.searchDates.taskDates,
  );
  let startDateStored: string | null = null;
  let endDateStored: string | null = null;
  if (taskDates && taskDates.gte && taskDates.lte) {
    startDateStored = formatDateToString(taskDates.gte);
    endDateStored = formatDateToString(taskDates.lte);
  }
  // if (taskDates) {
  //   startDateStored = formatDateToString(taskDates.gte);
  //   endDateStored = formatDateToString(taskDates.lte);
  // }

  const sidebarOpenState = useSelector(
    (state: RootState) => state.searchDates.sidebarOpen,
  );
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
  
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  let currentPath = window.location.pathname;
  // useEffect(() => {
  //   let currentPath = window.location.pathname;
  //   // if (currentPath === '/goals') {
  //   //   sidebarClass = 'closedGoals';
  //   // } else if (currentPath === '/tasks') {
  //   //   sidebarClass = 'closedTasks';
  //   // }
  //   console.log(currentPath);
  // }, []);

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

      const params: { gte: Date; lte: Date } = {
        gte: dateObjStartDate as Date,
        lte: dateObjEndDate as Date,
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
      const params: { month: number; year: number } = {
        month: month as number,
        year: year as number,
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

  const handleOpenCloseSidebar = () => {
    setIsSideBarOpen(prevState => {
      const newState = !prevState;
      dispatch(storedSidebarOpenState(newState));
      console.log(newState, "from navbar");
      return newState;
    })
  }
  

  // useEffect(() => {
  //   console.log(isSideBarOpen, "from navbar");

  //   dispatch(storedSidebarOpenState(false));
  // }, [isSideBarOpen]);

  return (
    <div className={`sidebar-wrapper ${!isSideBarOpen ? '' : (currentPath === "/tasks" ? 'closed-tasks' : 'closed-goals')}`}>
    {/* <div className={`sidebar-wrapper ${!isSideBarOpen ? '' : sidebarClass}`}> */}
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
            <h4>Goals:</h4>
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
            <h4>Tasks:</h4>
            <DateStartEndInput
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              handleRequestTasks={handleRequestTasks}
            />
            <ul>
              <div className="sidebar__icon-title-pair">
                <li data-testid="count-taskCompleted">
                  {numberTasksCompleted}
                </li>
                <li>Completed</li>
              </div>
              <div className="sidebar__icon-title-pair">
                <li data-testid="count-taskInProgress">
                  {numberTasksInProgress}
                </li>
                <li>In progress</li>
              </div>
              <div className="sidebar__icon-title-pair">
                <li data-testid="count-taskToDo">{numberTasksToDo}</li>
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
      <div className="open-close-icon">
        <button  onClick={handleOpenCloseSidebar}>
            {isSideBarOpen ? (
              <img src={downArrow} alt="down arrow" width="20" />
            ) : (
              <img src={upArrow} alt="up arrow" width="20" />
            )} 
        </button>
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