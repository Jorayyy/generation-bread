import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { getBusiness, getFaqs } from "@/lib/store";
import { SITE_URL } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Generation Bread | Fresh Bakery Café in Tacloban City",
    template: "%s | Generation Bread",
  },
  description:
    "Generation Bread is a bakery café on P. Gomez Street in Tacloban City, Philippines. Fresh breads, pastries, and cakes daily — home of the Ube Cheese Pandesal.",
  keywords: [
    "Generation Bread",
    "bakery",
    "bakery café",
    "Tacloban City",
    "Philippines",
    "breads",
    "pastries",
    "cakes",
    "ube pandesal",
    "croissants",
    "freshly baked",
  ],
  authors: [{ name: "Generation Bread" }],
  creator: "Generation Bread",
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: SITE_URL,
    siteName: "Generation Bread",
    title: "Generation Bread | Fresh Bakery Café in Tacloban City",
    description:
      "Bakery café in Tacloban City serving fresh breads, pastries, and cakes daily. Home of the Ube Cheese Pandesal.",
    images: [
      {
        url: `${SITE_URL}/images/logo.jpg`,
        width: 1200,
        height: 630,
        alt: "Generation Bread - Fresh Bakery Café",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generation Bread | Fresh Bakery Café in Tacloban City",
    description:
      "Bakery café in Tacloban City serving fresh breads, pastries, and cakes daily.",
    images: [`${SITE_URL}/images/logo.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [business, faqs] = await Promise.all([getBusiness(), getFaqs()]);

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(business)),
          }}
        />
      </head>
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased`}>
        <ClientLayout business={business} faqs={faqs}>{children}</ClientLayout>
      </body>
    </html>
  );
}
