'use client';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.username} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <h1>Not Login In  </h1>
      <button className="bg-orange-500 px-3 py-2 rounded mt-4" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
