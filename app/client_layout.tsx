/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { AppShell } from '@mantine/core';
import { ReactNode, useState, useEffect } from 'react';
import Header from './component/header';

export default function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AppShell
      header={{ height: { base: 60, sm: 68, md: 80 } }}
      padding={0}
      styles={{
        main: {
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          minHeight: 'calc(100vh - var(--app-shell-footer-height))',
          paddingTop: 'calc(var(--app-shell-header-height) + 1rem)',
          paddingBottom: '2rem',
        },
      }}
    >
      <AppShell.Header className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </AppShell.Main>

      <AppShell.Footer className="bg-gray-900 border-t border-gray-800 p-0">
           © {new Date().getFullYear()} Lucia Printing & Advertising
      </AppShell.Footer>
    </AppShell>
  );
}