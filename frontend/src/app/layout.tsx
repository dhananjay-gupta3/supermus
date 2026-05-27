import type { Metadata } from "next";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ThemeProvider from "@/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import BootstrapClient from "@/components/ui/BootstrapClient";

export const metadata: Metadata = {
  title: "Animated Resume Analytics Builder",
  description:
    "Build animated resumes with real-time preview, charts, and analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <ToastProvider>
            {children}
            <BootstrapClient />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
