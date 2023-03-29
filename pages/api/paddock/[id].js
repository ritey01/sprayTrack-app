import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const paddockId = parseInt(req.query.id);

  if (req.method === "DELETE") {
    //Checks if paddock being used in sprayEvent
    try {
      const count = await prisma.sprayEvent.count({
        where: {
          paddockId: paddockId,
        },
      });

      //If paddock is used in sprayEvent, change is_displayed in the paddock table to false
      if (count > 0) {
        try {
          await prisma.paddock.updateMany({
            where: {
              id: paddockId,
            },
            data: {
              is_displayed: false,
            },
          });
          res.status(200).json({ message: "Paddock hidden" });
        } catch (error) {
          res
            .status(500)
            .json({ error: "Failed to change displayed field to hidden" });
        }
      } else {
        //If paddock is not used in sprayEvent, delete the paddock from the paddock table
        try {
          await prisma.paddock.delete({
            where: {
              id: paddockId,
            },
          });
          res.status(200).json({ message: "Paddock deleted" });
        } catch {
          res.status(500).json({ error: "Failed to delete paddock" });
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
}
