import React from "react";
import Paddock from "../pages/paddock";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SprayProvider } from "../context/sprayEvent";

describe("paddock", () => {
  test("renders paddock page", () => {
    const paddocks = [
      { paddockName: "Paddock A", id: 1 },
      { paddockName: "Paddock B", id: 2 },
    ];

    render(
      <SprayProvider>
        <Paddock paddocks={paddocks} errorCode={false} />
      </SprayProvider>
    );

    expect(screen.getByRole("heading")).toHaveTextContent("Select a paddock");
    expect(screen.getByText("Add Paddock")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  test("WHEN there are no paddocks THEN the paddock list is empty and page still renders", () => {
    const paddocks = [];
    render(
      <SprayProvider>
        <Paddock paddocks={paddocks} errorCode={false} />
      </SprayProvider>
    );
    expect(screen.queryAllByRole("listitem")).toStrictEqual([]);
    expect(screen.getByRole("heading")).toHaveTextContent("Select a paddock");
  });

  test("WHEN the add paddock button is clicked it navigates to CreatePaddock", async () => {
    const paddocks = [];
    render(
      <SprayProvider>
        <Paddock paddocks={paddocks} errorCode={false} />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("link", { name: "Add Paddock" });

    expect(linkEl).toHaveAttribute("href", "/create-paddock");
  });

  test("WHEN there are no paddocks selected the next button is not active", async () => {
    const paddocks = [];
    render(
      <SprayProvider>
        <Paddock paddocks={paddocks} errorCode={false} />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("button", { name: "Next" });

    expect(linkEl).toHaveAttribute("href", "");
  });

  test.todo("WHEN a paddock is selected THEN the user can navigate to '/crops");

  test("WHEN there is a 500 status returned THEN the page renders an error message", () => {
    const paddocks = [];
    render(
      <SprayProvider>
        <Paddock paddocks={paddocks} errorCode={500} />
      </SprayProvider>
    );
    expect(
      screen.getByText("An error 500 occurred on server")
    ).toBeInTheDocument();
  });

  test.todo(
    "WHEN a paddock is selected THEN the paddock is added to the sprayEvent context and the next button is enabled"
  );
});
