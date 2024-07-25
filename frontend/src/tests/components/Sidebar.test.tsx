import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore, { MockStoreEnhanced } from "redux-mock-store";
import { describe, it, expect } from "vitest";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { RootState } from "../../store";

const mockStore = configureStore<RootState>([]);
// to do: test UI interactions involving Redux actions (include thunk from 'redux-thunk')
const initialState: RootState = {
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
    goalList: [],
    message: null,
    typeMessage: null,
    messageCounter: 1,
    isLoading: false,
  },
};

describe("Sidebar", () => {
  let mockedStore: MockStoreEnhanced<RootState>;
  beforeEach(() => {
    mockedStore = mockStore(initialState);
  });

  describe("Sidebar - show categories", () => {
    it("should show list of all categories", async () => {
      render(
        <Provider store={mockedStore}>
          <BrowserRouter>
            <Sidebar />
          </BrowserRouter>
        </Provider>,
      );
      const categories = [
        "Career",
        "Personal development",
        "Health and wellness",
        "Financial",
        "Family and friends",
        "Leisure",
      ];

      categories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });
  });

  describe("Sidebar items shown in /tasks", () => {
    const renderSidebarTasks = (store: MockStoreEnhanced<RootState>) => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/tasks"]}>
            <Sidebar />
          </MemoryRouter>
        </Provider>,
      );
    };

    it("should show Task main items", async () => {
      renderSidebarTasks(mockedStore);
      expect(screen.getByText("Tasks")).toBeInTheDocument();

      const startDate = screen.getByLabelText(/from:/i);
      expect(startDate).toBeInTheDocument();
      expect(startDate).toHaveValue("2024-04-01");

      const endDate = screen.getByLabelText(/to:/i);
      expect(endDate).toBeInTheDocument();
      expect(endDate).toHaveValue("2024-04-30");

      const searchButton = screen.getByRole("button", { name: /earch tasks/i });
      expect(searchButton).toBeInTheDocument();

      const addButton = screen.getByRole("button", {
        name: /add new task/i,
      });
      expect(addButton).toBeInTheDocument();
    });

    it("should show number of tasks with different statuses", async () => {
      renderSidebarTasks(mockedStore);

      const countCompleted = screen.getByTestId("count-taskCompleted");
      expect(countCompleted).toBeInTheDocument();
      expect(countCompleted.textContent).toContain("0");
      expect(screen.getByText("Completed")).toBeInTheDocument();

      const countInProgress = screen.getByTestId("count-taskInProgress");
      expect(countInProgress).toBeInTheDocument();
      expect(countInProgress.textContent).toContain("0");
      expect(screen.getByText(/in progress/i)).toBeInTheDocument();

      const countPending = screen.getByTestId("count-taskToDo");
      expect(countPending).toBeInTheDocument();
      expect(countPending.textContent).toContain("0");
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("should show allow change dates", async () => {
      renderSidebarTasks(mockedStore);

      const startDate = screen.getByLabelText(/from:/i);
      const endDate = screen.getByLabelText(/to:/i);

      fireEvent.change(startDate, { target: { value: "2024-05-01" } });
      fireEvent.change(endDate, { target: { value: "2024-05-30" } });

      expect(startDate).toHaveValue("2024-05-01");
      expect(endDate).toHaveValue("2024-05-30");
    });
  });

  describe("Sidebar items shown in /goals", () => {
    const renderSidebarGoals = (store: MockStoreEnhanced<RootState>) => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/goals"]}>
            <Sidebar />
          </MemoryRouter>
        </Provider>,
      );
    };

    it("should show Goal search options when in /goals", async () => {
      renderSidebarGoals(mockedStore);

      expect(screen.getByText("Goals")).toBeInTheDocument();

      const monthSearch = screen.getByLabelText(/month:/i);
      expect(monthSearch).toBeInTheDocument();

      const searchButton = screen.getByRole("button", { name: /earch goals/i });
      expect(searchButton).toBeInTheDocument();

      const addButton = screen.getByRole("button", {
        name: /add new goal/i,
      });
      expect(addButton).toBeInTheDocument();
    });
  });
});
