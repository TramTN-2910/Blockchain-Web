import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import AppSidebar from "@/components/layout/AppSidebar";
import Footer from "@/components/layout/Footer";
import BlockchainBackground from "@/components/layout/BlockchainBackground";
import FloatingChatbot from "@/components/chat/FloatingChatbot";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "HubBlock — Công cụ Trực quan hóa SHA-256 & Mô phỏng Blockchain",
  description: "Khám phá cách hàm băm mật mã hoạt động qua các trực quan hóa tương tác. Học tập, làm bài test và tự động ôn tập câu làm sai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-lightBg dark:bg-darkBg text-slate-900 dark:text-slate-100 relative`}>
        <BlockchainBackground />
        <Header />
        <div className="flex-1 flex w-full relative z-0">
          <AppSidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </div>
        <Footer />
        <FloatingChatbot />
      </body>
    </html>
  );
}
