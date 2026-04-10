import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-pixel-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameTrack",
  description: "A personal game tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${pressStart2P.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#2d1b4e] text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
