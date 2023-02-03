import prisma from "../../../lib/prisma";

export default async function sprayListHandler(req, res) {
  //const { name, spray,rate,unit } = req.body;
  const name = "test";
  const spray = "testSpray";
  const rate = 1;
  const unit = "testUnit";
  //Checks if paddock exists
  const sprayExists = !!(await prisma.sprayList.findFirst({
    where: { title: name },
  }));

  if (sprayExists) {
    res.status(400).json({ message: "Spray mix already exists" });
    return;
  }
  if (!sprayExists && req.method === "POST") {
    try {
      const result = await prisma.sprayList.create({
        data: {
          title: name,
          sprays: {
            create: [
              {
                name: spray,
                rates: {
                  create: [{ rate: rate, metric: unit }],
                },
              },
            ],
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
