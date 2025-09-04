import { UMKMDetailClient } from './UMKMDetailClient';
import { notFound } from 'next/navigation';

// Interface untuk data UMKM dari API
interface UMKM {
  id: number;
  name?: string;
  business_name?: string;
  category: string;
  owner?: string;
  owner_name?: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  social_media?: string | {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  established_year?: number;
  employee_count?: number;
  status: 'active' | 'inactive' | 'pending';
  products?: string;
  annual_revenue?: string | number;
  certification?: string;
  images?: string | string[];
  created_at?: string;
  updated_at?: string;
}

// Fungsi untuk mengambil data UMKM dari API
async function getUMKMData(): Promise<UMKM[]> {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`http://localhost:5001/api/umkm?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch UMKM data');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching UMKM data:', error);
    return [];
  }
}

// Fungsi untuk mengambil detail UMKM berdasarkan ID
async function getUMKMById(id: string): Promise<UMKM | null> {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`http://localhost:5001/api/umkm/${id}?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching UMKM detail:', error);
    return null;
  }
}

export async function generateStaticParams() {
  const umkmData = await getUMKMData();
  return umkmData.map((umkm) => ({
    id: umkm.id.toString(),
  }));
}

export default async function UMKMDetailPage({ params }: { params: { id: string } }) {
  const umkm = await getUMKMById(params.id);
  const allUmkmData = await getUMKMData();

  if (!umkm) {
    notFound();
  }

  return <UMKMDetailClient umkm={umkm} umkmData={allUmkmData} />;
}