import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Desa Cilame - Portal Digital Desa Modern',
  description: 'Portal resmi Desa Cilame dengan layanan digital lengkap untuk masyarakat',
  keywords: 'desa cilame, layanan desa, umkm, transparansi keuangan, pasar tenaga kerja',
  openGraph: {
    title: 'Desa Cilame - Portal Digital Desa Modern',
    description: 'Portal resmi Desa Cilame dengan layanan digital lengkap untuk masyarakat',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Ensure proper charset and viewport */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preload critical fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <LanguageProvider>
            <Navbar />
            <main className="min-h-screen bg-white">
              {children}
            </main>
            <ChatBot />
            <Toaster />
          </LanguageProvider>
        </ErrorBoundary>
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentOrganization",
              "name": "Desa Cilame",
              "url": "https://desacilame.id",
              "description": "Portal resmi Desa Cilame",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ID",
                "addressRegion": "Jawa Barat"
              }
            })
          }}
        />
      </body>
    </html>
  );
}