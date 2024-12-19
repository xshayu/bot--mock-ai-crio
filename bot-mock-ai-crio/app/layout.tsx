import type { Metadata } from "next";
import { ThemeProvider } from "@/components/themeProvider";
import { AppSidebar } from "@/components/appSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Ubuntu, Open_Sans } from 'next/font/google';
import Link from 'next/link';
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
            <div className="w-full">

              <header className="flex items-center justify-between h-[--header-h] px-4 use-primary-font sticky top-0 bg-primary/5 backdrop-blur-sm border-b">
                <SidebarTrigger />
                <Link className="font-bold" href="/">
                  Bot AI
                </Link>
                <img
                  className="h-6 w-6 rounded-full cursor-pointer"
                  title="User Avatar"
                  alt="User Avatar"
                  src="https://avatars.githubusercontent.com/u/45749740?s=400&v=4" 
                />
              </header>

              {children}
              
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
