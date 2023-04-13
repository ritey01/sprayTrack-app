import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  //accesses the current user session object,allows Next.js to render the user details on the client side of the app
  const { data: session } = useSession();
  console.log(session);
  if (session) {
    return (
      <>
        <p> Signed in as {session.user.email} </p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <p> Not signed in </p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
