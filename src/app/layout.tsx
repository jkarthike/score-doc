
import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import AppLogo from '@/components/layout/app-logo';
import NavigationLinks from '@/components/layout/navigation-links';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/language-context';
import MobileNavHeader from '@/components/layout/mobile-nav-header';

export const metadata: Metadata = {
  title: 'ScoreDoc',
  description: 'AI-powered clinical scoring assistant for doctors.',
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
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarHeader>
                <AppLogo />
                {/* This trigger is for desktop (e.g., to collapse/expand non-offcanvas sidebars) */}
                {/* It's hidden on mobile because MobileNavHeader provides the trigger */}
                <SidebarTrigger className="hidden md:flex" />
              </SidebarHeader>
              <SidebarContent>
                <NavigationLinks />
              </SidebarContent>
              <SidebarFooter>
                {/* Can add user profile or settings here later */}
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <MobileNavHeader /> {/* This will render the trigger button on mobile */}
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
