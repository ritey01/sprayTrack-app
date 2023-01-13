import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  console.log("😈");
  const paddockId = req.query.id;
  console.log(paddockId);
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
