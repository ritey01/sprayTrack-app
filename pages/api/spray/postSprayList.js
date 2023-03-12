import prisma from "../../../lib/prisma";

export default async function sprayListHandler(req, res) {
  const { name, sprays } = req.body;
  console.log("✅", req.body);
  //Checks if sprayMix exists
  const sprayExists = !!(await prisma.sprayMix.findFirst({
    where: { title: name },
  }));

  if (sprayExists) {
    res
      .status(400)
      .json({ message: "Spray mix with that name already exists" });
    return;
  }
  if (!sprayExists && req.method === "POST") {
    try {
      const result = await prisma.sprayMix.create({
        data: {
          title: name,
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
