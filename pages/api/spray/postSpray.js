import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;

  //Checks if spray exists
  const sprayExists = await prisma.sprayName.findFirst({
    where: { name: name },
  });

  if (sprayExists) {
    if (!sprayExists.is_displayed) {
      await prisma.sprayName.update({
        where: { id: sprayExists.id },
        data: { is_displayed: true },
      });
      res
        .status(200)
        .json({ message: "Spray found and updated to be displayed" });
      return;
    } else {
      //If exists and has is_displayed set to true, return error
      res
        .status(400)
        .json({ message: "Spray already exists and is displayed" });
      return;
    }
  }
  if (!sprayExists && req.method === "POST") {
    const result = await prisma.sprayName.create({
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
