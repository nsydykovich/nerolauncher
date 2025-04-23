import * as React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/misc/theme-provider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Nero Launcher",
  description: "Unofficial Minecraft Launcher built with NextJS and Tauri",
};

const Lexend = localFont({
  src: "../fonts/lexend/lexend.woff2",
  variable: "--font-lexend",
  preload: true,
  display: "swap",
});

const GeistSans = localFont({
  src: "../fonts/geist/geist-sans.woff2",
  variable: "--font-geist-sans",
  preload: true,
  display: "swap",
});

const GeistMono = localFont({
  src: "../fonts/geist/geist-mono.woff2",
  variable: "--font-geist-mono",
  preload: true,
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${Lexend.variable} ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
