import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteNest — Upload. Deploy. Go Live.",
  description: "A platform to upload, manage, and host static websites through automatically generated subdomains.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
