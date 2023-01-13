import { render, screen } from "@testing-library/react";
import { SprayProvider } from "../context/sprayEvent";
import "@testing-library/jest-dom/extend-expect";
import AddCrop from "../pages/addCrop";

describe("addCrop", () => {
  test("Page renders a form with a crop field", () => {
    render(
      <SprayProvider>
        <AddCrop />
      </SprayProvider>
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Add a Crop"
    );
    expect(screen.getByLabelText("Crop Name"));
  });

  test("WHEN the add button is clicked it navigates to Crop", async () => {
    render(
      <SprayProvider>
        <AddCrop />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("link", { name: "Add" });

    expect(linkEl).toHaveAttribute("href", "/crop");
  });

  test.todo(
    "WHEN the crop name is entered THEN the crop is added to the database"
  );
  test.todo("WHEN no crop name is entered THEN an error message is displayed");
});
