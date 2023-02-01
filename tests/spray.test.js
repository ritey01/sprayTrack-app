import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// import "@testing-library/jest-dom/extend-expect";
import Spray from "../pages/spray";
import prisma from "../lib/prisma";
import { SprayProvider } from "../context/sprayEvent";
import { getServerSideProps } from "../pages/spray";

describe("'Spray', GIVEN the user is on the spray choice page", () => {
  test("WHEN the page renders THEN the user sees a heading, a list of spray options, a back button and a next button", () => {
    const sprays = [
      {
        id: 1,
        name: "Spray A",
        sprays: [
          { id: 1, name: "Roundup", rate: 30, unit: "mls" },
          { id: 2, name: "Versatil", rate: 10, unit: "litres" },
        ],
      },
    ];
    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={false} />
      </SprayProvider>
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Select a spray");
    expect(screen.getByText("Add Spray")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Spray A")).toBeInTheDocument();
    expect(screen.getByText("Roundup")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(3);
  });

  test("WHEN there are no sprays THEN the spray list is empty and page still renders", () => {
    const sprays = [];

    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={false} />
      </SprayProvider>
    );
    expect(screen.queryAllByRole("listitem")).toStrictEqual([]);
    expect(screen.getByRole("heading")).toHaveTextContent("Select a spray");
    expect(screen.getByText("No sprays created yet")).toBeInTheDocument();
  });

  test("WHEN there are no sprays included in the spray array a message is returned", () => {
    const sprays = [
      {
        id: 1,
        name: "Spray A",
        sprays: [],
      },
    ];

    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={false} />
      </SprayProvider>
    );

    expect(screen.getByText("No sprays found")).toBeInTheDocument();
  });

  test("WHEN the add Spray button is clicked it navigates to MakeSpray", async () => {
    const sprays = [];

    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={false} />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("link", { name: "Add Spray" });

    expect(linkEl).toHaveAttribute("href", "/make-spray");
  });

  test("WHEN a spray is not selected the Link to SprayDetails is not visible", async () => {
    const sprayMixs = [];

    render(
      <SprayProvider>
        <Spray sprayList={sprayMixs} errorCode={false} />
      </SprayProvider>
    );

    const linkEl = screen.queryByRole("link", { name: "Add" });

    expect(linkEl).toBeNull();
  });

  test("WHEN a spray is selected and the add button is clicked it navigates to SprayDetails", async () => {
    const sprays = [
      {
        id: 1,
        name: "Spray A",
        sprays: [
          { id: 1, name: "Roundup", rate: 30, unit: "mls" },
          { id: 2, name: "Versatil", rate: 10, unit: "litres" },
        ],
      },
    ];

    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={false} />
      </SprayProvider>
    );

    const selectSpray = screen.getByText("Spray A");
    fireEvent.click(selectSpray);

    const linkEl = screen.getByRole("link", { name: "Add" });

    expect(linkEl).toHaveAttribute("href", "/spray-details");
    const linkBack = screen.getByRole("link", { name: "Back" });

    expect(linkBack).toHaveAttribute("href", "/date");
  });

  test("WHEN a spray is not selected and the add button is clicked it returns the message 'Please select a spray'", async () => {
    const sprays = [
      {
        id: 1,
        name: "Spray A",
        sprays: [
          { id: 1, name: "Roundup", rate: 30, unit: "mls" },
          { id: 2, name: "Versatil", rate: 10, unit: "litres" },
        ],
      },
    ];

    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={false} />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("button", { name: "Add" });

    fireEvent.click(linkEl);
    expect(screen.getByText("Please select a spray")).toBeInTheDocument();
    const linkBack = screen.getByRole("link", { name: "Back" });
    expect(linkBack).toHaveAttribute("href", "/date");
  });

  test("WHEN there is a 500 status code THEN the user sees an error message", async () => {
    const sprays = [];

    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={500} />
      </SprayProvider>
    );

    expect(screen.getByText("500 - Internal Server Error")).toBeInTheDocument();
  });

  test("WHEN there is a 404 status code THEN the user sees an error message", async () => {
    const sprays = [];

    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={404} />
      </SprayProvider>
    );

    expect(
      screen.getByText("An error 404 occurred on server")
    ).toBeInTheDocument();
  });

  test("WHEN there are no sprays in the sprays array within the sprayMix array then No sprays found rendered", async () => {
    const sprays = [
      {
        id: 1,
        name: "Spray A",
        sprays: [],
      },
    ];

    render(
      <SprayProvider>
        <Spray sprayList={sprays} errorCode={false} />
      </SprayProvider>
    );

    expect(screen.getByText("No sprays found")).toBeInTheDocument();
  });
});

describe("getServerSideProps", () => {
  test("WHEN the page is loaded THEN prisma returns a list of sprays with a 200 status code", async () => {
    prisma.SprayList.findMany = jest.fn().mockResolvedValue([
      {
        id: 1,
        title: "5 in one",
        sprays: [
          {
            sprayListId: 1,
            sprayId: 1,
            rateId: 1,
            sprays: { id: 1, name: "Roundup" },
            rates: { id: 1, rate: 30, metric: "mls" },
          },
          {
            sprayListId: 1,
            sprayId: 2,
            rateId: 2,
            sprays: { id: 2, name: "Versatil" },
            rates: { id: 2, rate: 10, metric: "litres" },
          },
        ],
      },
    ]);

    const req = {};
    const res = {
      statusCode: 200,
    };

    const sprayTest = await getServerSideProps({ req, res });

    expect(sprayTest).toEqual({
      props: {
        sprayList: [
          {
            id: 1,
            name: "5 in one",
            sprays: [
              { id: 1, name: "Roundup", rate: 30, unit: "mls" },
              { id: 2, name: "Versatil", rate: 10, unit: "litres" },
            ],
          },
        ],
        errorCode: false,
      },
    });
    expect(prisma.SprayList.findMany).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
  });

  test("WHEN the page is loaded with a database error THEN prisma returns a 500 status code", async () => {
    prisma.SprayList.findMany = jest.fn().mockRejectedValue({
      code: "P1001",
      clientVersion: "4.8.1",
      meta: { database_host: "127.0.0.1", database_port: 3309 },
      batchRequestIdx: undefined,
    });

    const req = {};
    //this needs to be 200 as this is what Prisma returns even when error
    const res = { statusCode: 200 };

    const sprayTest = await getServerSideProps({ req, res });

    expect(sprayTest).toEqual({
      props: {
        sprayList: [],
        errorCode: 500,
      },
    });
    expect(prisma.SprayList.findMany).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(500);
  });
});
