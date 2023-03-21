import { authOptions } from "../auth/[...nextauth]";
// import { getServerSession } from "next-auth/next";

import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { name } = req.body;

  // const session = await getServerSession(req, res, authOptions);
  // console.log(session);
  // if (!session) {
  //   res.status(401).json({ message: "You must be logged in." });
  //   return;
  // }

  //Checks if paddock exists
  const paddockExists = await prisma.paddock.findFirst({
    where: { name: name },
  });

  if (paddockExists) {
    //If exsits and has is_displayed set to false, update to true
    if (!paddockExists.is_displayed) {
      await prisma.paddock.update({
        where: { id: paddockExists.id },
        data: { is_displayed: true },
      });
      res
        .status(200)
        .json({ message: "Paddock found and updated to be displayed" });
      return;
    }
    //If exists and has is_displayed set to true, return error
    res
      .status(400)
      .json({ message: "Paddock already exists and is displayed" });
    return;
  }
  //If doesn't exist, create new paddock
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
