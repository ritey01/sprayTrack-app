import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { useState } from "react";
import { rest } from "msw";

import { useSession, SessionProvider } from "next-auth/react";
import { server, mockSession } from "./helpers/mocks";
// import "@testing-library/jest-dom/extend-expect";
import Date from "../pages/date";
import { SprayProvider } from "../context/sprayEvent";

jest.mock("next-auth/react");

//mock the sessionProvider to return a mock session

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("date", () => {
  test.only("Page renders a 'now' date or a form to create a date", async () => {
    const session = {
      data: {
        user: {
          username: "jeffrafter",
        },
      },
      status: "authenticated",
    };
    useSession.mockReturnValue({ data: session });

    await waitFor(() => {
      render(
        <SprayProvider>
          <Date />
        </SprayProvider>
      );
    });

    const sprayDateHeading = screen.getByTestId("spray-date");
    expect(sprayDateHeading).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Spray Date")).toBeInTheDocument();
    });

    expect(screen.getAllByLabelText("Choose date"));
    expect(screen.getByText("Now")).toBeInTheDocument();
  });
  //   test("WHEN the next button is clicked it navigates to spray and the back button navigates to crop", async () => {
  //     render(
  //       <SprayProvider>
  //         <Date />
  //       </SprayProvider>
  //     );

  //     const linkBack = screen.getByRole("link", { name: "Back" });
  //     const linkAdd = screen.getByRole("link", { name: "Add" });

  //     expect(linkBack).toHaveAttribute("href", "/crop");
  //     expect(linkAdd).toHaveAttribute("href", "/spray");
  //   });
});
