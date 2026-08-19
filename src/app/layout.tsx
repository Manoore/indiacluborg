import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/store";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Team India Heart Wall — Heart Walk 2026",
  description: "One Team. One Heart. Join Team India for the Heart Walk, September 26, 2026.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-foreground">
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
