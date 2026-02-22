import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Otunba Dr. Adetunji Oredipe | Ogun State 2027",
  description:
    "Official campaign website for Otunba - Building a better Ogun State. Join our movement for progress, unity, and prosperity.",
  keywords: ["Ogun State", "2027", "campaign", "governor", "Nigeria"],
  openGraph: {
    title: "Otunba Dr. Adetunji Oredipe | Ogun State 2027",
    description: "Building a better Ogun State. Join our movement.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
