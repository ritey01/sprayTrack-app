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

  test("WHEN the paddock name is entered and the paddock already exists THEN an error message is displayed", async () => {
    const fetch = jest.fn();
    global.fetch = fetch;
    const result = fetch.mockResolvedValue({
      ok: false,
      status: 400,
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
    expect(screen.getByText("testPaddock already exists")).toBeInTheDocument();
  });
});

describe("postPaddock POST paddock/addPaddock", () => {
  test("WHEN the route api/paddock/postPaddock is called THEN the paddock is added to the database", async () => {
    prisma.paddock.findFirst = jest.fn().mockResolvedValue(null);

    prisma.paddock.create = jest.fn().mockResolvedValue({
      id: 1,
      name: "testPaddock",
    });

    const res = {
      status: jest.fn().mockReturnThis(201),
      json: jest.fn(),
    };
    const req = {
      body: { name: "testPaddock" },
      headers: { "Content-Type": "application/json" },
      method: "POST",
    };

    await postPaddock(req, res);

    expect(prisma.paddock.create).toHaveBeenCalledWith({
      data: {
        name: "testPaddock",
      },
    });
    expect(res.status).toBeCalledWith(201);
  });

  test("WHEN the route api/paddock/postPaddock is called with a paddock name that already exists THEN an error is returned", async () => {
    prisma.paddock.findFirst = jest.fn().mockResolvedValue(true);

    const res = {
      status: jest.fn().mockReturnThis(400),
      json: jest.fn(),
    };

    const req = {
      body: { name: "testPaddock" },
      headers: { "Content-Type": "application/json" },
      method: "POST",
    };

    await postPaddock(req, res);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "Paddock already exists",
    });
  });
});
