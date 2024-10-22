import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthProvider';
import './globals.css';
// import Navbar from '@/components/common/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Authentication System',
  description: 'Next.js authentication system with Django backend',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* <Navbar /> */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}