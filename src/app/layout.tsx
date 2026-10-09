import type { Metadata } from "next";
import { Inter, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Namma Brew | ನಮ್ಮ ಕಾಫಿ. ನಮ್ಮ ವೈಬ್.",
  description:
    "Bengaluru's favourite coffee shop in Koramangala. Fresh filter coffee, South Indian breakfast, free Wi-Fi — ಆರಾಮದ ವಾತಾವರಣದಲ್ಲಿ ಕಾಫಿ ಸವಿಯಿರಿ.",
  keywords: [
    "coffee shop Bengaluru",
    "filter coffee Koramangala",
    "cafe Bengaluru",
    "ಕಾಫಿ ಬೆಂಗಳೂರು",
    "namma brew",
    "South Indian cafe",
  ],
  openGraph: {
    title: "Namma Brew — ನಮ್ಮ ಕಾಫಿ",
    description: "Great coffee, tasty bites and good vibes — made for Bengaluru.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${caveat.variable} font-sans min-h-screen bg-[#FDFBF7] text-[#3E2723] antialiased overflow-x-hidden`}
      >
        <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
