import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DashboardHeader from "../../components/DashboardHeader";
import { formattedDate } from "../mocks/utils";

describe("Dashboard header", () => {
  const header = { Authorization: "Bearer mocked-token" };

  const renderHeader = () => {
    render(<DashboardHeader header={header} />);
  };

  it("should display the name of the user", async () => {
    // server.use(
    //   http.get("http://localhost:3001/api/username", () => {
    //     return HttpResponse.json({
    //       userName: "John",
    //     });
    //   }),
    // ); --> added to handlers

    renderHeader();
    const userName = await screen.findByTestId("username");

    expect(userName).toBeInTheDocument();
    await waitFor(() => {
      expect(userName).toHaveTextContent("Hello John");
    });
  });

  it("should display current date in correct format", async () => {
    renderHeader();
    const date = screen.getByText(/Today/i);
    const currentDate = new Date();

    expect(date).toBeInTheDocument();
    expect(date).toHaveTextContent(formattedDate(currentDate));
  });
});
