import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;
  //checks if crop exists
  const cropExists = !!(await prisma.crops.findFirst({
    where: { name: name },
  }));

  if (cropExists) {
    res.status(400).json({ message: "Crop already exists" });
    return;
  }
  if (!cropExists && req.method === "POST") {
    const result = await prisma.crops.create({
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
