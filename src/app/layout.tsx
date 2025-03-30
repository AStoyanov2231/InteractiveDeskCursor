import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GradientBackgroundWrapper from "@/components/GradientBackgroundWrapper";
import { AnimationProvider } from "@/components/AnimationContext";
import { GameProvider } from "@/components/GameContext";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interactive Classroom Puzzles",
  description: "Cognitive puzzle games for students in classroom settings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
      >
        <GradientBackgroundWrapper />
        <AnimationProvider>
          <GameProvider>
            <div className="min-h-screen">
              <main className="container mx-auto px-4 py-8">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
            </div>
          </GameProvider>
        </AnimationProvider>
      </body>
    </html>
  );
}
