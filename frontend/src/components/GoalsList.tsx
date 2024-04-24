import GoalCard from "./GoalCard";
import { Goal } from "../types";

const GoalsList = ({ goals }: { goals: Goal[] }) => {
  return (
    <div>
      {!goals.length ? (
        <h2> No goals found for this month </h2>
      ) : (
        goals.map((goal: Goal) => <GoalCard key={goal.id} goal={goal} />)
      )}
    </div>
  );
};

export default GoalsList;
