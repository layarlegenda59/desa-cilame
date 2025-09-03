import { UMKMDetailClient } from './UMKMDetailClient';

// Data UMKM yang sama dengan halaman utama
const umkmData = [
  {
    id: 1,
    name: 'Warung Mak Ijah',
    category: 'kuliner',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    description: 'Gudeg dan masakan Jawa tradisional dengan cita rasa autentik dan bumbu rahasia turun temurun.',
    location: 'Jl. Raya Cilame No. 45',
    rating: 4.8,
    reviewCount: 124,
    phone: '081234567890',
    products: [
      { name: 'Gudeg Komplit', price: 15000, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
      { name: 'Ayam Goreng', price: 12000, image: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
      { name: 'Sate Ayam', price: 20000, image: 'https://images.pexels.com/photos/8879227/pexels-photo-8879227.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
    ],
    featured: true,
    openTime: '06:00 - 22:00',
    owner: 'Ibu Ijah Suhartini',
    established: '2015',
    specialties: ['Gudeg Jogja', 'Ayam Goreng Kremes', 'Sate Ayam Madura'],
    gallery: [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/8879227/pexels-photo-8879227.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    ]
  },
  {
    id: 2,
    name: 'Kerajinan Bambu Hani',
    category: 'kerajinan',
    image: '/Kerajinan Bambu.jpg',
    description: 'Kerajinan bambu berkualitas tinggi untuk dekorasi rumah dan keperluan sehari-hari.',
    location: 'Kampung Bambu, Cilame Utara',
    rating: 4.9,
    reviewCount: 87,
    phone: '081234567891',
    products: [
      { name: 'Keranjang Bambu', price: 45000, image: '/Kerajinan Bambu.jpg' },
      { name: 'Vas Bunga Bambu', price: 35000, image: 'https://images.pexels.com/photos/1029620/pexels-photo-1029620.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
      { name: 'Anyaman Dinding', price: 75000, image: 'https://images.pexels.com/photos/6207387/pexels-photo-6207387.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
    ],
    featured: true,
    openTime: '08:00 - 17:00',
    owner: 'Hani Suryani',
    established: '2018',
    specialties: ['Anyaman Tradisional', 'Furniture Bambu', 'Dekorasi Rumah'],
    gallery: [
      '/Kerajinan Bambu.jpg',
      'https://images.pexels.com/photos/1029620/pexels-photo-1029620.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/6207387/pexels-photo-6207387.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    ]
  },
  {
    id: 3,
    name: 'Sayuran Organik Sari',
    category: 'pertanian',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    description: 'Sayuran organik segar langsung dari kebun sendiri, bebas pestisida dan pupuk kimia.',
    location: 'Kebun Organik Cilame',
    rating: 4.7,
    reviewCount: 156,
    phone: '081234567892',
    products: [
      { name: 'Paket Sayuran 1kg', price: 25000, image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
      { name: 'Kangkung Organik', price: 8000, image: 'https://images.pexels.com/photos/1256621/pexels-photo-1256621.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
      { name: 'Bayam Merah', price: 10000, image: 'https://images.pexels.com/photos/1407862/pexels-photo-1407862.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
    ],
    featured: false,
    openTime: '05:00 - 10:00',
    owner: 'Sari Wulandari',
    established: '2020',
    specialties: ['Sayuran Organik', 'Hidroponik', 'Pupuk Kompos'],
    gallery: [
      'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'https://images.pexels.com/photos/1256621/pexels-photo-1256621.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      'https://images.pexels.com/photos/1407862/pexels-photo-1407862.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    ]
  }
];

export async function generateStaticParams() {
  return umkmData.map((umkm) => ({
    id: umkm.id.toString(),
  }));
}

export default function UMKMDetailPage({ params }: { params: { id: string } }) {
  const umkmId = parseInt(params.id);
  const umkm = umkmData.find(item => item.id === umkmId);

  return <UMKMDetailClient umkm={umkm} umkmData={umkmData} />;
}