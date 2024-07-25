import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe, it, expect } from "vitest";
import GoalCard from "../../components/Goals/GoalCard";
import { mockGoals } from "../mocks/db";

describe("GoalCard", () => {
  const mockStore = configureStore([])({
    goals: {
      goalsList: [mockGoals],
    },
  });

  const renderGoalCard = () => {
    render(
      <Provider store={mockStore}>
        <GoalCard goal={mockGoals[0]} />
      </Provider>,
    );
    return {
      description: screen.getByText(mockGoals[0].description),
      user: userEvent.setup(),
      menuVertical: screen.getByRole("img", { name: /menu_vertical/i }),
      checkboxAchieved: screen.getByTestId("checkboxAchieved"),
      checkboxInProgress: screen.getByTestId("checkboxInProgress"),
      checkboxNeedsImprovement: screen.getByTestId("checkboxNeedsImprovement"),
    };
  };

  it("should display goal description", async () => {
    const { description } = renderGoalCard();
    expect(description).toBeInTheDocument();
  });

  it("should open dropdown-menu when clicking on menu-vertical icon", async () => {
    const { menuVertical, user } = renderGoalCard();
    expect(menuVertical).toBeInTheDocument();

    await user.click(menuVertical);

    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
  });

  it("should show Edit and Remove buttons when dropdown-menu is opened", async () => {
    const { menuVertical, user } = renderGoalCard();

    await user.click(menuVertical);

    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("should close dropdown menu when clicking outside that element", async () => {
    const { menuVertical, user } = renderGoalCard();
    expect(menuVertical).toBeInTheDocument();

    await user.click(menuVertical);
    await user.click(document.body);

    expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
  });

  it("should show correct goal month and year, when dorpdown menu is clicked", async () => {
    const { menuVertical, user } = renderGoalCard();
    user.click(menuVertical);

    await waitFor(() => {
      expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
      const month = screen.getByText(`Month: ${mockGoals[0].month}`);
      expect(month).toBeInTheDocument();
      const year = screen.getByText(`Year: ${mockGoals[0].year}`);
      expect(year).toBeInTheDocument();
    });
  });

  it("should show correct state checked and all status checkboxes disabled", async () => {
    const { checkboxAchieved, checkboxInProgress, checkboxNeedsImprovement } =
      renderGoalCard();
    expect(checkboxAchieved).toBeInTheDocument();
    expect(checkboxInProgress).toBeInTheDocument();
    expect(checkboxNeedsImprovement).toBeInTheDocument();

    expect(checkboxAchieved).toBeChecked();
    expect(checkboxInProgress).not.toBeChecked();
    expect(checkboxNeedsImprovement).not.toBeChecked();

    expect(checkboxAchieved).toBeDisabled();
    expect(checkboxInProgress).toBeDisabled();
    expect(checkboxNeedsImprovement).toBeDisabled();
  });
});
