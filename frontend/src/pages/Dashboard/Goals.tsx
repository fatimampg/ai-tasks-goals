import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { RootState } from "../../store";
import { clearMessageCounter } from "../../store/goalsSlice";
import Sidebar from "../../components/Sidebar/Sidebar";
import GoalsList from "../../components/Goals/GoalsList";
import GoalsIdentifiers from "../../components/Goals/GoalsIdentifiers";
import DashboardHeader from "../../components/DashboardHeader";
import { toast } from "../../components/Toasts/ToastManager";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./tasksAndGoals.css";

const Goals = () => {
  const goalList = useSelector((state: RootState) => state.goals.goalList);
  const isLoading = useSelector((state: RootState) => state.goals.isLoading);
  const header = useSelector((state: RootState) => state.auth.header);
  const dispatch = useDispatch<AppDispatch>();

  // Toastmessages:
  const typeMessage = useSelector(
    (state: RootState) => state.goals.typeMessage,
  );
  const message = useSelector((state: RootState) => state.goals.message);
  const messageCounter = useSelector(
    (state: RootState) => state.goals.messageCounter,
  );

  useEffect(() => {
    if (message && messageCounter !== 0) {
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

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className="main-page">
        <div className="dashboard__main-container">
          <div className="dashboard__top-info">
            <DashboardHeader header={header} />
            <h2 className="dashboard__main-title"> Goals:</h2>
            <GoalsIdentifiers />
          </div>
          <div className="dashboard__list-container">
            <GoalsList goals={goalList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;