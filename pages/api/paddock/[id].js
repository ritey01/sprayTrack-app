import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const paddockId = parseInt(req.query.id);

  if (req.method === "DELETE") {
    const result = await prisma.paddock.delete({
      where: { id: paddockId },
    });

    res.status(200).json(result);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
