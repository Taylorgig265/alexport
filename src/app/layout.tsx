import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Alexander Daudi — Marketing, Sales & Web Development",
    template: "%s | Alexander Daudi",
  },
  description:
    "Portfolio of Alexander Daudi — marketing graduate specialising in sales, digital marketing, web development and creative production.",
  keywords: [
    "Alexander Daudi",
    "marketing graduate",
    "digital marketing",
    "sales",
    "web development",
    "Blantyre",
    "Malawi",
  ],
  openGraph: {
    title: "Alexander Daudi — Marketing, Sales & Web Development",
    description:
      "Results-driven marketing graduate with expertise in sales, digital marketing and web development.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
