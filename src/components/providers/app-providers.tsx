
"use client";

import type { ReactNode } from 'react';
import React from 'react'; // Explicitly import React
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        {children}
        <Toaster />
      </SidebarProvider>
    </AuthProvider>
  );
}

