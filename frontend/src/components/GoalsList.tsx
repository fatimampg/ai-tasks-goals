import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import GoalCard from "./GoalCard";

const GoalsList = ({ goals }) => {
  //TO DO
  console.log(goals);
  return (
    <div>
      {!goals.length ? (
        <h2> No goals found for this month </h2>
      ) : (
        goals.map((goal) => (
          <GoalCard
            description={goal.description}
            month={goal.month}
            year={goal.year}
            status={goal.status}
            category={goal.category}
          />
        ))
      )}
    </div>
  );
};

export default GoalsList;
