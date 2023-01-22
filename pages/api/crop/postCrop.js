import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;
  const result = await prisma.crops.create({
    data: {
      name: name,
    },
  });
  res.status(201).json(result);
}
