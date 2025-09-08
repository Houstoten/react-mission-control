import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React Exposé Playground",
  description: "Interactive demo of React Exposé library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
