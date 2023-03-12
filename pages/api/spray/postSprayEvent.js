import prisma from "../../../lib/prisma";

export default async function sprayEventHandler(req, res) {
  const { sprayEvent } = req.body;
  console.log("✅", req.body);
  //Not sure if this is needed
  //Checks if sprayMix exists
  //   const sprayEventExists = !!(await prisma.sprayEvent.findFirst({
  //     where: { title: name },
  //   }));

  //   if (sprayExists) {
  //     res
  //       .status(400)
  //       .json({ message: "Spray mix with that name already exists" });
  //     return;
  //   }
  //   if (!sprayExists && req.method === "POST") {
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
      console.log("🥵", result);
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
