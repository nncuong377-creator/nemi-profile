import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEMI — Digital Profile",
  description: "Trang hồ sơ cá nhân cao cấp của thành viên NEMI. Kết nối và để lại lời nhắn.",
  keywords: ["NEMI", "digital profile", "hồ sơ cá nhân"],
  openGraph: {
    title: "NEMI — Digital Profile",
    description: "Trang hồ sơ cá nhân cao cấp",
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEMI — Digital Profile",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
