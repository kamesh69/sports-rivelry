import type { Metadata } from "next";
import "@/app/globals.css";
import { buildMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
