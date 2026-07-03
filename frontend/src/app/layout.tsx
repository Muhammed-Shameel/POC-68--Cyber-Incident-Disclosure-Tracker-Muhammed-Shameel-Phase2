import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberTracker - Incident Disclosure Dashboard",
  description: "Executive dashboard for tracking cyber incident disclosures",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full bg-background text-text-primary">
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
