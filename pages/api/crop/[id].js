import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const cropId = parseInt(req.query.id);

  if (req.method === "DELETE") {
    const result = await prisma.crops.delete({
      where: { id: cropId },
    });
    res.status(200).json(result);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
