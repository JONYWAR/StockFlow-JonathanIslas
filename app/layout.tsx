import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import { Sidebar, DRAWER_WIDTH } from "@/src/components/Sidebar";
import { Box } from "@mui/material";

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
          <Box sx={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <Box
              component="main"
              sx={{
                flex: 1,
                p: 3,
                ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
                minHeight: "100vh",
                backgroundColor: "#F9FAFB",
                overflowY: "auto",
              }}
            >
              {children}
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}
