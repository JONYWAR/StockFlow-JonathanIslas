import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { DashboardLayout } from "@/src/components/DashboardLayout";

export const metadata: Metadata = {
  title: "StockFlow - Inventory Management",
  description: "Multi-branch inventory management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%", margin: 0, padding: 0 }}>
      <body style={{ height: "100%", margin: 0, padding: 0 }}>
        <ThemeProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
