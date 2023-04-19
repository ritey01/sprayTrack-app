import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;
  const session = await getServerSession(req, res, authOptions);
  const companyId = session.user.companyId;

  if (session) {
    //Checks if spray exists
    const sprayExists = await prisma.sprayName.findFirst({
      where: { name: name, companyId: companyId },
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
          company: {
            connect: { id: companyId },
          },
        },
      });

      res.status(201).json(result);
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
}
