import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./Modal";
import TaskAddEditModal from "./TaskAddEditModal";
import GoalAddEditModal from "./GoalAddEditModal";
import { fetchTasks, addTask } from "../store/tasksSlice";
import { fetchGoals, addGoal } from "../store/goalsSlice";
import {
  storedTaskDateSearch,
  storedGoalMonthSearch,
} from "../store/searchDatesSlice";
import { RootState } from "../store";
import type { AppDispatch } from "../store";
import { formatMonthYear, formatDateToString } from "../utils/formatDate";
import { Task, Goal } from "../types";
import { toast } from "../components/ToastManager";

export interface AddTasksParams {
  description: string;
  priority: string;
  category: string;
  deadline: Date;
}
export interface AddGoalsParams {
  description: string;
  month: number;
  year: number;
  category: string;
}
export interface FetchGoalsParams {
  month: number;
  year: number;
}
export interface FetchTasksParams {
  gte: Date;
  lte: Date;
}

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
    // console.log("startDate2", startDateStored, typeof startDateStored);
    // console.log("endDate2", endDateStored, typeof endDateStored);
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
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

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
    // console.log("HERE IS MONTHYEAR", monthYear);
    const { month, year } = formatMonthYear(monthYear);
    setMonth(parseInt(month)); //parse month string into a number
    setYear(parseInt(year));
    dispatch(
      storedGoalMonthSearch({ month: parseInt(month), year: parseInt(year) }),
    );
    console.log(
      "SIDEBAR: month and year dispatched into the search data slice",
      parseInt(month),
      parseInt(year),
    );
  }, [monthYear]); //format: YYYY-MM

  const handleRequestTasks = async () => {
    if (!startDate || !endDate) {
      // alert("Please insert start and end date");
      toast.show({
        message: "Please select a start date and an end date.",
        duration: 3500,
        type: "error",
      });
      // console.log("Please insert start and end date");
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
      // alert("Please insert month and year");
      // console.log("Please insert month and year");
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
    // console.log("params sent to Redux store - action: addTasks", params);
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
    console.log("params sent to Redux store - action: addGoal", params);
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
              <div className="sidebar__search-box">
                <div className="sidebar__insert--date">
                  <label htmlFor="month" style={{ fontSize: "16px" }}>
                    {" "}
                    Month:
                  </label>
                  <input
                    type="month"
                    id="month"
                    className="sidebar__month-input"
                    value={monthYear}
                    onChange={(e) => setMonthYear(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        <div className="sidebar__categories">
          <h3 style={{ paddingBottom: "5px" }}>Categories:</h3>
          <ul>
            <div className="sidebar__icon-title-pair">
              <div
                className="square"
                style={{ borderColor: "var(--CAREER)" }}
              ></div>
              <li>Career</li>
            </div>
            <div className="sidebar__icon-title-pair">
              <div
                className="square"
                style={{ borderColor: "var(--PERSONAL_DEVELOPMENT)" }}
              ></div>
              <li>Personal development</li>
            </div>
            <div className="sidebar__icon-title-pair">
              <div
                className="square"
                style={{ borderColor: "var(--HEALTH_AND_WELLNESS)" }}
              ></div>
              <li>Health and wellness</li>
            </div>
            <div className="sidebar__icon-title-pair">
              <div
                className="square"
                style={{ borderColor: "var(--FINANCIAL)" }}
              ></div>
              <li>Financial</li>
            </div>
            <div className="sidebar__icon-title-pair">
              <div
                className="square"
                style={{ borderColor: "var(--FAMILY_AND_FRIENDS)" }}
              ></div>
              <li>Family and friends</li>
            </div>
            <div className="sidebar__icon-title-pair">
              <div
                className="square"
                style={{ borderColor: "var(--LEISURE)" }}
              ></div>
              <li>Leisure</li>
            </div>
          </ul>
        </div>
        {location.pathname === "/goals" && (
          <div className="sidebar__goals-items">
            <h1>Goals</h1>
            <div className="sidebar__search-box">
              <div className="sidebar__insert--date">
                <label htmlFor="month" style={{ fontSize: "16px" }}>
                  {" "}
                  Month:
                </label>
                <input
                  type="month"
                  id="month"
                  className="sidebar__month-input"
                  value={monthYear}
                  onChange={(e) => setMonthYear(e.target.value)}
                />
              </div>
              <button
                className="sidebar__button-secondary"
                onClick={handleRequestGoals}
              >
                Search Goals
              </button>
            </div>
            <div className="add-task-goal-button">
              <button
                className="sidebar__button-secondary"
                onClick={() => setShowAddGoalModal(true)}
              >
                + Add new goal
              </button>
            </div>
          </div>
        )}

        {location.pathname === "/tasks" && (
          <div className="sidebar__tasks-items">
            <h1>Tasks</h1>
            <div className="sidebar__search-box">
              <div className="sidebar__text-date-pair">
                <label htmlFor="date_start" style={{ fontSize: "16px" }}>
                  {" "}
                  From:
                </label>
                <input
                  type="date"
                  id="date_start"
                  name="date-start"
                  className="sidebar__date-input"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    console.log("startDate", e.target.value);
                  }}
                />
              </div>
              <div className="sidebar__text-date-pair">
                <label
                  htmlFor="date_end"
                  style={{ fontSize: "16px", paddingRight: "19px" }}
                >
                  {" "}
                  to:
                </label>
                <input
                  type="date"
                  id="date_end"
                  name="date_end"
                  className="sidebar__date-input"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    console.log("endDate", e.target.value);
                  }}
                />
              </div>
              <button
                className="sidebar__button-secondary"
                style={{ marginTop: "15px" }}
                onClick={handleRequestTasks}
              >
                {" "}
                Search tasks{" "}
              </button>
            </div>
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
                {" "}
                + Add new task{" "}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="addTask">
        {showAddTaskModal ? (
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
