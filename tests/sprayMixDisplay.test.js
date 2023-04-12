import prisma from "../lib/prisma";
import sprayListHandler from "../pages/api/spray/postSprayList";
import httpMocks from "node-mocks-http";

describe("sprayListHandler", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update existing sprayMix with is_displayed set to false", async () => {
    const title = "Test SprayMix";
    const spray = { rate: 1, unit: "mls", sprayId: 1 };
    const body = { title, sprays: [spray] };

    // create a test sprayMix with is_displayed set to false
    const existingSprayMix = await prisma.sprayMix.create({
      data: { title, is_displayed: false },
    });

    req.body = body;
    await sprayListHandler(req, res);

    // verify that the sprayMix is updated to is_displayed: true
    const updatedSprayMix = await prisma.sprayMix.findUnique({
      where: { id: existingSprayMix.id },
    });
    expect(updatedSprayMix.is_displayed).toBe(true);

    // verify that the response message is correct
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "SprayMix found and updated to be displayed",
    });
  });

  it("should return an error for existing sprayMix with is_displayed set to true", async () => {
    const title = "Test SprayMix";
    const spray = { rate: 1, unit: "mls", sprayId: 1 };
    const body = { title, sprays: [spray] };

    // create a test sprayMix with is_displayed set to true
    const existingSprayMix = await prisma.sprayMix.create({
      data: { title, is_displayed: true },
    });

    req.body = body;
    await sprayListHandler(req, res);

    // verify that the existing sprayMix is not updated
    const unchangedSprayMix = await prisma.sprayMix.findUnique({
      where: { id: existingSprayMix.id },
    });
    expect(unchangedSprayMix.is_displayed).toBe(true);

    // verify that the response message is correct
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "SprayMix already exists and is displayed",
    });
  });

  it("should create a new sprayMix if it does not exist", async () => {
    const title = "Test SprayMix";
    const spray = { rate: 1, unit: "mls", sprayId: 1 };
    const body = { title, sprays: [spray] };

    req.body = body;
    await sprayListHandler(req, res);

    // verify that the new sprayMix is created
    const findSprayMix = await prisma.sprayMix.findFirst({
      where: { title },
    });
    expect(findSprayMix).toBeFalsy();

    //Create new spray mix
    const newSprayMix = await prisma.sprayMix.create({
      data: {
        title: title,
        sprays: {
          create: sprays.map((spray) => ({
            spray: {
              create: {
                rate: spray.rate,
                unit: spray.unit,
                sprayName: {
                  connect: {
                    id: spray.sprayId,
                  },
                },
              },
            },
          })),
        },
      },
    });

    // verify that the response status code and data are correct
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(newSprayMix);
  });
});
