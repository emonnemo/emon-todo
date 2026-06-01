import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emon Todo",
  description: "Simple todo checklist built with @emonnemo/ui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
