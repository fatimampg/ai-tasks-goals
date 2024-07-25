import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe, it, expect, vi } from "vitest";
import Navbar from "../../components/Navbar/Navbar";
import { BrowserRouter } from "react-router-dom";

describe("Navbar", () => {
  const mockStore = configureStore([]);

  const baseInitialState = {
    auth: {
      header: { Authorization: "Bearer mocked-token" },
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

  const renderNavbar = (store) => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>,
    );
    return {
      logo: screen.getByRole("img", { name: /logo/i }),
      features: screen.getByText(/features/i),
      tasks: screen.queryByText(/tasks/i),
      goals: screen.queryByText(/goals/i),
      progress: screen.queryByText(/progress/i),
      button: screen.queryByRole("button", { name: /try/i }),
      profile: screen.getByTestId("profile"),
      user: userEvent.setup(),
    };
  };

  it("should display correct items and buttons whe user is logged out", async () => {
    const initialState = newState({
      auth: {
        ...baseInitialState.auth,
        header: { Authorization: "" },
      },
    });

    const mockedStore = mockStore(initialState);
    const { logo, features, tasks, goals, progress, button, profile } =
      renderNavbar(mockedStore);

    expect(logo).toBeInTheDocument();
    expect(features).toBeInTheDocument();
    expect(tasks).not.toBeInTheDocument();
    expect(goals).not.toBeInTheDocument();
    expect(progress).not.toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(profile).toBeInTheDocument();
  });

  it("should display correct items and buttons whe user is logged in", async () => {
    const mockedStore = mockStore(baseInitialState);
    const { logo, features, tasks, goals, progress, button, profile } =
      renderNavbar(mockedStore);

    expect(logo).toBeInTheDocument();
    expect(features).toBeInTheDocument();
    expect(tasks).toBeInTheDocument();
    expect(goals).toBeInTheDocument();
    expect(progress).toBeInTheDocument();
    expect(button).not.toBeInTheDocument();
    expect(profile).toBeInTheDocument();
  });
});
