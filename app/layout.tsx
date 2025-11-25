import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../contexts/CartContext";
import { SearchProvider } from "../contexts/SearchContext";
import { AuthProvider } from "../contexts/AuthContextBypass";
import { WishlistProvider } from "../contexts/WishlistContext";
import { UnifiedLanguageProvider } from "../contexts/UnifiedLanguageContext";
import { CurrencyProvider } from "../contexts/CurrencyContext";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { HTMLAttributes } from "../components/layout/HTMLAttributes";
import { Toaster } from "../components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "COSMAT - Premium Beauty & Hair Care Products",
  description: "Discover professional-grade beauty products from top brands like AVEDA and DAVINES. Shop hair care, skincare, makeup, and fragrance with expert advice and free shipping.",
  keywords: "beauty, hair care, skincare, makeup, fragrance, AVEDA, DAVINES, professional beauty products, cosmetics, beauty store, online beauty shopping, premium cosmetics, natural beauty, organic skincare, professional makeup, hair styling, body care, men's grooming, beauty tools, beauty supplements",
  authors: [{ name: "COSMAT Team" }],
  creator: "COSMAT",
  publisher: "COSMAT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cosmt.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/logos/COSMT.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logos/COSMT.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/images/logos/COSMT.png',
  },
  openGraph: {
    title: "COSMAT - Premium Beauty & Hair Care Products",
    description: "Discover professional-grade beauty products from top brands like AVEDA and DAVINES. Shop hair care, skincare, makeup, and fragrance with expert advice and free shipping.",
    url: 'https://cosmt.com',
    siteName: 'COSMAT',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'COSMAT - Premium Beauty Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "COSMAT - Premium Beauty & Hair Care Products",
    description: "Discover professional-grade beauty products from top brands like AVEDA and DAVINES.",
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <UnifiedLanguageProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <SearchProvider>
                  {children}
                </SearchProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </UnifiedLanguageProvider>
      </body>
    </html>
  );
}
