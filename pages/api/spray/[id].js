import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const sprayId = parseInt(req.query.id);

  if (req.method === "DELETE") {
    const result = await prisma.sprayList.delete({
      where: { id: sprayId },
    });

    res.status(200).json(result);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
