import { useState, useEffect } from "react";
import { formatMonthYear } from "../utils/formatDate";
import { useDispatch, useSelector, useStore } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { fetchTasks } from "../store/tasksSlice";
import type { AppDispatch, AppStore, RootState } from "../store";

const Sidebar = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [monthYear, setMonthYear] = useState("");
  const [taskList, setTasksList] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   console.log(startDate);
  // }, [startDate]);
  // useEffect(() => {
  //   console.log(endDate);
  // }, [endDate]);
  useEffect(() => {
    console.log(monthYear);
    const { month, year } = formatMonthYear(monthYear);
    console.log(month, year);
    setMonth(month);
    setYear(year);
  }, [monthYear]); //format: YYYY-MM

  interface FetchTasksParams {
    gte: Date;
    lte: Date;
  }

  const handleRequestTasks = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please insert start and end date");
      console.log("Please insert start and end date");
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
      console.log(
        "start date and end date sent to store",
        dateObjStartDate,
        dateObjEndDate,
      );
    }
  };

  return (
    <div className="sidebar-container">
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
          <button className="sidebar__button-secondary"> Search Goals </button>
        </div>
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

        <div style={{ paddingTop: "15px" }}>
          <button className="sidebar__button-secondary">
            {" "}
            + Add new goal{" "}
          </button>
        </div>
        <button className="sidebar__button-primary">
          {" "}
          Check your progress!{" "}
        </button>
      </div>

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
            <li>3</li>
            <li>Completed</li>
          </div>
          <div className="sidebar__icon-title-pair">
            <li>3</li>
            <li>In progress</li>
          </div>
          <div className="sidebar__icon-title-pair">
            <li>3</li>
            <li>Pending</li>
          </div>
        </ul>
        <div style={{ paddingTop: "15px", paddingBottom: "55px" }}>
          <button className="sidebar__button-secondary">
            {" "}
            + Add new task{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
