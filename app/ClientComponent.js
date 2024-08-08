// app/ClientComponent.js (or ClientComponent.tsx)
"use client"; // Ensure this is a client component

import { SessionProvider } from "next-auth/react";
import Login from "./login";
import Home from "./page";

export default function ClientComponent({ session, children }) {
  return (
    <SessionProvider session={session}>
      {!session ? <Login /> : <Home />}
    </SessionProvider>
  );
}