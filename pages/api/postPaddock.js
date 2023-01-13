// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;
  const result = await prisma.paddock.create({
    data: {
      name: name,
    },
  });
  res.json(result);
}
