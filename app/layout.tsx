import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.plavaniepresov.sk"),

  title: {
    default: "Plavecká škola FEDDY | Prešov",
    template: "%s | Plavecká škola FEDDY",
  },

  description:
    "Kurzy plávania pre deti v Prešove. Plavecká škola FEDDY – skupinové a kondičné plávanie v Aquaparku Delňa.",

  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://www.plavaniepresov.sk",
    siteName: "Plavecká škola FEDDY",
    title: "Plavecká škola FEDDY | Prešov",
    description:
      "Kurzy plávania pre deti v Prešove. Skupinové a kondičné plávanie v Aquaparku Delňa.",
    images: [
      {
        url: "/images/og-feddy.jpg",
        width: 1200,
        height: 630,
        alt: "Plavecká škola FEDDY – kurzy plávania v Prešove",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Plavecká škola FEDDY | Prešov",
    description:
      "Kurzy plávania pre deti v Prešove. Skupinové a kondičné plávanie v Aquaparku Delňa.",
    images: ["/images/og-feddy.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-slate-950 antialiased`}
      >
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
