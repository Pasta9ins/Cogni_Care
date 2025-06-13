import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
// import AuthStatusChecker from "./components/auth/AuthStatusChecker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cogni Care - Your AI Wellness Companion",
  description: "AI-powered health and wellness application."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased pt-16`}>
        <Navbar />
        {/* <AuthStatusChecker> */}
          {children}
        {/* </AuthStatusChecker> */}
      </body>
    </html>
  );
}
