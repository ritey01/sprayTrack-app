import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function registerHandler(req, res) {
  const company = req.body;

  if (req.method === "POST") {
    try {
      const employeeExists = await prisma.employee.findFirst({
        where: { email: company.adminEmail },
      });

      if (!employeeExists) {
        //Check if company already exists
        const companyExists = await prisma.company.findFirst({
          where: { name: company.companyName },
        });

        if (!companyExists) {
          const createdCompany = await prisma.company.create({
            data: {
              name: company.companyName,
            },
          });

          // Create a new employee associated with the company
          const createdEmployee = await prisma.employee.create({
            data: {
              name: company.adminName,
              email: company.adminEmail,
              company: {
                connect: { id: createdCompany.id },
              },
              is_admin: true,
              is_active: true,
            },
          });

          res.status(201).json({
            company: createdCompany,
            employee: createdEmployee,
          });
          return;
        } else {
          res.status(400).json({ error: "Company already exists" });
          return;
        }
      }

      res.status(400).json({ error: "Employee already exists" });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to create company and employee" });
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
