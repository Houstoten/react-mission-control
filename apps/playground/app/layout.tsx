import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "react-mission-control - Mission Control for React",
  description:
    "A React library that provides macOS Mission Control / Exposé-like window management. Press a shortcut to see all components in a grid view, then click to navigate.",
  keywords: [
    "react",
    "mission control",
    "expose",
    "ui",
    "navigation",
    "grid view",
    "window management",
    "macos",
    "component library",
  ],
  authors: [{ name: "Ivan Husarov" }],
  creator: "Ivan Husarov",
  metadataBase: new URL("https://react-mission-control.vercel.app"),
  openGraph: {
    title: "react-mission-control",
    description: "Mission Control for React - macOS-like window management for web apps",
    url: "https://react-mission-control.vercel.app",
    siteName: "react-mission-control",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "react-mission-control",
    description: "Mission Control for React - macOS-like window management for web apps",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
