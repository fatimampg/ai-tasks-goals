import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/sidebar.css";
import TasksList from "../components/TasksList";
import waving_hand from "../assets/icons/waving-hand.svg";
import menu_vertical from "../assets/icons/menu-vertical.svg";
import { UseSelector, useSelector } from "react-redux";
import { RootState } from "../store";

const Tasks = () => {
  const taskList = useSelector((state: RootState) => state.tasks.taskList);
  console.log("taskList received from Redux (at Tasks.tsx)", taskList);

  //Request userName:
  const userId = useSelector((state: RootState) => state.auth.header);
  console.log("header received in Tasks", userId);

  return (
    <div>
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className="tasks-page">
        <div className="dashboard__main-container">
          <div className="dashboard__title-welcome">
            <h2> Hello usr (replace)</h2>
            <img
              src={waving_hand}
              alt="waving-hand"
              className="icon__waving-hand"
            />
          </div>

          <h3 className="dashboard__sub-title">
            Today, Mon 25 March 2024 (replace data)
          </h3>
          <h2 className="dashboard__main-title"> Tasks:</h2>
          <div className="dashboard__identifiers">
            <div
              className="square center_square"
              style={{
                borderColor: "transparent",
              }}
            ></div>
            <h3> Description:</h3>
            <h3> To do:</h3>
            <h3>
              {" "}
              In progress
              <br />
              [% completed]:
            </h3>
            <h3> Done:</h3>
            <img src={menu_vertical} alt="menu_vertical" id="menu_vertical" />
          </div>
          <TasksList tasks={taskList} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
