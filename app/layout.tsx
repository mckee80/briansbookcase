import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer, AuthProvider } from "@/components";

export const metadata: Metadata = {
  title: "Brian's Bookcase - Supporting Suicide Prevention Through Fiction",
  description: "A charity website dedicated to suicide prevention, offering donated fiction ebooks to support mental health awareness and resources.",
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
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
