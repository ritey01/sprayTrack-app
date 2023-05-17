import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function sprayEventHandler(req, res) {
  const sprayEvent = req.body;
  console.log("sprayEvent", sprayEvent);

  const session = await getServerSession(req, res, authOptions);
  const companyId = session.user.companyId;

  if (session) {
    if (req.method === "POST") {
      try {
        const result = await prisma.sprayEvent.create({
          data: {
            date: sprayEvent.date,
            comment: sprayEvent.comment,
            createdBy: sprayEvent.createdBy,
            company: {
              connect: { id: companyId },
            },
            paddock: {
              connect: { id: sprayEvent.paddockId },
            },
            crop: {
              connect: { id: sprayEvent.cropId },
            },
            sprayMix: {
              connect: {
                id: sprayEvent.sprayMix.sprayMixId,
              },
            },
          },
        });

        if (result) {
          res.status(201).json(result);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to change save data" });
      }
    } else {
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
    }
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
}
