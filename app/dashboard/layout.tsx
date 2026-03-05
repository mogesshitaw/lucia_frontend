'use client';

import { AppShell } from '@mantine/core';
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
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          minHeight: '100vh',
          // Minimal padding - just enough to clear header and navbar
          paddingTop:0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          transition: 'padding-left 0.3s ease',
        },
        navbar: {
          transition: 'width 0.3s ease',
          backgroundColor: 'white',
          borderRight: '1px solid #e9ecef',
        },
      }}
    >
      <AppShell.Header className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpened} />
      </AppShell.Header>

      <AppShell.Navbar className="transition-all duration-300 overflow-hidden border-r dark:border-gray-800">
        <DashboardSidebar opened={sidebarOpened} />
      </AppShell.Navbar>

        <AppShell.Main className="bg-white transition-all duration-300">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
}