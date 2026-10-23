import { Geist, Geist_Mono, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import SmoothScroll from "@/providers/LenisProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Sayeed Shorif | Notes & Ideas",
    template: "%s | Sayeed Shorif",
  },
  description: "A personal blog with thoughts, observations, and notes on learning and web development.",
  applicationName: "Sayeed Shorif Blog",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sayeed Shorif Blog",
    title: "Sayeed Shorif | Notes & Ideas",
    description: "A personal blog with thoughts, observations, and notes on learning and web development.",
  },
  twitter: {
    card: "summary",
    title: "Sayeed Shorif | Notes & Ideas",
    description: "A personal blog with thoughts, observations, and notes on learning and web development.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-outfit">
        <QueryProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </QueryProvider>
      </body>
    </html>
  );
}
