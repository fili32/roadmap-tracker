import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "roadmap-tracker",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
