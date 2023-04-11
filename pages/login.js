import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  //accesses the current user session object,allows Next.js to render the user details on the client side of the app
  const { data: session } = useSession();

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
