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
    async signIn({ user }) {
      const employee1 = await prisma.employee.findUnique({
        where: { email: user.email },
      });

      if (employee1) {
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
  },
};

export default NextAuth(authOptions);
