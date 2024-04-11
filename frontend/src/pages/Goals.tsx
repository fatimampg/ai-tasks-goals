import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar_string";
import "../styles/sidebar.css";
import "../styles/dashboard.css";
import waving_hand from "../assets/icons/waving-hand.svg";
import menu_vertical from "../assets/icons/menu-vertical.svg";
import goalArray from "../data/goalARRAY";
import GoalsList from "../components/GoalsList";

const Goals = () => {
  const [goalsList, setGoalsList] = useState(goalArray);

  return (
    <div>
      <aside className="dashboard__sidebar">
        <Sidebar />
      </aside>
      <div className="tasks-page">
        <div className="dashboard__main-container">
          <div className="dashboard__title-welcome">
            <h2> Hello USER! (replace)</h2>
            <img
              src={waving_hand}
              alt="waving-hand"
              className="icon__waving-hand"
            />
          </div>

          <h3 className="dashboard__sub-title">
            Today, Mon 25 March 2024 (replace data)
          </h3>
          <h2 className="dashboard__main-title"> Goals:</h2>
          <div className="dashboard__identifiers">
            <div
              className="square center_square"
              style={{
                borderColor: "transparent",
              }}
            ></div>
            <h4> Description:</h4>
            <h4> Achieved:</h4>
            <h4> In progress</h4>
            <h4>
              {" "}
              Needs <br />
              improvement:
            </h4>
            <img src={menu_vertical} alt="menu_vertical" id="menu_vertical" />
          </div>
          <GoalsList goals={goalsList} />
        </div>
      </div>
    </div>
  );
};

export default Goals;
