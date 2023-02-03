import { sprayListHandler } from "../pages/api/spray/postSprayList";
// describe("postSprayList POST spray/postSprayList", () => {
//   test("WHEN the route api/spray/postSprayList is called THEN the spraylist is added to the database", async () => {
//     prisma.sprayList.findFirst = jest.fn().mockResolvedValue(null);

//     prisma.sprayList.create = jest.fn().mockResolvedValue({
//       id: 1,
//       name: "testPaddock",
//     });

//     const res = {
//       status: jest.fn().mockReturnThis(201),
//       json: jest.fn(),
//     };
//     const req = {
//       body: { name: "testPaddock" },
//       headers: { "Content-Type": "application/json" },
//       method: "POST",
//     };

//     await postPaddock(req, res);

//     expect(prisma.paddock.create).toHaveBeenCalledWith({
//       data: {
//         name: "testPaddock",
//       },
//     });
//     expect(res.status).toBeCalledWith(201);
//   });

//   test("WHEN the route api/paddock/postPaddock is called with a paddock name that already exists THEN an error is returned", async () => {
//     prisma.paddock.findFirst = jest.fn().mockResolvedValue(true);

//     const res = {
//       status: jest.fn().mockReturnThis(400),
//       json: jest.fn(),
//     };

//     const req = {
//       body: { name: "testPaddock" },
//       headers: { "Content-Type": "application/json" },
//       method: "POST",
//     };

//     await postPaddock(req, res);

//     expect(res.status).toBeCalledWith(400);
//     expect(res.json).toBeCalledWith({
//       message: "Paddock already exists",
//     });
//   });
// });

test.only("WHEN the route api/spray/postSprayList is called THEN the spraylist is added to the database", async () => {
  await sprayListHandler();

  expect(prisma.sprayList.create).toHaveBeenCalledWith({
    data: {
      title: "test",
      sprays: {
        create: [{ spray: "testSpray", rate: 1, unit: "testUnit" }],
      },
    },
  });
});
