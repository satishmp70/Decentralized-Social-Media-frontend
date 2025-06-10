import "../styles/globals.css";
import { ReactNode } from "react";
import { Navbar } from "../components/Navbar";
import { Providers } from "../components/Providers"; 

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
        <Providers> 
          <Navbar />
          <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}