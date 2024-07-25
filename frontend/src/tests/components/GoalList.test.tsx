import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe, it, expect } from "vitest";
import GoalList from "../../components/Goals/GoalsList";
import { mockGoals } from "../mocks/db";

describe("GoalList", () => {
  const mockStore = configureStore([])({
    goals: {
      goalList: [mockGoals],
    },
  });

  const renderGoalList = () => {
    render(
      <Provider store={mockStore}>
        <GoalList goals={mockGoals} />
      </Provider>,
    );
  };

  it("should not display tasks when those are not found", async () => {
    render(
      <Provider store={mockStore}>
        <GoalList goals={[]} />
      </Provider>,
    );

    expect(screen.getByText(/no goals found/i)).toBeInTheDocument();
  });

  it("should display all goals when those exist", async () => {
    renderGoalList();

    mockGoals.forEach((goal) => {
      expect(screen.getByText(goal.description)).toBeInTheDocument();
    });
  });
});
