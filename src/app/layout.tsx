import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PwaProvider from "@/components/PwaProvider";

export const metadata: Metadata = {
  title: {
    default: "MyDoc247 — Nigeria's 24/7 Doctor in Your Pocket",
    template: "%s · MyDoc247",
  },
  description:
    "Talk to a verified Nigerian doctor in minutes. Video, voice or chat consultations, e-prescriptions, home lab tests, secure health records, USSD fallback and emergency SOS.",
  manifest: "/manifest.webmanifest",
  applicationName: "MyDoc247",
  appleWebApp: {
    capable: true,
    title: "MyDoc247",
    statusBarStyle: "black-translucent",
  },
  keywords: [
    "telemedicine Nigeria", "online doctor Nigeria", "MyDoc247", "health app Nigeria",
    "e-prescription", "lab test at home Lagos",
  ],
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "MyDoc247 — Nigeria's 24/7 Doctor in Your Pocket",
    description:
      "Verified Nigerian doctors, e-prescriptions, home lab tests and emergency SOS — built to work on low data.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#04231d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="bg-[#f5f8f7] text-ink-900 antialiased font-sans">
        <PwaProvider />
        {children}
      </body>
    </html>
  );
}
