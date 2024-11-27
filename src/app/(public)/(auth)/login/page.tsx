import Container from "./Container";
export default function Page() {
  return (
    <>
      {/* {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn("google")}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user?.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )} */}
      Login page
      <Container />
    </>
  );
}
