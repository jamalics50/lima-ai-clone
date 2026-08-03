import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({ 
  subsets: ["latin"], 
  variable: "--font-newsreader",
  adjustFontFallback: false 
});

export const metadata: Metadata = {
  title: "LIMA AI-CLONE",
  description: "Workspace and application dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
