import "./globals.css";
import Script from "next/script";
import type { Metadata } from "next";
import { Mona_Sans, Hubot_Sans } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";

const sections: string[] = ["Solution", "Plans", "Download", "Support"];

const monaSans = Mona_Sans({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const hubotSans = Hubot_Sans({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

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
        <Navbar sections={sections} />
        <SmoothScroll>{children}</SmoothScroll>
        <Footer />
        <Script
          id="umami-script"
          src="https://umami-production-0ae4.up.railway.app/script.js"
          data-website-id={process.env.UMAMI_WEBSITE_ID}
          async
        />
      </body>
    </html>
  );
}
