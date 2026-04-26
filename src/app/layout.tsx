import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/components/CartProvider';
import { CameraProvider } from '@/components/CameraProvider';
import Navbar from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: '3D Car Modification Platform',
  description: 'Visualize and manage car modifications digitally using 3D technology and AI assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <CartProvider>
            <CameraProvider>
              <Navbar />
              <main>{children}</main>
            </CameraProvider>
          </CartProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
