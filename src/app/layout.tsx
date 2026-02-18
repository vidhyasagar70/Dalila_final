// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import HeaderFooterWrapper from "@/components/HeaderFooterWrapper";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Dalila Diamonds - Premium B2B Diamond Supplier",
  description: "Global supplier of certified premium natural diamonds for B2B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jost.variable} overflow-x-hidden`}
      suppressHydrationWarning
      style={{ colorScheme: "light" }}
    >
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className="antialiased bg-white text-gray-900 font-jost overflow-x-hidden" suppressHydrationWarning style={{ colorScheme: "light" }}>
        <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#FAF6EB",
              color: "#363636",
              fontFamily: "var(--font-jost)",
              border: "1px solid #e5e5e5",
            },
            success: {
              duration: 3000,
              style: {
                background: "#FAF6EB",
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#FAF6EB",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#FAF6EB",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#FAF6EB",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
