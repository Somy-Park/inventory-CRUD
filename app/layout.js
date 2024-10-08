import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import ClientComponent from "./ClientComponent"; // New client component
//import { SessionProvider } from "next-auth/react";
//import Login from "./login";
//import Home from "./page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
      <ClientComponent session={session}>
          {children}
      </ClientComponent>
      </body>
    </html>
  );
}
