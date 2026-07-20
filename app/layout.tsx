import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Derrick Odiwuor | Executive Operations Coordinator",
  description:
    "High-impact operations professional and MBA candidate combining project management expertise, CRM optimization, and modern AI automation workflows to drive organizational efficiency.",
  keywords: [
    "Derrick Odiwuor",
    "Executive Operations",
    "Project Management",
    "CRM",
    "Nairobi",
    "Portfolio",
  ],
  openGraph: {
    title: "Derrick Odiwuor | Executive Operations Coordinator",
    description:
      "High-impact operations professional combining project management, CRM optimization, and AI automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-cream dark:bg-deep text-warm-900 dark:text-warm-100 antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Navbar />
          <main className="flex flex-col">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}