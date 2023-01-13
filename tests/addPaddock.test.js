import { render, screen } from "@testing-library/react";
import { SprayProvider } from "../context/sprayEvent";
import "@testing-library/jest-dom/extend-expect";
import AddPaddock from "../pages/AddPaddock";

describe("addPaddock", () => {
  test("Page renders a form with paddock fields", () => {
    screen.debug();
    render(
      <SprayProvider>
        <AddPaddock />
      </SprayProvider>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Add a Paddock"
    );
    expect(screen.getByLabelText("Paddock Name"));
  });

  test("WHEN the add button is clicked it navigates to Paddock", async () => {
    render(
      <SprayProvider>
        <AddPaddock />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("link", { name: "Add" });

    expect(linkEl).toHaveAttribute("href", "/paddock");
  });

  test.todo(
    "WHEN the paddock name is entered THEN the paddock is added to the database"
  );
  test.todo(
    "WHEN no paddock name is entered THEN an error message is displayed"
  );
});
