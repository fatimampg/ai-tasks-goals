import GoalCard from "./GoalCard";
import { Goal } from "../../types";

const GoalsList = ({ goals }: { goals: Goal[] }) => {
  return (
    <div className="list-results">
      {!goals.length ? (
        <h4>
          {" "}
          No goals found for this month.{" "}
        </h4>
      ) : (
        goals.map((goal: Goal) => <GoalCard key={goal.id} goal={goal} />)
      )}
    </div>
  );
};

export default GoalsList;
