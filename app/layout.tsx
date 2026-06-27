import type { Metadata } from "next";
import { Inter, Lora, Oswald } from "next/font/google";
import "@/app/globals.css";
import { buildMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-article-serif",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: `${SITE_NAME} | Editorial-first sports coverage`,
  description: SITE_DESCRIPTION,
  canonicalPath: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
