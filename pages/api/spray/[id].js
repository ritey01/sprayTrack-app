import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const sprayId = parseInt(req.query.id);
  if (req.method === "DELETE") {
    //Checks if sprayMix being used in sprayEvent
    try {
      const count = await prisma.sprayEvent.count({
        where: {
          sprayMixId: sprayId,
        },
      });

      //If sprayMix is used in sprayEvent, change is_displayed in the sprayMix table to false
      if (count > 0) {
        try {
          await prisma.sprayMix.updateMany({
            where: {
              id: sprayId,
            },
            data: {
              is_displayed: false,
            },
          });
          res.status(200).json({ message: "SprayMix hidden" });
        } catch (error) {
          res
            .status(500)
            .json({ error: "Failed to change displayed field to hidden" });
        }
      } else {
        //If sprayMix is not used in sprayEvent, delete the sprayMix from the sprayMix table
        try {
          await prisma.sprayMix.delete({
            where: {
              id: sprayId,
            },
          });
          res.status(200).json({ message: "sprayMix deleted" });
        } catch {
          res.status(500).json({ error: "Failed to delete sprayMix" });
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
  // if (req.method === "DELETE") {
  //   const result = await prisma.sprayList.delete({
  //     where: { id: sprayId },
  //   });

  //   res.status(200).json(result);
  // } else {
  //   throw new Error(
  //     `The HTTP ${req.method} method is not supported at this route.`
  //   );
  // }
}
