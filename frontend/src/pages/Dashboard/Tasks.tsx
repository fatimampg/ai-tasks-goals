import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  updateTaskListStatus,
  clearMessageCounter,
} from "../../store/tasksSlice";
import TasksList from "../../components/Tasks/TasksList";
import Sidebar from "../../components/Sidebar/Sidebar";
import TasksIdentifiers from "../../components/Tasks/TasksIdentifiers";
import DashboardHeader from "../../components/DashboardHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "../../components/Toasts/ToastManager";
import { Task } from "../../types";
import "../../components/Sidebar/sidebar.css";
import "./tasksAndGoals.css";

const Tasks = () => {
  const taskList = useSelector((state: RootState) => state.tasks.taskList);
  const header = useSelector((state: RootState) => state.auth.header);
  const dispatch = useDispatch<AppDispatch>();
  const [updatedTaskStatusList, setUpdatedTaskStatusList] = useState<Task[]>(
    [],
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const isLoading = useSelector((state: RootState) => state.tasks.isLoading);
  const isSideBarOpen = useSelector((state: RootState) => state.searchDates.sidebarOpen);

  // Manage show toast messages:
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

  // Callback function to get updated tasks from TaskList:
  const handleUpdateTasksTopParent = (updatedNewTaskList: Task[]) => {
    setUpdatedTaskStatusList(updatedNewTaskList);  
  };

  const wereChangesMade = (): boolean => {
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
        return true;
      } 
    }
    return false;
  }
  useEffect(() => {
    setIsButtonDisabled(!wereChangesMade());
  }, [taskList, updatedTaskStatusList])

  const handleUpdateTasksStatus = async () => {
    const params: Task[] = updatedTaskStatusList;
    dispatch(updateTaskListStatus(params));
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className={`main-page ${!isSideBarOpen ? '' : 'slide-up'}`}>
        <div className="dashboard__main-container">
          <div className="dashboard__top-info">
            <DashboardHeader header={header} />
            <div className="dashboard__main-title-and-button">
              <h3 className="dashboard__main-title"> TASKS:</h3>
              <button
                className="button button--primary"
                id="save-task-progress"
                onClick={handleUpdateTasksStatus}
                disabled={isButtonDisabled}
              >
                Save Task Progress
              </button>
            </div>
            <TasksIdentifiers />
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
