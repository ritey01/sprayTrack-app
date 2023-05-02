import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    //Checks if user is in the Employee table if not redirects to registerCompany

    async signIn({ user, session }) {
      const employee1 = await prisma.employee.findUnique({
        where: { email: user.email },
      });

      if (employee1) {
        // session.employeeId = employee1.companyId;
        // console.log("🚀 id", employeeId);
        // const updatedUser = await prisma.user.update({
        //   where: { id: user.id },
        //   data: { companyId: employee1.companyId },
        // });
        return true;
      } else {
        const registered = await prisma.authorisedEmail.findUnique({
          where: { email: user.email },
        });
        if (registered) {
          return "/registerCompany";
        } else {
          return "/apply";
        }
      }
    },
    async session({ session, user }) {
      if (session) {
        const companyId = await prisma.employee.findUnique({
          where: { email: user.email },
          select: { companyId: true },
        });
        user.companyId = companyId.companyId;
      }

      return {
        session,
        user,
      };
    },
  },
};

export default NextAuth(authOptions);
