import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/layout/providers";

export const metadata: Metadata = {
  title: {
    default: "Goethe Exam Platform | German Language Learning",
    template: "%s | Goethe Exam Platform",
  },
  description:
    "Master German with AI-powered practice. Prepare for Goethe A1, A2, B1 examinations with personalized tutoring, mock exams, and real-time speaking feedback.",
  keywords: [
    "German language",
    "Goethe exam",
    "A1 German",
    "A2 German",
    "B1 German",
    "German learning",
    "language exam preparation",
    "AI German tutor",
  ],
  authors: [{ name: "Goethe Exam Platform" }],
  creator: "Goethe Exam Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://goetheplatform.com",
    title: "Goethe Exam Platform",
    description: "AI-powered German exam preparation for Goethe Institute certifications",
    siteName: "Goethe Exam Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goethe Exam Platform",
    description: "AI-powered German exam preparation",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
