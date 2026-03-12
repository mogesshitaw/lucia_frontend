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

  // Keyboard shortcut for login (Ctrl+L or Cmd+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'l')) {
        e.preventDefault();
        window.location.href = '/page/login';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <AppShell
      header={{ height: { base: 60, sm: 68, md: 80 } }}
      padding={0}
      styles={{
        main: {
          background: isDark 
            ? 'linear-gradient(135deg, #1a1b1e 0%, #141517 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          minHeight: 'calc(100vh - var(--app-shell-footer-height, 0px))',
          paddingTop: 'calc(var(--app-shell-header-height, 80px) + 1rem)',
          paddingBottom: '2rem',
        },
      }}
    >
      <AppShell.Header 
        className={`fixed w-full z-10 transition-all duration-300 ${
          isDark 
            ? 'bg-gray-900/90 backdrop-blur-md border-gray-800' 
            : 'bg-white/90 backdrop-blur-md border-gray-200'
        } border-b shadow-sm`}
      >
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <div className={`max-w-8xl  px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          isDark ? 'text-gray-200' : 'text-gray-900'
        }`}>
          {children}
        </div>
      </AppShell.Main>

      <AppShell.Footer 
        className={`border-t p-4 text-center transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-900 border-gray-800 text-gray-400' 
            : 'bg-white border-gray-200 text-gray-600'
        }`}
      >
        © {new Date().getFullYear()} Lucia Printing & Advertising. All rights reserved.
      </AppShell.Footer>
    </AppShell>
  );
}