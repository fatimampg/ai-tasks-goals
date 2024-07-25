import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe, it, expect } from "vitest";
import { mockGoals } from "../mocks/db";
import Goals from "../../pages/Dashboard/Goals";
import { MemoryRouter } from "react-router-dom";
import { RootState } from "../../store";

describe("Goals page", () => {
  const mockStore = configureStore<RootState>([]);

  const baseInitialState: RootState = {
    tasks: {
      taskList: [],
      message: null,
      typeMessage: null,
      messageCounter: 0,
      isLoading: true,
    },
    auth: {
      header: { Authorization: "Bearer mocked-token" },
      message: null,
      typeMessage: null,
      messageCounter: 1,
      isLoading: false,
    },
    searchDates: {
      taskDates: {
        gte: new Date("2024-04-01"),
        lte: new Date("2024-04-30"),
      },
      goalsMonth: {
        month: 4,
        year: 2024,
      },
      error: null,
    },
    goals: {
      goalList: mockGoals,
      message: null,
      typeMessage: null,
      messageCounter: 1,
      isLoading: false,
    },
  };

  const newState = (toBeReplaced: any) => ({
    ...baseInitialState,
    ...toBeReplaced,
  });

  it("should show loading spinner when loading goals (isLoading = true)", async () => {
    const initialState = newState({
      goals: {
        ...baseInitialState.goals,
        isLoading: true,
      },
    });

    const mockedStore = mockStore(initialState);
    render(
      <Provider store={mockedStore}>
        <MemoryRouter initialEntries={["/goals"]}>
          <Goals />
        </MemoryRouter>
      </Provider>,
    );
    const loadingSpinner = screen.getByTestId("loading-spinner");

    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should show goals list", async () => {
    const mockedStore = mockStore(baseInitialState);
    render(
      <Provider store={mockedStore}>
        <MemoryRouter initialEntries={["/goals"]}>
          <Goals />
        </MemoryRouter>
      </Provider>,
    );

    for (let goal of mockGoals) {
      const goalItem = await screen.findByText(goal.description);
      expect(goalItem).toBeInTheDocument();
    }
  });
});
