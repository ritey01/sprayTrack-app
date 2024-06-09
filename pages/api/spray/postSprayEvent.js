import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function sprayEventHandler(req, res) {
  const sprayEvent = req.body;

  // body body body {
  //   paddockId: 3,
  //   paddock: 'Maybe',
  //   cropId: 1,
  //   crop: 'Weeds',
  //   date: '20/06/23',
  //   sprayMix: { sprays: [ [Object] ] },
  //   comment: '',
  //   createdBy: 'Sally Wright'
  // }

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
          },
          select: {
            id: true,
          },
        });
        const sprayEventId = result.id;

        for (const spray of sprayEvent.sprayMix.sprays) {
          await prisma.sprayMixSprayEvent.create({
            data: {
              sprayEvent: {
                connect: { id: sprayEventId },
              },
              sprayMix: {
                connect: { id: spray.id },
              },
            },
            select: {
              id: true,
            },
          });
        }

        if (result) {
          res.status(201).json(result);
        }
      } catch (err) {
        console.error("Error creating SprayMixSprayEvent:", err);
        res.status(500).json({ error: "Failed to save data" });
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
