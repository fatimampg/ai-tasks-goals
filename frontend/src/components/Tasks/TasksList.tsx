import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { Task } from "../../types";

const TasksList = ({
  tasks,
  onUpdatefromTaskListoTasks,
}: {
  tasks: Task[];
  onUpdatefromTaskListoTasks: (updatedNewTaskList: Task[]) => void;
}) => {
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const [cumulativeUpdatedTasks, setCumulativeUpdatedTasks] = useState<Task[]>(
    [],
  );

  useEffect(() => {
    setTaskList(tasks);
    setCumulativeUpdatedTasks(tasks);
  }, [tasks]);

  const handleUpdateTaskList = (
    taskId: number,
    updatedTaskData: Partial<Task>,
  ) => {
    // Changes in tasks status are sent to the DB at once in Tasks.tsx:
    const updatedTaskIndex = cumulativeUpdatedTasks.findIndex(
      (task) => task.id === taskId,
    );
    if (updatedTaskIndex !== -1) {
      const updatedNewTaskList = [...cumulativeUpdatedTasks];
      updatedNewTaskList[updatedTaskIndex] = {
        ...updatedNewTaskList[updatedTaskIndex],
        ...updatedTaskData,
      };
      //store in cumulativeUpdatedTasks array all changes made in each task status:
      setCumulativeUpdatedTasks(updatedNewTaskList);

      // Propagate the status updates into Tasks.tsx:
      onUpdatefromTaskListoTasks(updatedNewTaskList);
    }
  };

  return (
    <div>
      {!tasks?.length ? (
        <h2> No tasks found for this time period </h2>
      ) : (
        tasks.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            //Get updated task status (individually) from TaskCard:
            onUpdatefromTaskCardToTaskList={(taskId, updatedTaskData) => {
              handleUpdateTaskList(taskId, updatedTaskData);
            }}
          />
        ))
      )}
    </div>
  );
};

export default TasksList;