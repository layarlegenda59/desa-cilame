import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
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
      <body className={inter.className}>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <ChatBot />
          <Toaster />
        </LanguageProvider>
        
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