import prisma from "../../../lib/prisma";

export default async function sprayEventHandler(req, res) {
  const { sprayEvent } = req.body;

  if (req.method === "POST") {
    try {
      const result = await prisma.sprayEvent.create({
        data: {
          date: sprayEvent.date,
          paddock: {
            connect: { id: sprayEvent.paddockId },
          },
          crop: {
            connect: { id: sprayEvent.cropId },
          },
          sprayMix: {
            connect: {
              id: sprayEvent.sprayMix.sprayMixId,
            },
          },
        },
      });

      res.status(201).json(result);
    } catch (err) {
      console.log(err);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
