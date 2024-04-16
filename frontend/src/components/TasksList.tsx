import "../styles/dashboard.css";
import TaskCard from "./TaskCard";
import { Task } from "../types";

const TasksList = ({ tasks }: { tasks: Task[] }) => {
  console.log("Task List (Redux)", tasks);
  return (
    <div>
      {!tasks?.length ? (
        <h2> No tasks found for this time period </h2>
      ) : (
        tasks.map((task: Task) => (
          <TaskCard
            id={task.id}
            description={task.description}
            deadline={task.deadline}
            belongsToId={task.belongsToId}
            status={task.status}
            percentageCompleted={task.percentageCompleted ?? 0}
            priority={task.priority}
            relatedGoalId={task.relatedGoalId}
            category={task.category}
          />
        ))
      )}
    </div>
  );
};

export default TasksList;
