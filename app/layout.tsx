import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
