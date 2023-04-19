import { signIn } from "next-auth/react";

export default function AccessDenied() {
  return (
    <>
      <h1>Access Denied</h1>
      <div>
        <p>You must be signed in to view this page</p>
        <p>
          If you have signed it you need to register to use sprayTrack or
          contact your company administrator
        </p>
      </div>
    </>
  );
}
