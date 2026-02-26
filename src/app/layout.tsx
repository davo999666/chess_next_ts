import type {Metadata, Viewport} from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {HistoryProvider} from "@/context/HistoryContext";




const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,
    themeColor: "#3a3a3a",
};

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Chess Lili",
    description: "An educational chess platform for learning",
    icons: {
        icon: "/king-icon.png",
    },
};

export default function RootLayout(
    {children,}: Readonly<{ children: React.ReactNode; }>
) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <div >
            <HistoryProvider>
                <main>{children}</main>
            </HistoryProvider>
        </div>
        </body>
        </html>
    );
}
