import type { Metadata } from "next";
import "./globals.css";
import AntiInspect from "@/components/AntiInspect";

export const metadata: Metadata = {
  title: "SHAMBALA — The Last Gate of Kalyug",
  description: "Kurukshetra CTF · AI Security Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&family=Tiro+Devanagari+Sanskrit:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0d0b0a] text-[#e8dcc4] antialiased selection:bg-[#ff7a1a] selection:text-black min-h-screen select-none">
        <AntiInspect />
        {children}
      </body>
    </html>
  );
}
