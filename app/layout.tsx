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
  title: "Kyte - Secure Your Crypto Wallet | No Account, No Data Stored",
  description:
    "Split your seed phrase into secure fragments with Shamir's Secret Sharing. Kyte stores nothing — no accounts, no seeds, no data. Everything runs locally on your device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${monaSans.className} ${hubotSans.className}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar sections={sections} />
        <SmoothScroll className="flex-1">{children}</SmoothScroll>
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
