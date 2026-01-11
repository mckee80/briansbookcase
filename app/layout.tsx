import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer, AuthProvider } from "@/components";
import { DataProvider } from "@/contexts/DataContext";

export const metadata: Metadata = {
  title: "Brian's Bookcase - Supporting Mental Health Through Stories",
  description: "A charity website dedicated to mental health, offering donated fiction stories to support suicide prevention and mental health resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
