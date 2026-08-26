import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plavecká škola Prešov",
  description:
    "Kurzy plávania pre deti a dospelých v Prešove. Vyberte si vhodný plavecký kurz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body className="min-h-screen bg-white text-slate-950 antialiased">
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  );
}
