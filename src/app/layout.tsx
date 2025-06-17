
import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'WaterWise - Save Water, Save Life',
  description: 'Track, learn, and conserve water with WaterWise.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          {/* AppShell handles its own rendering based on auth state */}
          {/* It will render children (page content) or the auth page */}
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
