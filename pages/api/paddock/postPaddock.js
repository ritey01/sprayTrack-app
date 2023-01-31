// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;

  //Checks if paddock exists
  const paddockExists = !!(await prisma.paddock.findFirst({
    where: { name: name },
  }));

  if (paddockExists) {
    res.status(400).json({ message: "Paddock already exists" });
    return;
  }
  if (!paddockExists && req.method === "POST") {
    const result = await prisma.paddock.create({
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
