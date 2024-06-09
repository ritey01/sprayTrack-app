import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function sprayListHandler(req, res) {
  const { title, sprays } = req.body;
  const session = await getServerSession(req, res, authOptions);
  const companyId = session.user.companyId;

  if (session) {
    //Checks if sprayMix exists
    // const sprayExists = await prisma.sprayMix.findFirst({
    //   where: { title: title, companyId: companyId },
    // });

    // if (sprayExists) {
    //   //If exists and has is_displayed set to false, update to true
    //   if (!sprayExists.is_displayed) {
    //     await prisma.sprayMix.update({
    //       where: { id: sprayExists.id },
    //       data: { is_displayed: true },
    //     });
    //     res
    //       .status(200)
    //       .json({ message: "SprayMix found and updated to be displayed" });
    //     return;
    //   }
    //   //If exists and has is_displayed set to true, return error
    //   res
    //     .status(400)
    //     .json({ message: "SprayMix already exists and is displayed" });
    //   return;
    //}

    //Create new spray mix NOTE when a user deletes the spray mix it only changes the is_displayed
    //to false so that it doesnt effect sprayEvents that have already been created if the user
    //then creates another sprayMix with same title it will be a new sprayMix and title will be duplicated
    if (req.method === "POST") {
      try {
        const result = await prisma.sprayMix.create({
          data: {
            title: title,
            is_displayed: true,
            company: {
              connect: { id: companyId },
            },
            sprays: {
              create: sprays.map((spray) => ({
                spray: {
                  create: {
                    rate: spray.spray.rate,
                    unit: spray.spray.unit,
                    sprayName: {
                      connect: {
                        id: spray.sprayId,
                      },
                    },
                  },
                },
              })),
            },
          },
        });

        return res.status(201).json(result);
      } catch (err) {
        console.error(err);
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
