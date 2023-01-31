import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { SprayProvider } from "../context/sprayEvent";
import "@testing-library/jest-dom/extend-expect";
import AddCrop from "../pages/addCrop";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

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

  test("WHEN the add button is clicked without field data entered a button and message is displayed", async () => {
    const user = userEvent.setup();
    render(
      <SprayProvider>
        <AddCrop />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("button", { name: "Add" });
    await user.click(linkEl);
    expect(screen.getByText("Please enter a name")).toBeInTheDocument();
  });

  test("WHEN the crop name is entered THEN the crop is added to the database", async () => {
    //mocks the fetch function
    const fetch = jest.fn();
    global.fetch = fetch;
    const result = fetch.mockResolvedValue({
      ok: true,
    });

    //mocks the router.push function
    const push = jest.fn();
    useRouter.mockImplementation(() => ({
      push,
    }));

    const user = userEvent.setup();

    render(
      <SprayProvider>
        <AddCrop />
      </SprayProvider>
    );
    const input = screen.getByLabelText("Crop Name");
    await user.type(input, "testCrop");
    const linkEl = screen.getByRole("button", { name: "Add" });
    await user.click(linkEl);
    expect(fetch).toHaveBeenCalledWith("/api/crop/postCrop", {
      body: JSON.stringify({ name: "testCrop" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    expect(push).toHaveBeenCalledWith("/crop");
  });
});
