import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { name } = req.body;
  const session = await getServerSession(req, res, authOptions);
  const companyId = session.user.companyId;
  console.log("name", companyId);
  if (session) {
    //checks if crop exists
    const cropExists = await prisma.crops.findFirst({
      where: { name: name, companyId: companyId },
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
      } else {
        //If exists and has is_displayed set to true, return error
        res
          .status(400)
          .json({ message: "Crop already exists and is displayed" });
        return;
      }
    }
    //If doesn't exist, create new paddock
    if (!cropExists && req.method === "POST") {
      const result = await prisma.crops.create({
        data: {
          name: name,
          is_displayed: true,
          company: {
            connect: { id: companyId },
          },
        },
      });
      console.log("result", result);
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
