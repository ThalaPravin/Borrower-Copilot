import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DisclaimerBanner } from "@/components/app-shell/disclaimer-banner";
import { Footer } from "@/components/app-shell/footer";
import { WaterRippleBackground } from "@/components/ui/water-ripple-background";

export const metadata: Metadata = {
  title: "BORROWER COPILOT — Transparent Loan Self-Assessment",
  description: "Independent financial self-assessment tool helping Indian borrowers answer key questions before approaching lenders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <WaterRippleBackground />
          <DisclaimerBanner />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
