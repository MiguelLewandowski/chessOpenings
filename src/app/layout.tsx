import type { Metadata } from "next";
import { Montserrat, Nunito, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "ChessOpenings - Aprenda Aberturas de Xadrez",
  description: "Plataforma interativa para aprender aberturas de xadrez de forma divertida e personalizada, inspirada no Duolingo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${montserrat.variable} ${nunito.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
