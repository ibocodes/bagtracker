import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BagPilot - Track Your Luggage in Real-Time",
  description: "Track your checked baggage from check-in to baggage claim. Get real-time updates on your luggage location and status throughout your journey.",
  keywords: "baggage tracking, luggage tracker, airport bag tracking, flight baggage, luggage status",
  authors: [{ name: "BagPilot Team" }],
  robots: "index, follow",
  openGraph: {
    title: "BagPilot - Track Your Luggage in Real-Time",
    description: "Track your checked baggage from check-in to baggage claim. Get real-time updates on your luggage location and status.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BagPilot - Track Your Luggage in Real-Time",
    description: "Track your checked baggage from check-in to baggage claim. Get real-time updates on your luggage location and status.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
