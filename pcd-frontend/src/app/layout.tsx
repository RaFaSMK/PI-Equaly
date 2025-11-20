import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { ToasterProvider } from "../components/Toaster";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "EQualy",
 description:
 "Plataforma acessível e inclusiva conectando talentos PCD às melhores oportunidades.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="pt-BR">
 <body
 className={`${geistSans.variable} ${geistMono.variable} antialiased`}
 >
 <ToasterProvider>
 <Navbar />
 <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
 {children}
 </main>
 </ToasterProvider>
 </body>
 </html>
 );
}
