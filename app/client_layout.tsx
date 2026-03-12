/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { AppShell, useMantineColorScheme } from '@mantine/core';
import { ReactNode, useState, useEffect } from 'react';
import Header from './component/header';

export default function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Check for Ctrl+L (or Cmd+L on Mac)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'l')) {
      e.preventDefault(); // Prevent browser's default behavior
      window.location.href = '/page/login';
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
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
          background: isDark 
            ? 'linear-gradient(135deg, #1a1b1e 0%, #141517 100%)' // Dark mode gradient
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', // Light mode gradient
          minHeight: 'calc(100vh - var(--app-shell-footer-height))',
          paddingTop: 'calc(var(--app-shell-header-height) + 1rem)',
          paddingBottom: '2rem',
        },
      }}
    >
      <AppShell.Header className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      } shadow-sm`}>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <div className={`max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 ${
          isDark ? 'text-gray-200' : 'text-gray-900'
        }`}>
          {children}
        </div>
      </AppShell.Main>

      <AppShell.Footer className={`${
        isDark ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-gray-900 border-gray-800 text-gray-400'
      } border-t p-4 text-center`}>
        © {new Date().getFullYear()} Lucia Printing & Advertising
      </AppShell.Footer>
    </AppShell>
  );
}