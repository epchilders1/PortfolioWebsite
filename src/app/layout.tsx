import "~/styles/globals.css";
import './index.css';

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./_components/Navbar/Navbar";
import { auth } from "~/server/auth";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Evan's Portfolio",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});



export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
    let isAdmin = false;
    if (session?.user?.email === "echilders2004@gmail.com") {
      isAdmin = true;
    }
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body>
        <Navbar isAdmin={isAdmin}/>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
