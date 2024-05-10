import GoalCard from "./GoalCard";
import { Goal } from "../../types";

const GoalsList = ({ goals }: { goals: Goal[] }) => {
  return (
    <div>
      {!goals.length ? (
        <h3 style={{ fontStyle: "italic", color: "var(--dark-grey)" }}>
          {" "}
          No goals found for this month...{" "}
        </h3>
      ) : (
        goals.map((goal: Goal) => <GoalCard key={goal.id} goal={goal} />)
      )}
    </div>
  );
};

export default GoalsList;
