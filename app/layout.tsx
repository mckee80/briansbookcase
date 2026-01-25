import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar, Footer, AuthProvider } from "@/components";
import { DataProvider } from "@/contexts/DataContext";

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
            <Navbar />
            {children}
            <Footer />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
