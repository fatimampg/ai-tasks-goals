import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe } from "vitest";
import { Task } from "../../types";
import TaskCard from "../../components/Tasks/TaskCard";

describe("TaskCard", () => {
  const mockTask: Task = {
    id: 1,
    description: "test task",
    deadline: new Date("2024-05-30"),
    belongsToId: "123-abc",
    status: "TO_DO",
    percentageCompleted: 0,
    priority: "HIGH",
    relatedGoalId: 1,
    category: "CAREER",
  };

  const mockStore = configureStore([]);
  const store = mockStore({
    tasks: {
      taskList: [mockTask],
    },
  });
  const mockOnUpdatefromTaskCard = vi.fn();

  const renderTaskCard = () => {
    render(
      <Provider store={store}>
        <TaskCard
          task={mockTask}
          onUpdatefromTaskCardToTaskList={mockOnUpdatefromTaskCard}
        />
        ,
      </Provider>,
    );
    return {
      description: screen.getByText(mockTask.description),
      user: userEvent.setup(),
      menuVertical: screen.getByRole("img", { name: /menu_vertical/i }),
    };
  };

  it("should display task info in card", async () => {
    const { description } = renderTaskCard();
    expect(description).toBeInTheDocument();
  });

  it("should open dropdown-menu when clicking on menu-vertical icon", async () => {
    const { menuVertical, user } = renderTaskCard();
    expect(menuVertical).toBeInTheDocument();

    await user.click(menuVertical);

    await waitFor(() => {
      expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
    });
  });

  it("should close dropdown menu when clicking outside that element", async () => {
    const { menuVertical, user } = renderTaskCard();
    expect(menuVertical).toBeInTheDocument();

    await user.click(menuVertical);
    await user.click(document.body);

    await waitFor(() => {
      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
    });
  });
});
