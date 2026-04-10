import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import DashboardShell from "@/components/DashboardShell";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Polymarket bot dashboard",
    template: "%s · Bot dashboard",
  },
  description:
    "Supabase-backed dashboard for Ven704 polymarket-bot: trades, paper balance, reviews, and strategy metrics.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[var(--background)] font-sans antialiased`}
      >
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
};

export default RootLayout;
