import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe, it, expect } from "vitest";
import { mockTasks } from "../mocks/db";
import Tasks from "../../pages/Dashboard/Tasks";
import { MemoryRouter } from "react-router-dom";
import { Task } from "../../types";

describe("Tasks page", () => {
  const mockStore = configureStore([]);

  const countMockedTasksStatuses = (tasks: Task[]) => {
    let countToDo = 0;
    let countCompleted = 0;
    let countInProgress = 0;

    for (let task of tasks) {
      if (task.status === "TO_DO") {
        countToDo++;
      } else if (task.status === "COMPLETED") {
        countCompleted++;
      } else {
        countInProgress++;
      }
    }
    return { countToDo, countCompleted, countInProgress };
  };

  const baseInitialState = {
    tasks: {
      taskList: mockTasks,
      message: null,
      typeMessage: null,
      messageCounter: 0,
      isLoading: false,
    },
    auth: {
      header: { Authorization: "Bearer mocked-token" },
    },
    searchDates: {
      taskDates: {
        gte: new Date("2024-04-01"),
        lte: new Date("2024-04-30"),
      },
    },
  };

  const newState = (toBeReplaced: any) => ({
    ...baseInitialState,
    ...toBeReplaced,
  });

  it("should show loading spinner when loading tasks (isLoading = true)", async () => {
    const initialState = newState({
      tasks: {
        ...baseInitialState.tasks,
        isLoading: true,
      },
    });

    const mockedStore = mockStore(initialState);
    render(
      <Provider store={mockedStore}>
        <MemoryRouter initialEntries={["/tasks"]}>
          <Tasks />
        </MemoryRouter>
      </Provider>,
    );
    const loadingSpinner = screen.getByTestId("loading-spinner");

    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should show tasks list", async () => {
    const mockedStore = mockStore(baseInitialState);
    render(
      <Provider store={mockedStore}>
        <MemoryRouter initialEntries={["/tasks"]}>
          <Tasks />
        </MemoryRouter>
      </Provider>,
    );

    for (let task of mockTasks) {
      const taskItem = await screen.findByText(task.description);
      expect(taskItem).toBeInTheDocument();
    }
  });

  it("should show toast message (from redux) when changes on task progress are made", async () => {
    const initialState = newState({
      tasks: {
        ...baseInitialState.tasks,
        message: "mocked successful message",
        typeMessage: "success",
        messageCounter: 1,
      },
    });
    const mockedStore = mockStore(initialState);

    render(
      <Provider store={mockedStore}>
        <MemoryRouter initialEntries={["/tasks"]}>
          <Tasks />
        </MemoryRouter>
      </Provider>,
    );

    const toastMessage = await screen.findByText(/mocked successful message/i);
    expect(toastMessage).toBeInTheDocument();
  });

  it("should show number of tasks completed, to do and in progress in the sidebar", async () => {
    const mockedStore = mockStore(baseInitialState);

    render(
      <Provider store={mockedStore}>
        <MemoryRouter initialEntries={["/tasks"]}>
          <Tasks />
        </MemoryRouter>
      </Provider>,
    );
    const { countCompleted, countInProgress, countToDo } =
      countMockedTasksStatuses(mockTasks);

    const numberTasksCompleted = screen.getByTestId("count-taskCompleted");
    expect(numberTasksCompleted).toBeInTheDocument();
    expect(numberTasksCompleted.textContent).toEqual(countCompleted.toString());

    const numberTasksToDo = screen.getByTestId("count-taskToDo");
    expect(numberTasksToDo).toBeInTheDocument();
    expect(numberTasksToDo.textContent).toEqual(countToDo.toString());

    const numberTasksInProgress = screen.getByTestId("count-taskCompleted");
    expect(numberTasksInProgress).toBeInTheDocument();
    expect(numberTasksInProgress.textContent).toEqual(
      countInProgress.toString(),
    );
  });
});
