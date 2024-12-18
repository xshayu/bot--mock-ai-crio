import type { Metadata } from "next";
import { ThemeProvider } from "@/components/themeProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Ubuntu, Open_Sans } from 'next/font/google';
import Image from "next/image";
import "./globals.css";

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--primary-font'
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--secondary-font'
});

export const metadata: Metadata = {
  title: "Bot AI - Crio",
  description: "Assignment done by Ayush Wardhan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.variable} ${openSans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">

              <header className="flex items-center justify-between h-12 px-4 font-[family-name:var(--primary-font)] sticky top-0 bg-primary/5 backdrop-blur-sm border-b">
                <SidebarTrigger />
                <h1 className="font-bold">
                  Bot AI
                </h1>
                <Image
                  className="h-6 w-6 rounded-full cursor-pointer"
                  title="User Avatar"
                  alt="User Avatar"
                  src="https://avatars.githubusercontent.com/u/45749740?s=400&v=4" 
                />
              </header>

              {children}
              
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
