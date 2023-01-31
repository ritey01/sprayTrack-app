import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { SprayProvider } from "../context/sprayEvent";
import "@testing-library/jest-dom/extend-expect";
import AddPaddock from "../pages/AddPaddock";
import postPaddock from "../pages/api/paddock/postPaddock";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("addPaddock", () => {
  test("Page renders a form with a paddock field", () => {
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

  test("WHEN the add button is clicked without field data entered a button is displayed", async () => {
    const user = userEvent.setup();
    render(
      <SprayProvider>
        <AddPaddock />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("button", { name: "Add" });
    await user.click(linkEl);
    expect(screen.getByText("Please enter a name")).toBeInTheDocument();
  });

  test("WHEN the paddock name is entered THEN the paddock is added to the database", async () => {
    const fetch = jest.fn();
    global.fetch = fetch;
    const result = fetch.mockResolvedValue({
      ok: true,
    });

    const push = jest.fn();
    useRouter.mockImplementation(() => ({
      push,
    }));

    const user = userEvent.setup();

    render(
      <SprayProvider>
        <AddPaddock />
      </SprayProvider>
    );
    const input = screen.getByLabelText("Paddock Name");
    await user.type(input, "testPaddock");
    const linkEl = screen.getByRole("button", { name: "Add" });
    await user.click(linkEl);
    expect(fetch).toHaveBeenCalledWith("/api/paddock/postPaddock", {
      body: JSON.stringify({ name: "testPaddock" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    expect(push).toHaveBeenCalledWith("/paddock");
  });
});

describe("postPaddock POST paddock/addPaddock", () => {
  test.todo(
    "WHEN the route api/paddock/postPaddock is called THEN the paddock is added to the database"
  );

  test.todo(
    "WHEN the route api/paddock/postPaddock is called without a paddock name THEN an error is returned"
  );

  test.todo(
    "WHEN the route api/paddock/postPaddock is called with a paddock name that already exists THEN an error is returned"
  );
});
