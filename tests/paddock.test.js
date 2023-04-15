// import React from "react";
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import Paddock from "../pages/paddock";
// import { testClient } from "../lib/test-utils";
// import userEvent from "@testing-library/user-event";
// import prisma from "../lib/prisma";
// import { SessionProvider, useSession } from "next-auth/react";
// import { getServerSession } from "next-auth/next";
// import NextAuth from "next-auth";
// import { SprayProvider } from "../context/sprayEvent";
// import { getServerSideProps } from "../pages/paddock";
// import { handle } from "../pages/api/paddock/[id]";

// const authOptions = {
//   providers: [
//     {
//       id: "google",
//       name: "Google",
//       type: "oauth",
//       version: "2.0",
//       scope: "https://www.googleapis.com/auth/userinfo.profile",
//     },
//   ],
// };

// jest.mock("next-auth/react", () => ({
//   ...jest.requireActual("next-auth/react"),
//   useSession: jest.fn(),
// }));

// jest.mock("next-auth/next", () => ({
//   ...jest.requireActual("next-auth/next"),
//   getServerSession: jest.fn(),
// }));

// jest.mock("next-auth", () => ({
//   ...jest.requireActual("next-auth"),
//   NextAuth: jest.fn(),
// }));

// const mockSession = {
//   expires: "1",
//   user: { name: "test", email: "test@gmail.com", image: "test.jpg" },
// };

// describe("paddock", () => {
//   test.only("renders paddock page", () => {
//     const paddocks = [
//       { paddockName: "Paddock A", id: 1, is_displayed: true },
//       { paddockName: "Paddock B", id: 2, is_displayed: true },
//     ];

//     useSession.mockReturnvalueOnce(mockSession);
//     render(
//       <SprayProvider>
//         <Paddock paddocks={paddocks} errorCode={false} />
//       </SprayProvider>
//     );

//     expect(screen.getByRole("heading")).toHaveTextContent("Select a paddock");
//     expect(screen.getByText("Paddock")).toBeInTheDocument();
//     expect(screen.getByText("Next")).toBeInTheDocument();

//     expect(screen.getAllByRole("listitem").length).toBe(2);
//   });

//   test("WHEN there are no paddocks THEN the paddock list is empty and page still renders", () => {
//     const paddocks = [];
//     render(
//       <SprayProvider>
//         <Paddock paddocks={paddocks} errorCode={false} />
//       </SprayProvider>
//     );
//     expect(screen.queryAllByRole("listitem")).toStrictEqual([]);
//     expect(screen.getByRole("heading")).toHaveTextContent("Select a paddock");
//   });

//   test("WHEN the add paddock button is clicked it navigates to CreatePaddock", async () => {
//     const paddocks = [];
//     render(
//       <SprayProvider>
//         <Paddock paddocks={paddocks} errorCode={false} />
//       </SprayProvider>
//     );

//     const linkEl = screen.getByRole("link", { name: "Paddock" });

//     expect(linkEl).toHaveAttribute("href", "/addPaddock");
//   });

//   test("WHEN there are no paddocks selected the next button is not active", async () => {
//     const paddocks = [];
//     render(
//       <SprayProvider>
//         <Paddock paddocks={paddocks} errorCode={false} />
//       </SprayProvider>
//     );

//     const linkEl = screen.getByRole("button", { name: "Next" });

//     expect(linkEl).toHaveAttribute("href", "");
//   });

//   test.todo("WHEN a paddock is selected THEN the user can navigate to '/crops");

//   test("WHEN there is a 500 status returned THEN the page renders an error message", () => {
//     const paddocks = [];
//     render(
//       <SprayProvider>
//         <Paddock paddocks={paddocks} errorCode={500} />
//       </SprayProvider>
//     );
//     expect(screen.getByText("500 - Internal Server Error")).toBeInTheDocument();
//   });

//   test.todo(
//     "WHEN a paddock is selected THEN the paddock is added to the sprayEvent context and the next button is enabled"
//   );
// });

// describe("getServerSideProps", () => {
//   test("WHEN the page is loaded THEN the paddocks are retrieved from the database with a 200 status code", async () => {
//     // console.log(Object.getOwnPropertyNames(prisma.Paddock));

//     prisma.paddock.findMany = jest.fn().mockResolvedValue([
//       { paddockName: "Paddock A", id: 1 },
//       { paddockName: "Paddock B", id: 2 },
//     ]);
//     const req = {};
//     const res = {
//       statusCode: 200,
//     };

//     const paddocksTest = await getServerSideProps({ req, res });

//     expect(paddocksTest).toEqual({
//       props: {
//         paddocks: [
//           { paddockName: "Paddock A", id: 1 },
//           { paddockName: "Paddock B", id: 2 },
//         ],
//         errorCode: false,
//       },
//     });
//     expect(prisma.paddock.findMany).toHaveBeenCalledTimes(1);
//     expect(res.statusCode).toBe(200);
//   });

//   test("WHEN the page is loaded and the database isnt found THEN the status code 500 is returned", async () => {
//     prisma.paddock.findMany = jest.fn().mockRejectedValue({
//       code: "P1001",
//       clientVersion: "4.8.1",
//       meta: { database_host: "127.0.0.1", database_port: 3309 },
//       batchRequestIdx: undefined,
//     });

//     const req = {};
//     //this needs to be 200 as this is what Prisma returns even when error
//     const res = { statusCode: 200 };

//     const paddocksTest = await getServerSideProps({ req, res });

//     expect(paddocksTest).toEqual({
//       props: {
//         paddocks: [],
//         errorCode: 500,
//       },
//     });
//     expect(prisma.paddock.findMany).toHaveBeenCalledTimes(1);
//     expect(res.statusCode).toBe(500);
//   });
// });

// describe("api/paddock/[id], Delete function", () => {
//   test("WHEN a paddock is deleted THEN the paddock is removed from the database", async () => {
//     // .query({id: 1})
//     // .expect(200)
//     // .expect((res) => {
//     //   expect(res.body).toEqual({ message:  // const request = testClient(handle);
//     // const res = await request.delete("/api/paddock/1");"Paddock deleted" });
//     // });
//   });
// });

// // prisma.paddock.delete = jest.fn().mockResolvedValue({
// //   id: 1,
// //   paddockName: "Paddock A",
// // });

// // const req = {
// //   method: "DELETE",
// //   query: { id: 1 },
// // };
// // const res = {
// //   statusCode: 200,
// // };
// // console.log("😇", await handle(req, res));
// // const paddocksTest = await handle({ req, res });

// // expect(paddocksTest).toEqual({
// //   props: {
// //     paddocks: [{ paddockName: "Paddock A", id: 1 }],
// //     errorCode: false,
// //   },
// // });
// // expect(prisma.paddock.findMany).toHaveBeenCalledTimes(1);
// // expect(res.statusCode).toBe(200);
