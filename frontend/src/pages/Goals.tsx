import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { RootState } from "../store";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import GoalsList from "../components/GoalsList";
import { clearMessageCounter } from "../store/goalsSlice";
import { Goal } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/sidebar.css";
import "../styles/dashboard.css";
import waving_hand from "../assets/icons/waving-hand.svg";
import menu_vertical from "../assets/icons/menu-vertical.svg";
import { toast } from "../components/ToastManager";

const Goals = () => {
  const [userName, setUserName] = useState("");
  //get taskList and header from Redux Store:
  const goalList = useSelector((state: RootState) => state.goals.goalList);
  const isLoading = useSelector((state: RootState) => state.goals.isLoading);

  const header = useSelector((state: RootState) => state.auth.header);
  const dispatch = useDispatch<AppDispatch>();

  // Manage show toastmessages:
  const typeMessage = useSelector(
    (state: RootState) => state.goals.typeMessage,
  );
  const message = useSelector((state: RootState) => state.goals.message);
  const messageCounter = useSelector(
    (state: RootState) => state.goals.messageCounter,
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
            <h2 className="dashboard__main-title"> Goals:</h2>
            <div className="dashboard__identifiers__goals">
              <div
                className="square center_square"
                style={{
                  borderColor: "var(--white)",
                }}
              ></div>
              <h3>Description:</h3>
              <h3>Achieved:</h3>
              <h3>
                In <br />
                progress:
              </h3>
              <h3>
                Needs <br />
                improvement:
              </h3>
              <img src={menu_vertical} alt="menu_vertical" id="menu_vertical" />
            </div>
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
