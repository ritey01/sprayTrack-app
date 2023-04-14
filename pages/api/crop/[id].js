import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
  const cropId = parseInt(req.query.id);
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    if (req.method === "DELETE") {
      //Checks if crop being used in sprayEvent
      try {
        const count = await prisma.sprayEvent.count({
          where: {
            cropId: cropId,
          },
        });

        //If crop is used in sprayEvent, change is_displayed in the crop table to false
        if (count > 0) {
          try {
            await prisma.crops.updateMany({
              where: {
                id: cropId,
              },
              data: {
                is_displayed: false,
              },
            });
            res.status(200).json({ message: "Crop hidden" });
          } catch (error) {
            res
              .status(500)
              .json({ error: "Failed to change displayed field to hidden" });
          }
        } else {
          //If crop is not used in sprayEvent, delete the crop from the crop table
          try {
            await prisma.crops.delete({
              where: {
                id: cropId,
              },
            });
            res.status(200).json({ message: "Crop deleted" });
          } catch {
            res.status(500).json({ error: "Failed to delete crop" });
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
