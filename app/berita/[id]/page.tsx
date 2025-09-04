'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  User, 
  Eye, 
  ArrowLeft, 
  Share2, 
  Heart, 
  MessageCircle,
  Clock,
  Tag,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

interface BeritaData {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  views: number;
  featured: boolean;
}

export default function BeritaDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const [berita, setBerita] = useState<BeritaData | null>(null);
  const [relatedNews, setRelatedNews] = useState<BeritaData[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample news data - in real app this would come from API
  const newsData: BeritaData[] = [
    {
      id: 1,
      title: 'Pembangunan Jalan Akses Desa Tahap II Dimulai',
      excerpt: 'Program pembangunan infrastruktur jalan sepanjang 2 kilometer dimulai hari ini dengan anggaran dari APBN.',
      content: `<div class="prose max-w-none">
        <p>Program pembangunan infrastruktur jalan sepanjang 2 kilometer di Desa Cilame resmi dimulai hari ini, Senin (15/1/2025). Proyek yang dibiayai melalui anggaran APBN ini merupakan kelanjutan dari tahap pertama yang telah berhasil diselesaikan tahun lalu.</p>
        
        <p>Kepala Desa Cilame, Bapak Ahmad Suryadi, menyampaikan bahwa pembangunan jalan ini sangat penting untuk meningkatkan akses transportasi warga, terutama untuk mendukung aktivitas ekonomi dan pendidikan.</p>
        
        <h3>Detail Proyek</h3>
        <ul>
          <li>Panjang jalan: 2 kilometer</li>
          <li>Lebar jalan: 4 meter</li>
          <li>Anggaran: Rp 2.5 miliar</li>
          <li>Target selesai: Juni 2025</li>
          <li>Kontraktor: PT Karya Infrastruktur Nusantara</li>
        </ul>
        
        <p>"Dengan adanya jalan ini, diharapkan akses menuju pusat kota akan lebih mudah dan cepat. Hal ini juga akan berdampak positif pada perekonomian masyarakat," ujar Kepala Desa.</p>
        
        <p>Pembangunan jalan ini juga akan dilengkapi dengan sistem drainase yang baik untuk mencegah genangan air saat musim hujan. Selain itu, akan dipasang penerangan jalan tenaga surya untuk meningkatkan keamanan di malam hari.</p>
      </div>`,
      author: 'Tim Humas Desa',
      date: '2025-01-15',
      category: 'Infrastruktur',
      image: '/jalan.jpg',
      views: 1456,
      featured: true
    },
    {
      id: 2,
      title: 'Pelatihan UMKM Digital Marketing Sukses Digelar',
      excerpt: 'Sebanyak 50 pelaku UMKM mengikuti pelatihan digital marketing untuk meningkatkan penjualan online.',
      content: `<div class="prose max-w-none">
        <p>Desa Cilame berhasil menyelenggarakan pelatihan digital marketing untuk para pelaku UMKM pada tanggal 10 Januari 2025. Kegiatan yang berlangsung selama 2 hari ini diikuti oleh 50 peserta dari berbagai sektor usaha.</p>
        
        <p>Pelatihan ini merupakan bagian dari program pemberdayaan ekonomi masyarakat yang bertujuan untuk meningkatkan kemampuan pelaku UMKM dalam memasarkan produk mereka secara online.</p>
        
        <h3>Materi Pelatihan</h3>
        <ul>
          <li>Pengenalan e-commerce dan marketplace</li>
          <li>Strategi pemasaran digital</li>
          <li>Fotografi produk</li>
          <li>Pengelolaan media sosial</li>
          <li>Analisis data penjualan</li>
        </ul>
        
        <p>"Pelatihan ini sangat bermanfaat untuk mengembangkan usaha kami. Sekarang kami lebih paham cara menjual produk secara online," kata Ibu Siti, salah satu peserta pelatihan yang memiliki usaha kerajinan bambu.</p>
        
        <p>Sebagai tindak lanjut, akan dibentuk komunitas UMKM digital yang akan saling mendukung dalam mengembangkan bisnis online mereka.</p>
      </div>`,
      author: 'Bagian Ekonomi',
      date: '2025-01-10',
      category: 'Ekonomi',
      image: '/pelatihan.jpg',
      views: 1234,
      featured: true
    },
    {
      id: 3,
      title: 'Festival Budaya Desa Cilame 2025',
      excerpt: 'Persiapan festival budaya tahunan sudah dimulai dengan melibatkan seluruh warga dan komunitas seni lokal.',
      content: `<div class="prose max-w-none">
        <p>Festival Budaya Desa Cilame 2025 akan segera diselenggarakan pada bulan Maret mendatang. Persiapan festival tahunan ini sudah dimulai dengan melibatkan seluruh warga dan komunitas seni lokal.</p>
        
        <p>Festival ini merupakan ajang untuk melestarikan dan memperkenalkan budaya lokal kepada generasi muda serta wisatawan yang berkunjung ke Desa Cilame.</p>
        
        <h3>Rangkaian Acara</h3>
        <ul>
          <li>Pertunjukan tari tradisional</li>
          <li>Pameran kerajinan tangan</li>
          <li>Festival kuliner khas desa</li>
          <li>Lomba seni dan budaya</li>
          <li>Pasar rakyat produk UMKM</li>
        </ul>
        
        <p>"Festival ini tidak hanya sebagai hiburan, tetapi juga sebagai sarana edukasi budaya dan promosi produk lokal," ungkap Ketua Panitia Festival, Bapak Dedi Kurniawan.</p>
        
        <p>Diharapkan festival ini dapat menarik wisatawan dan meningkatkan perekonomian masyarakat lokal melalui penjualan produk UMKM dan jasa pariwisata.</p>
      </div>`,
      author: 'Bagian Kebudayaan',
      date: '2025-01-08',
      category: 'Budaya',
      image: '/festival.jpg',
      views: 987,
      featured: true
    }
  ];

  useEffect(() => {
    const id = parseInt(params.id as string);
    const foundBerita = newsData.find(item => item.id === id);
    
    if (foundBerita) {
      setBerita(foundBerita);
      // Get related news (same category, excluding current)
      const related = newsData
        .filter(item => item.category === foundBerita.category && item.id !== id)
        .slice(0, 3);
      setRelatedNews(related);
    }
    
    setLoading(false);
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Infrastruktur': return 'bg-blue-100 text-blue-800';
      case 'Ekonomi': return 'bg-green-100 text-green-800';
      case 'Budaya': return 'bg-purple-100 text-purple-800';
      case 'Sosial': return 'bg-orange-100 text-orange-800';
      case 'Pendidikan': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Berita Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Maaf, berita yang Anda cari tidak dapat ditemukan.</p>
          <Link href="/informasi/berita">
            <Button className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Berita
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Beranda</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/informasi/berita" className="hover:text-green-600">Berita</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{berita.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-64 md:h-80">
                <Image
                  src={berita.image}
                  alt={berita.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getCategoryColor(berita.category)}>
                    {berita.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Article Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{berita.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(berita.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{berita.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{berita.views.toLocaleString()} views</span>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed">{berita.excerpt}</p>
                </div>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: berita.content }}
                />

                {/* Social Actions */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Suka
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Komentar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Bagikan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Back Button */}
            <Link href="/informasi/berita">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Daftar Berita
              </Button>
            </Link>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Berita Terkait</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedNews.map((news) => (
                    <Link key={news.id} href={`/berita/${news.id}`}>
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {news.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(news.date)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Popular News */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Berita Populer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsData
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 3)
                  .map((news) => (
                    <Link key={news.id} href={`/berita/${news.id}`}>
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {news.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{news.views.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}