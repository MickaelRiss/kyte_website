import "./globals.css";
import type { Metadata } from "next";
import { Mona_Sans, Hubot_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import SmoothScroll from "./components/SmoothScroll";

const sections: string[] = [
    "Features",
    "Download",
    "FAQ"
  ]

const monaSans = Mona_Sans({
  weight: ['200','300','400','500','600','700'],
  subsets: ['latin'],
})

const hubotSans = Hubot_Sans({
  weight: ['200','300','400','500','600','700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Kyte",
  description: "Never Lose Access Again.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${monaSans.className} ${hubotSans.className}`}>
      <body className="antialiased">
        <Navbar sections = {sections} />  
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
