import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
  const sprayNameId = parseInt(req.query.id);

  const session = await getServerSession(req, res, authOptions);

  if (session) {
    if (req.method === "DELETE") {
      //Checks if sprayName being used in sprayMixSpray
      try {
        const count = await prisma.sprayMixSpray.count({
          where: {
            sprayId: sprayNameId,
          },
        });

        //If sprayName is used in sprayMixSpray (for use in SprayMix), change is_displayed in the sprayName table to false
        if (count > 0) {
          try {
            await prisma.sprayName.updateMany({
              where: {
                id: sprayNameId,
              },
              data: {
                is_displayed: false,
              },
            });
            res.status(200).json({ message: "Spray Name hidden" });
          } catch (error) {
            res
              .status(500)
              .json({ error: "Failed to change displayed field to hidden" });
          }
        } else {
          //If sprayName is not used in sprayMixSpray(for use in sprayMix), delete the sprayName from the Sprayname table
          try {
            await prisma.sprayName.delete({
              where: {
                id: sprayNameId,
              },
            });
            res.status(200).json({ message: "SprayName deleted" });
          } catch {
            res.status(500).json({ error: "Failed to delete spray Name" });
          }
        }
      } catch (e) {
        console.error(e);
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
