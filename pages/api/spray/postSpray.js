import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;

  //Checks if paddock exists
  const sprayExists = !!(await prisma.sprays.findFirst({
    where: { name: name },
  }));

  if (sprayExists) {
    res.status(400).json({ message: "Spray already exists" });
    return;
  }
  if (!sprayExists && req.method === "POST") {
    const result = await prisma.sprays.create({
      data: {
        name: name,
      },
    });

    res.status(201).json(result);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
