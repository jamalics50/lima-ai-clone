import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ 
  subsets: ["latin"], 
  weight: ["500"],
  variable: "--font-fraunces",
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
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased bg-[#141210] text-[#F5F1EA]`}>
        {children}
      </body>
    </html>
  );
}
