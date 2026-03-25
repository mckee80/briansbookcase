import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { DataProvider } from "@/contexts/DataContext";
import LaunchBanner from "@/components/LaunchBanner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Brian's Bookcase - Supporting Mental Health Through Stories",
  description: "A charity website dedicated to mental health, offering donated fiction stories to support crisis intervention and mental wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WKGK1366YQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WKGK1366YQ');
          `}
        </Script>
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <LaunchBanner />
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
