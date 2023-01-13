import Crop from "../pages/crop";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SprayProvider } from "../context/sprayEvent";
import { getServerSideProps } from "../pages/crop";

describe("crop", () => {
  test("renders crop page", () => {
    const crops = [
      { cropName: "Wheat", id: 1 },
      { cropName: "Barley", id: 2 },
    ];

    render(
      <SprayProvider>
        <Crop crops={crops} errorCode={false} />
      </SprayProvider>
    );

    expect(screen.getByRole("heading")).toHaveTextContent("Select a crop");
    expect(screen.getByText("Add Crop")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(2);
  });

  test("WHEN there are no crops THEN the crop list is empty and page still renders", () => {
    const crops = [];
    render(
      <SprayProvider>
        <Crop crops={crops} errorCode={false} />
      </SprayProvider>
    );
    expect(screen.queryAllByRole("listitem")).toStrictEqual([]);
    expect(screen.getByRole("heading")).toHaveTextContent("Select a crop");
  });

  test("WHEN the add crop button is clicked it navigates to addCrop", async () => {
    const crops = [];
    render(
      <SprayProvider>
        <Crop crops={crops} errorCode={false} />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("link", { name: "Add Crop" });

    expect(linkEl).toHaveAttribute("href", "/addCrop");
  });

  test("WHEN there are no crops selected the next button is not active", async () => {
    const crops = [];
    render(
      <SprayProvider>
        <Crop crops={crops} errorCode={false} />
      </SprayProvider>
    );

    const linkEl = screen.getByRole("button", { name: "Next" });

    expect(linkEl).toHaveAttribute("href", "");
  });

  test.todo("WHEN a crop is selected THEN the user can navigate to '/date");

  test("WHEN there is a 500 status returned THEN the page renders an error message", () => {
    const crops = [];
    render(
      <SprayProvider>
        <Crop crops={crops} errorCode={500} />
      </SprayProvider>
    );
    expect(
      screen.getByText("An error 500 occurred on server")
    ).toBeInTheDocument();
  });

  test.todo(
    "WHEN a crop is selected THEN the crop is added to the sprayEvent context and the next button is enabled"
  );
});

describe("getServerSideProps", () => {
  test.todo(
    "WHEN the page is loaded THEN the crops are retrieved from the database with a 200 status code"
  );

  test.todo(
    "WHEN the page is loaded and there is an error THEN the database returns an error and a 500 status code"
  );
});
