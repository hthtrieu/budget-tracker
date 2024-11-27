"use client";

import { SessionProvider } from "next-auth/react";

//for client using useSession()
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
