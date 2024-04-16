import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/sidebar.css";
import TasksList from "../components/TasksList";
import waving_hand from "../assets/icons/waving-hand.svg";
import menu_vertical from "../assets/icons/menu-vertical.svg";
import { UseSelector, useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "axios";

const Tasks = () => {
  const [userName, setUserName] = useState("");
  const taskList = useSelector((state: RootState) => state.tasks.taskList);
  console.log("taskList (Redux)", taskList);

  const header = useSelector((state: RootState) => state.auth.header);

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

  // Current date:
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
