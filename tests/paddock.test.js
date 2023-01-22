import Paddock from "../pages/paddock";
import userEvent from "@testing-library/user-event";
import prisma from "../lib/prisma";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SprayProvider } from "../context/sprayEvent";
import { getServerSideProps } from "../pages/paddock";

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
    expect(screen.getAllByRole("listitem").length).toBe(2);
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

    expect(linkEl).toHaveAttribute("href", "/addPaddock");
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

describe("getServerSideProps", () => {
  test("WHEN the page is loaded THEN the paddocks are retrieved from the database with a 200 status code", async () => {
    // console.log(Object.getOwnPropertyNames(prisma.Paddock));

    prisma.paddock.findMany = jest.fn().mockResolvedValue([
      { paddockName: "Paddock A", id: 1 },
      { paddockName: "Paddock B", id: 2 },
    ]);
    const req = {};
    const res = {
      statusCode: 200,
    };

    const paddocksTest = await getServerSideProps({ req, res });

    expect(paddocksTest).toEqual({
      props: {
        paddocks: [
          { paddockName: "Paddock A", id: 1 },
          { paddockName: "Paddock B", id: 2 },
        ],
        errorCode: false,
      },
    });
    expect(prisma.paddock.findMany).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });

  test.todo(
    "WHEN the page is loaded and the database isnt found THEN the status code 500 is returned"
  );
});

describe("Delete function", () => {
  test.todo("WHEN a list item is clicked the delete button is displayed");
});
