/* eslint-disable @next/next/no-page-custom-font */
import '@mantine/core/styles.css';
import './globals.css';

import { MantineProvider, createTheme } from '@mantine/core';
import { ReactNode } from 'react';
import ClientLayout from './client_layout';

export const metadata = {
  title: 'Lucia Printing & Advertising ',
  description: 'Professional Printing and Advertising Services in Ethiopia',
  keywords: 'printing, advertising, DTF, t-shirt printing, banners, Ethiopia',
  authors: [{ name: 'Lucia Printing' }],
  openGraph: {
    title: 'Lucia Printing & Advertising',
    description: 'Professional Printing and Advertising Services in Ethiopia',
    type: 'website',
  },
};

// Optional: Customize your theme
const theme = createTheme({
  primaryColor: 'red',
  colors: {
    // You can customize colors here
  },
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
  }) {
  
  // Add this useEffect in your component

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/images/logo.jpg" type="image/x-icon" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <ClientLayout>
            {children}
          </ClientLayout>
        </MantineProvider>
      </body>
    </html>
  );
}