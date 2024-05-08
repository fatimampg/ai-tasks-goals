import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { AppDispatch } from "../store";
import { updateTaskListStatus, clearMessageCounter } from "../store/tasksSlice";
import TasksList from "../components/TasksList";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Task } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/sidebar.css";
import "../styles/dashboard.css";
import waving_hand from "../assets/icons/waving-hand.svg";
import menu_vertical from "../assets/icons/menu-vertical.svg";
import { toast } from "../components/ToastManager";

const Tasks = () => {
  const [userName, setUserName] = useState("");
  //get taskList and header from Redux Store:
  const taskList = useSelector((state: RootState) => state.tasks.taskList);
  const header = useSelector((state: RootState) => state.auth.header);
  const dispatch = useDispatch<AppDispatch>();
  const [updatedTaskStatusList, setUpdatedTaskStatusList] = useState<Task[]>(
    [],
  );
  const isLoading = useSelector((state: RootState) => state.tasks.isLoading);

  // Manage show toastmessages:
  const typeMessage = useSelector(
    (state: RootState) => state.tasks.typeMessage,
  );
  const message = useSelector((state: RootState) => state.tasks.message);
  const messageCounter = useSelector(
    (state: RootState) => state.tasks.messageCounter,
  );

  useEffect(() => {
    if (message && messageCounter !== 0) {
      console.log("MESSAGE COUNTER", messageCounter);
      toast.show({
        message: message,
        duration: 2500,
        type: typeMessage,
      });
    }
  }, [messageCounter, message, typeMessage]);

  useEffect(() => {
    return () => {
      dispatch(clearMessageCounter());
    };
  }, [dispatch]);

  // useEffect(() => {
  //   console.log("MESSAGE", message);
  // }, [message]);

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
      // console.log("userName:", userName);
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
    setUpdatedTaskStatusList(updatedNewTaskList);
  };

  // Change color button SAVE TASK PROGRESS when changes in status where made:
  const updateStatusButton = document.querySelector(
    "#save-task-progress",
  ) as HTMLElement;

  const areTasksUpdated = (
    taskList: Task[],
    updatedTaskStatusList: Task[],
  ): boolean => {
    for (let i = 0; i < taskList.length; i++) {
      const taskList1 = taskList[i];
      const taskList2 = updatedTaskStatusList.find(
        (task) => task.id === taskList1.id,
      ); //taskList2 is new array with updated status containing only tasks present in taskList (based on their id's)
      if (!taskList2) continue;

      if (
        taskList1.status !== taskList2.status ||
        taskList1.percentageCompleted !== taskList2.percentageCompleted
      ) {
        return false;
      }
    }
    return true;
  };

  if (!areTasksUpdated(taskList, updatedTaskStatusList)) {
    if (updateStatusButton) {
      updateStatusButton.style.background = "var(--orange)";
    }
  } else {
    if (updateStatusButton) {
      updateStatusButton.style.background = "var(--null)";
      updateStatusButton.style.outline = "var(--null)";
    }
  }

  // Handle update task progress in the Data Base:
  const handleUpdateTasksStatus = async () => {
    console.log(
      "Updated Status Task List (from Parent: Tasks.tsx) [updatedTaskStatusList]:",
      updatedTaskStatusList,
    );
    console.log(
      "Task List (task status not updated) (from Parent: Tasks.tsx) [taskList]:",
      taskList,
    );

    const params: Task[] = updatedTaskStatusList;

    dispatch(updateTaskListStatus(params));
    console.log(
      "Updated Status Task List (from Parent: Tasks.tsx) - sent to Redux store to update the DB [updatedTaskStatusList]",
      params,
    );
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className="tasks-page">
        <div className="dashboard__main-container">
          <div className="dashboard__top-info">
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
                id="save-task-progress"
                onClick={handleUpdateTasksStatus}
              >
                Save Task Progress
              </button>
            </div>
            <div className="dashboard__identifiers">
              <div
                className="square center_square"
                style={{
                  borderColor: "var(--white)",
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
          </div>
          <div className="dashboard__list-container">
            <TasksList
              tasks={taskList}
              onUpdatefromTaskListoTasks={handleUpdateTasksTopParent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
