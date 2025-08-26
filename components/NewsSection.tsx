import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewsSection() {
  const { t } = useLanguage();

  const news = [
    {
      title: 'Pembangunan Jalan Akses Desa Tahap II Dimulai',
      excerpt: 'Program pembangunan infrastruktur jalan sepanjang 2 kilometer dimulai hari ini dengan anggaran dari APBN.',
      image: '/jalan.jpg',
      date: '2025-01-15',
      author: 'Tim Humas Desa',
      category: 'Pembangunan'
    },
    {
      title: 'Pelatihan UMKM Digital Marketing Sukses Digelar',
      excerpt: 'Sebanyak 50 pelaku UMKM mengikuti pelatihan digital marketing untuk meningkatkan penjualan online.',
      image: '/pelatihan.jpg',
      date: '2025-01-10',
      author: 'Bagian Ekonomi',
      category: 'UMKM'
    },
    {
      title: 'Festival Budaya Desa Cilame 2025',
      excerpt: 'Persiapan festival budaya tahunan sudah dimulai dengan melibatkan seluruh warga dan komunitas seni lokal.',
      image: '/festival.jpg',
      date: '2025-01-08',
      author: 'Bagian Kebudayaan',
      category: 'Budaya'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('news.title')}
            </h2>
            <p className="text-gray-600">
              {t('news.subtitle')}
            </p>
          </div>
          <Link href="/informasi">
            <Button variant="outline" className="hidden md:flex">
              {t('news.view_all')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container-responsive">
          {news.map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative card-image-container aspect-16-9">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="card-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={80}
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(article.date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{article.author}</span>
                  </div>
                </div>
                
                <Link href={`/berita/${index + 1}`}>
                  <Button variant="link" className="p-0 mt-3 text-green-600">
                    {t('news.read_more')}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/informasi">
            <Button variant="outline">
              {t('news.view_all')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}