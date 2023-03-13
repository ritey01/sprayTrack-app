import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;
  //checks if crop exists
  const cropExists = await prisma.crops.findFirst({
    where: { name: name },
  });

  if (cropExists) {
    //If exists and has is_displayed set to false, update to true
    if (!cropExists.is_displayed) {
      await prisma.crops.update({
        where: { id: cropExists.id },
        data: { is_displayed: true },
      });
      res
        .status(200)
        .json({ message: "Crop found and updated to be displayed" });
      return;
    }
    //If exists and has is_displayed set to true, return error
    res.status(400).json({ message: "Crop already exists and is displayed" });
    return;
  }
  //If doesn't exist, create new paddock
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
