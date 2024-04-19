import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/sidebar.css";
import TasksList from "../components/TasksList";
import waving_hand from "../assets/icons/waving-hand.svg";
import menu_vertical from "../assets/icons/menu-vertical.svg";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "axios";
import { Task } from "../types";
import { UseDispatch, useDispatch } from "react-redux";
import { AppDispatch } from "../store";

const Tasks = () => {
  const [userName, setUserName] = useState("");
  //get taskList and header from Redux Stroe:
  const taskList = useSelector((state: RootState) => state.tasks.taskList);
  console.log("INITIAL taskList (Redux) - taskList from Tasks.tsx", taskList);
  const header = useSelector((state: RootState) => state.auth.header);
  const dispatch = useDispatch<AppDispatch>();
  const [updatedTaskListToSendDb, setUpdatedTaskListToSendDb] = useState<
    Task[]
  >([]);

  //Request userName:
  const getUserName = async (header: { [key: string]: string }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_AUTH_URL}/api/username`,
        {
          headers: header,
        },
      );
      const userName = response.data.userName;
      console.log("userName:", userName);
      setUserName(userName);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserName(header);
  }, [header]);

  // Get current date:
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Callback function to get updated tasks from TaskList:
  const handleUpdateTasksTopParent = (updatedNewTaskList: Task[]) => {
    setUpdatedTaskListToSendDb(updatedNewTaskList);
    //TO DO
  };
  useEffect(() => {
    console.log(
      "Task List with updated status (from Parent: Tasks.tsx) - SEND TO THE DATABASE:",
      updatedTaskListToSendDb,
    );
  }, [updatedTaskListToSendDb]);

  return (
    <div>
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className="tasks-page">
        <div className="dashboard__main-container">
          <div className="dashboard__title-welcome">
            <h2> Hello {userName}</h2>
            <img
              src={waving_hand}
              alt="waving-hand"
              className="icon__waving-hand"
            />
          </div>

          <h3 className="dashboard__sub-title">Today, {formattedDate}</h3>
          <div className="dashboard__main-title-and-button">
            <h2 className="dashboard__main-title"> Tasks:</h2>
            <button
              className="button button--primary"
              // onClick={handleUpdateTasksStatus} --> TO DO
            >
              Save Task Progress
            </button>
          </div>
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
          {/* Get updated tasks (status and % completed) from TaskList.tsx */}
          <TasksList
            tasks={taskList}
            onUpdatefromTaskListoTasks={handleUpdateTasksTopParent}
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
