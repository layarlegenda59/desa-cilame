'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, Eye, ArrowRight, Filter, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BeritaDesaPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const newsData = [
    {
      id: 1,
      title: 'Pelatihan UMKM Digital Marketing Sukses Digelar',
      excerpt: 'Desa Cilame menggelar pelatihan digital marketing untuk para pelaku UMKM guna meningkatkan penjualan online dan memperluas jangkauan pasar.',
      content: 'Pelatihan yang berlangsung selama 3 hari ini diikuti oleh 50 pelaku UMKM dari berbagai sektor...',
      author: 'Tim Humas Desa Cilame',
      date: '2024-01-15',
      category: 'Ekonomi',
      image: '/pelatihan.jpg',
      views: 1250,
      featured: true
    },
    {
      id: 2,
      title: 'Festival Budaya Desa Cilame 2025',
      excerpt: 'Festival tahunan yang menampilkan kesenian tradisional, kuliner khas, dan pameran produk UMKM lokal akan diselenggarakan pada bulan Maret.',
      content: 'Festival Budaya Desa Cilame 2025 akan menghadirkan berbagai pertunjukan seni tradisional...',
      author: 'Panitia Festival',
      date: '2024-01-12',
      category: 'Budaya',
      image: '/festival.jpg',
      views: 980,
      featured: true
    },
    {
      id: 3,
      title: 'Pembangunan Jalan Desa Tahap II Dimulai',
      excerpt: 'Proyek pembangunan jalan desa tahap kedua dimulai untuk meningkatkan akses transportasi dan mendukung aktivitas ekonomi masyarakat.',
      content: 'Pembangunan jalan sepanjang 2.5 km ini akan menghubungkan Dusun Cilame Selatan dengan pusat desa...',
      author: 'Kepala Desa Cilame',
      date: '2024-01-10',
      category: 'Infrastruktur',
      image: '/mountin.jpg',
      views: 756,
      featured: false
    },
    {
      id: 4,
      title: 'Program Bantuan Bibit Tanaman Organik',
      excerpt: 'Pemerintah desa memberikan bantuan bibit tanaman organik kepada 100 petani untuk mendukung program pertanian berkelanjutan.',
      content: 'Program ini merupakan bagian dari upaya desa untuk mengembangkan pertanian organik...',
      author: 'Kaur Perencanaan',
      date: '2024-01-08',
      category: 'Pertanian',
      image: '/mountin.jpg',
      views: 642,
      featured: false
    },
    {
      id: 5,
      title: 'Peluncuran Website Resmi Desa Cilame',
      excerpt: 'Website resmi Desa Cilame diluncurkan untuk meningkatkan transparansi dan memudahkan akses informasi bagi masyarakat.',
      content: 'Website ini menyediakan berbagai layanan online dan informasi terkini tentang desa...',
      author: 'Tim IT Desa',
      date: '2024-01-05',
      category: 'Teknologi',
      image: '/mountin.jpg',
      views: 1100,
      featured: false
    },
    {
      id: 6,
      title: 'Vaksinasi COVID-19 Booster Gratis',
      excerpt: 'Puskesmas Cilame bekerja sama dengan pemerintah desa menggelar vaksinasi booster gratis untuk seluruh warga.',
      content: 'Kegiatan vaksinasi ini dilaksanakan di Balai Desa dengan protokol kesehatan yang ketat...',
      author: 'Puskesmas Cilame',
      date: '2024-01-03',
      category: 'Kesehatan',
      image: '/mountin.jpg',
      views: 890,
      featured: false
    },
    {
      id: 7,
      title: 'Gotong Royong Pembersihan Sungai',
      excerpt: 'Masyarakat Desa Cilame bergotong royong membersihkan sungai untuk menjaga kelestarian lingkungan dan mencegah banjir.',
      content: 'Kegiatan yang diikuti 200 warga ini berhasil mengangkat 2 ton sampah dari sungai...',
      author: 'Ketua RT 05',
      date: '2024-01-01',
      category: 'Lingkungan',
      image: '/mountin.jpg',
      views: 567,
      featured: false
    },
    {
      id: 8,
      title: 'Pelatihan Keterampilan Ibu-Ibu PKK',
      excerpt: 'PKK Desa Cilame mengadakan pelatihan membuat kerajinan tangan dan pengolahan makanan untuk meningkatkan ekonomi keluarga.',
      content: 'Pelatihan ini diikuti 40 ibu-ibu dan menghasilkan berbagai produk kerajinan berkualitas...',
      author: 'Ketua PKK Desa',
      date: '2023-12-28',
      category: 'Sosial',
      image: '/mountin.jpg',
      views: 445,
      featured: false
    }
  ];

  const categories = ['Semua', 'Ekonomi', 'Budaya', 'Infrastruktur', 'Pertanian', 'Teknologi', 'Kesehatan', 'Lingkungan', 'Sosial'];

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = newsData.filter(news => news.featured);
  const regularNews = filteredNews.filter(news => !news.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Ekonomi': 'bg-green-100 text-green-800 border-green-200',
      'Budaya': 'bg-purple-100 text-purple-800 border-purple-200',
      'Infrastruktur': 'bg-blue-100 text-blue-800 border-blue-200',
      'Pertanian': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Teknologi': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Kesehatan': 'bg-red-100 text-red-800 border-red-200',
      'Lingkungan': 'bg-teal-100 text-teal-800 border-teal-200',
      'Sosial': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-700 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Berita Desa Cilame
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 mb-8">
              Informasi Terkini dan Kegiatan Desa
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                Update Harian
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                {newsData.reduce((total, news) => total + news.views, 0).toLocaleString()} Views
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari berita..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured News */}
        {searchTerm === '' && selectedCategory === 'Semua' && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Berita Utama</h2>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Featured
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNews.map((news) => (
                <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(news.category)}>
                        <Tag className="h-3 w-3 mr-1" />
                        {news.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-semibold mb-1 line-clamp-2">{news.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-200">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(news.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {news.views.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{news.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-3 w-3" />
                        {news.author}
                      </div>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                        Baca Selengkapnya
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular News */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || selectedCategory !== 'Semua' ? 'Hasil Pencarian' : 'Berita Terbaru'}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredNews.length} berita ditemukan
            </div>
          </div>
          
          {filteredNews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada berita ditemukan</h3>
                <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchTerm === '' && selectedCategory === 'Semua' ? regularNews : filteredNews).map((news) => (
                <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-40">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <Badge className={getCategoryColor(news.category)} variant="outline">
                        {news.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="bg-black/50 text-white border-white/30 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        {news.views}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{news.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{news.excerpt}</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(news.date)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        {news.author}
                      </div>
                      <Button variant="outline" size="sm" className="w-full text-blue-600 border-blue-300 hover:bg-blue-50">
                        Baca Selengkapnya
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredNews.length > 6 && (
          <div className="text-center">
            <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
              Muat Lebih Banyak
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Newsletter Subscription */}
        <Card className="bg-gradient-to-r from-slate-700 to-blue-700 text-white mt-12">
          <CardContent className="py-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Berlangganan Newsletter</h3>
              <p className="text-slate-100 mb-6">
                Dapatkan berita terbaru dan informasi penting dari Desa Cilame langsung di email Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  placeholder="Masukkan email Anda"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button variant="secondary" className="bg-white text-slate-700 hover:bg-white/90">
                  Berlangganan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}