import type { Metadata } from "next";
import { Inria_Sans, Inter } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const inriaSans = Inria_Sans({
  weight: ["300", "400", "700"],
  variable: "--font-inria-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RSUD Kraton",
  description: "Web Registrasi RSUD Kraton",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${inriaSans.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
