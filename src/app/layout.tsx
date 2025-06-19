
import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: "HydroTrack Dashboard",
  description: "Track and understand your daily water usage habits with AquaChat AI.",
  openGraph: {
    title: "HydroTrack Dashboard",
    description: "Track and visualise your water usage to become more eco-conscious.",
    images: [
      {
        url: "https://i.imgur.com/NS5ch0A.png",
        width: 1200,
        height: 630,
        alt: "HydroTrack Dashboard Preview"
      }
    ]
  }
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
