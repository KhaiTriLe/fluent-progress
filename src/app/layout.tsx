import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/components/app-provider';
import { Toaster } from '@/components/ui/toaster';
import BottomNav from '@/components/bottom-nav';
import { cn } from '@/lib/utils';
import DesktopNav from '@/components/desktop-nav';

const APP_NAME = "Fluent Progress";
const APP_DESCRIPTION = "Track your English speaking practice progress.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#F0F8FF",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background font-sans")}>
        <AppProvider>
          <div className="relative flex min-h-screen w-full flex-col">
            <DesktopNav />
            <main className="flex-1 pb-24 pt-16 md:pb-8 md:pt-20">{children}</main>
            <BottomNav />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
