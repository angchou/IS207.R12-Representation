import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const sansFont = localFont({
  src: "./fonts/AdwaitaSans-Regular.ttf",
  display: "swap",
  variable: "--font-inter",
});

const monoFont = localFont({
  src: "./fonts/AdwaitaMono-Regular.ttf",
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Tối ưu hiệu năng Frontend: React • Next.js • Tailwind CSS",
    template: "%s | Demo tối ưu Frontend",
  },
  description:
    "Slide thuyết trình kèm demo đo đạc thực tế: rendering trong React, kiến trúc Next.js, Core Web Vitals & SEO, Tailwind CSS.",
  openGraph: {
    title: "Tối ưu hiệu năng Frontend — React • Next.js • Tailwind CSS",
    description: "Slide thuyết trình kèm demo đo đạc thực tế cho 4 thành viên.",
    type: "website",
    locale: "vi_VN",
    images: [{ url: "/lab/hero-1200.jpg", width: 1200, height: 675, alt: "Ảnh xem trước" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${sansFont.variable} ${monoFont.variable} dark`}>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
        <Script id="demo-third-party-analytics" src="/analytics-mock.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
