import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { Task } from "../types";

const TasksList = ({
  tasks,
  onUpdatefromTaskListoTasks,
}: {
  tasks: Task[];
  onUpdatefromTaskListoTasks: (updatedNewTaskList: Task[]) => void;
}) => {
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  // console.log("taskList ", taskList);
  const [cumulativeUpdatedTasks, setCumulativeUpdatedTasks] = useState<Task[]>(
    [],
  );

  const [updatedTaskListChild, setUpdatedTaskListChild] = useState<Task[]>([]);

  useEffect(() => {
    setTaskList(tasks);
    setCumulativeUpdatedTasks(tasks);
  }, [tasks]);

  const handleUpdateTaskList = (
    taskId: number,
    updatedTaskData: Partial<Task>,
  ) => {
    // console.log("cumulativeUpdatedTasks ", cumulativeUpdatedTasks);
    const updatedTaskIndex = cumulativeUpdatedTasks.findIndex(
      (task) => task.id === taskId,
    );
    // console.log("updatedTaskIndex ", updatedTaskIndex);
    if (updatedTaskIndex !== -1) {
      const updatedNewTaskList = [...cumulativeUpdatedTasks];
      updatedNewTaskList[updatedTaskIndex] = {
        ...updatedNewTaskList[updatedTaskIndex],
        ...updatedTaskData,
      };
      setCumulativeUpdatedTasks(updatedNewTaskList); //store in cumulativeUpdatedTasks array all changes made until now

      // Call the onUpdateTaskList callback to propagate the update
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
            //Get updated task (individually) from TaskCard and send the updated array of tasks into Task.tsx (parent component).
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
