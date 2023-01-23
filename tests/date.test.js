import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Date from "../pages/date";
import { SprayProvider } from "../context/sprayEvent";

describe("date", () => {
  test("Page renders a 'now' date or a form to create a date", () => {
    render(
      <SprayProvider>
        <Date />
      </SprayProvider>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Spray Date"
    );
    expect(screen.getAllByLabelText("Choose date"));
    expect(screen.getByText("Now")).toBeInTheDocument();
  });
  test("WHEN the next button is clicked it navigates to spray and the back button navigates to crop", async () => {
    render(
      <SprayProvider>
        <Date />
      </SprayProvider>
    );

    const linkBack = screen.getByRole("link", { name: "Back" });
    const linkAdd = screen.getByRole("link", { name: "Add" });

    expect(linkBack).toHaveAttribute("href", "/crop");
    expect(linkAdd).toHaveAttribute("href", "/spray");
  });
});
