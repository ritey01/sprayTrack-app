import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import googleButton from "../assets/smallGoogle.png";
import styles from "../styles/Index.module.css";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  //accesses the current user session object,allows Next.js to render the user details on the client side of the app
  const { data: session, status } = useSession();

  const callbackUrl =
    process.env.NODE_ENV === "production"
      ? "https://spray-track-app.vercel.app/paddock"
      : "http://localhost:3000/paddock";

  if (status === "loading") {
    return <p> Loading... </p>;
  }

  if (session) {
    return (
      <>
        {/* <p> Signed in as {session.user.email} </p> */}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  } else {
    return (
      <div className={styles.googleCon}>
        <p> Not signed in </p>

        <button
          className={styles.googleSignIn}
          onClick={() => signIn("google", { callbackUrl: callbackUrl })}
        >
          <Image alt="Google sign in" src={googleButton} width={125} />
        </button>
      </div>
    );
  }
}
