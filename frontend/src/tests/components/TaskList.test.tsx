import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe, it, expect, vi } from "vitest";
import TaskList from "../../components/Tasks/TasksList";
import { mockTasks } from "../mocks/db";

describe("TaskList", () => {
  const mockonUpdatefromTaskListoTasks = vi.fn();
  const mockStore = configureStore([])({
    tasks: {
      taskList: [mockTasks],
    },
  });

  const renderTaskList = () => {
    render(
      <Provider store={mockStore}>
        <TaskList
          tasks={mockTasks}
          onUpdatefromTaskListoTasks={mockonUpdatefromTaskListoTasks}
        />
      </Provider>,
    );
  };

  it("should not display tasks when those are not found", async () => {
    render(
      <Provider store={mockStore}>
        <TaskList
          tasks={[]}
          onUpdatefromTaskListoTasks={mockonUpdatefromTaskListoTasks}
        />
      </Provider>,
    );

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it("should display all tasks when those exist", async () => {
    renderTaskList();

    mockTasks.forEach((task) => {
      expect(screen.getByText(task.description)).toBeInTheDocument();
    });
  });

  it("should call onUpdate when changes on tasks status are made", async () => {
    renderTaskList();

    mockTasks.forEach((task) => {
      const toDoButton = screen.getByTestId(`radioToDo_${task.id}`);
      const user = userEvent.setup();
      user.click(toDoButton);
    });

    await waitFor(() =>
      expect(mockonUpdatefromTaskListoTasks).toHaveBeenCalled(),
    );
  });
});

// to do: test UI interactions involving Redux actions
