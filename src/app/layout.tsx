import type { Metadata } from "next";
import { Lora, Poppins } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Riley Musil | Creative Services",
    template: "%s | Riley Musil",
  },
  description:
    "Event video and photography coverage, plus post-production and editing by Riley Musil in Houston, TX.",
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
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
