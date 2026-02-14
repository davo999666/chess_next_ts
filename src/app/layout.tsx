import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {HistoryProvider} from "@/context/HistoryContext";
import Error from "next/error";
import GlobalError from "@/app/error";



const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Chess Lili",
    description: "An educational chess platform for learning",
    icons: {},
};

export default function RootLayout(
    {children,}: Readonly<{ children: React.ReactNode; }>
) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <div className="flex min-h-screen">
            <HistoryProvider>
            <main className="flex-1">{children}</main>
                </HistoryProvider>
        </div>
        </body>
        </html>
    );
}
