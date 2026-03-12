/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { AppShell, useMantineColorScheme } from '@mantine/core';
import { ReactNode, useState, useEffect } from 'react';
import Header from './component/dashbordheader';
import DashboardSidebar from './component/dashboard-sidebar';
import { useDisclosure } from '@mantine/hooks';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure(true);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AppShell
      header={{ height: { base: 60, sm: 68, md: 80 } }}
      navbar={{
        width: sidebarOpened ? 280 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !sidebarOpened },
      }}
      padding={0}
      styles={{
        main: {
          background: isDark 
            ? 'linear-gradient(135deg, #1a1b1e 0%, #141517 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          minHeight: '100vh',
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          transition: 'padding-left 0.3s ease',
        },
        navbar: {
          transition: 'width 0.3s ease',
          backgroundColor: isDark ? '#1e1f22' : 'white',
          borderRight: isDark ? '1px solid #2c2e33' : '1px solid #e9ecef',
        },
      }}
    >
      <AppShell.Header className={`${
        isDark 
          ? 'bg-gray-900/90 border-gray-800' 
          : 'bg-white/90 border-gray-200'
      } backdrop-blur-md border-b shadow-sm`}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpened} />
      </AppShell.Header>

      <AppShell.Navbar className={`transition-all duration-300 overflow-hidden border-r ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}>
        {/* Pass both props here */}
        <DashboardSidebar 
          opened={sidebarOpened} 
          toggleSidebar={toggleSidebar} 
        />
      </AppShell.Navbar>

      <AppShell.Main className={`transition-all duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className={`max-w-[1600px] mx-auto ${
          isDark ? 'text-gray-200' : 'text-gray-900'
        }`}>
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
}