import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { LayoutProvider } from '@/context/layout-context';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your electric vehicle dashboard.',
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
        <link
          href="https://fonts.googleapis.com/css2?family=Koho:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </LayoutProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
