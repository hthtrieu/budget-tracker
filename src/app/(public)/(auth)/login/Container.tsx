"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
const Container = () => {
  const { data: session } = useSession();

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <Button onClick={() => signIn("google")}>Sign in</Button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user?.name} - {session.user?.email}
          <br />
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      )}
    </>
  );
};

export default Container;
