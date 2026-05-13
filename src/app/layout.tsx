import { Navbar } from "@/components/shared/Navbar";
import "./globals.css";
import MainProvider from "@/providers/MainProvider";
import { Inter } from "next/font/google"; // ফন্ট ইমপোর্ট করা ভালো

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning থাকা জরুরি যেন next-themes এর জন্য কনসোলে এরর না আসে
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <MainProvider>
          {/* Navbar এবং কনটেন্ট ডার্ক থিম ভ্যারিয়েবল অনুযায়ী রেন্ডার হবে */}
          <div className="relative flex flex-col min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </MainProvider>
      </body>
    </html>
  );
}