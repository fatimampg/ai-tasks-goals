import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe, it, expect, vi } from "vitest";
import { Task } from "../../types";
import TaskCard from "../../components/Tasks/TaskCard";
import { mockTasks } from "../mocks/db";

describe("TaskCard", () => {
  const mockOnUpdatefromTaskCard = vi.fn();
  const mockStore = configureStore([])({
    tasks: {
      taskList: [mockTasks],
    },
  });

  const renderTaskCard = () => {
    render(
      <Provider store={mockStore}>
        <TaskCard
          task={mockTasks[0]}
          onUpdatefromTaskCardToTaskList={mockOnUpdatefromTaskCard}
        />
      </Provider>,
    );
    return {
      description: screen.getByText(mockTasks[0].description),
      user: userEvent.setup(),
      menuVertical: screen.getByRole("img", { name: /menu_vertical/i }),
    };
  };

  it("should display task description", async () => {
    const { description } = renderTaskCard();
    expect(description).toBeInTheDocument();
  });

  it("should open dropdown-menu when clicking on menu-vertical icon", async () => {
    const { menuVertical, user } = renderTaskCard();
    expect(menuVertical).toBeInTheDocument();

    await user.click(menuVertical);

    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
  });

  it("should close dropdown menu when clicking outside that element", async () => {
    const { menuVertical, user } = renderTaskCard();
    expect(menuVertical).toBeInTheDocument();

    await user.click(menuVertical);
    await user.click(document.body);

    expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
  });
});

describe("TaskCard Status Radio Buttons", () => {
  const mockOnUpdatefromTaskCard = vi.fn();

  const renderTaskCardStatus = (
    status: string,
    percentageCompleted: number,
  ) => {
    const mockTask: Task = {
      id: 1,
      description: "test task",
      deadline: new Date("2024-05-30"),
      belongsToId: "123-abc",
      status: status,
      percentageCompleted: percentageCompleted,
      priority: "HIGH",
      relatedGoalId: 1,
      category: "CAREER",
    };
    const mockStore = configureStore([])({
      tasks: {
        taskList: [mockTask],
      },
    });

    render(
      <Provider store={mockStore}>
        <TaskCard
          task={mockTask}
          onUpdatefromTaskCardToTaskList={mockOnUpdatefromTaskCard}
        />
      </Provider>,
    );
    return {
      toDoRadioButton: screen.getByTestId("radioToDo_1"),
      completedRadioButton: screen.getByTestId("radioCompleted_1"),
      inProgressRadioButton: screen.getByTestId("radioInProgress_1"),
      inProgressInput: screen.getByTestId("percentageCompleted_1"),
      user: userEvent.setup(),
    };
  };

  it("should show TO_DO radio button selected", async () => {
    const { toDoRadioButton } = renderTaskCardStatus("TO_DO", 0);
    expect(toDoRadioButton).toBeChecked();
  });

  it("should show COMPLETED radio button selected", async () => {
    const { completedRadioButton } = renderTaskCardStatus("COMPLETED", 0);

    expect(completedRadioButton).toBeChecked();
  });

  it("should show IN_PROGRESS radio selected and percentage", async () => {
    const { inProgressRadioButton, inProgressInput } = renderTaskCardStatus(
      "IN_PROGRESS",
      50,
    );
    expect(inProgressRadioButton).toBeChecked();
    expect(inProgressInput).toHaveValue("50");
  });

  it("should not accept invalid input in %completed - mobile", async () => {
    const { inProgressRadioButton, inProgressInput } = renderTaskCardStatus(
      "IN_PROGRESS",
      50,
    );
    const alertMock = vi.fn();
    window.alert = alertMock;

    expect(inProgressRadioButton).toBeChecked();
    expect(inProgressInput).toBeInTheDocument();

    fireEvent.change(inProgressInput, { target: { value: "120" } });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
      expect(alertMock).toHaveBeenCalledWith(
        "Percentage completed shouldn't be higher than 100%",
      );
    });
  });

  it("should disable %completed input when IN_PROGRESS radio button is not checked", async () => {
    const { toDoRadioButton, inProgressRadioButton, inProgressInput, user } =
      renderTaskCardStatus("IN_PROGRESS", 50);

    await user.click(toDoRadioButton);

    expect(toDoRadioButton).toBeChecked();
    expect(inProgressRadioButton).not.toBeChecked();
    expect(inProgressInput).toBeDisabled();
  });
});

// to do: test UI interactions involving Redux actions
