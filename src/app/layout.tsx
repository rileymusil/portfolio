import type { Metadata } from "next";
import { Lora, Poppins } from "next/font/google";
import { Analytics } from "@/components/atoms/Analytics";
import { StructuredData } from "@/components/atoms/StructuredData";
import { openGraphImage } from "@/lib/metadata";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/site-url";
import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-poppins",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

const defaultTitle = `${site.name} | Creative Services`;
const defaultDescription =
  "Event video and photography coverage, plus post-production and editing by Riley Musil in Houston, TX.";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: defaultTitle,
    template: `%s | ${site.name}`,
  },
  description: defaultDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: defaultTitle,
    description: defaultDescription,
    url: absoluteUrl("/"),
    images: openGraphImage(),
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: openGraphImage(),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${lora.variable}`}>
      <body className={`${poppins.className} antialiased`}>
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
