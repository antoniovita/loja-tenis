import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CategoryBar from "../components/categorybar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-row justify-between px-7 py-8 bg-sky-800 text-white">
          <Link href={'/'}> Imagem inicial </Link>
          <div className="flex flex-row gap-6"> 
            <Link href={'login'}> Entrar </Link>
            <Link href={'cart'}> Carrinho </Link>
          </div>
        </div>
        <CategoryBar></CategoryBar>
        {children}
      </body>
    </html>
  );
}
