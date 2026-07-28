import type { Metadata } from "next";
import { Geist_Mono, Figtree, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hive — Build Your Academy, Grow Your Community",
  description: "A community-driven learning platform where instructors build academies, students master skills, and knowledge creates opportunity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", figtree.variable, dmSerifDisplay.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
