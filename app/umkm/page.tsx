'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Star, 
  ShoppingCart,
  Phone,
  MessageCircle,
  Store,
  Filter,
  Heart,
  ExternalLink
} from 'lucide-react';

// Interface untuk data UMKM dari backend
interface UMKM {
  id: string;
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
  socialMedia?: string;
  social_media?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  establishedYear?: string;
  established_year?: string;
  employees?: number;
  employee_count?: number;
  status: 'active' | 'inactive' | 'pending';
  products: string;
  revenue?: string;
  annual_revenue?: string;
  certification?: string;
  images?: string | string[];
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export default function UMKMPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [umkmData, setUmkmData] = useState<UMKM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch UMKM data from API
  const fetchUmkmData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Tambahkan timestamp untuk cache busting
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/umkm?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch UMKM data');
      }
      const result = await response.json();
      const data = result.data || [];
      // Filter hanya UMKM yang aktif untuk halaman publik
      const activeUmkm = data.filter((umkm: UMKM) => umkm.status === 'active');
      setUmkmData(activeUmkm);
    } catch (error) {
      console.error('Error fetching UMKM:', error);
      setError('Gagal memuat data UMKM');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUmkmData();
  }, []);

  const categories = [
      { id: 'semua', label: t('umkm.all_categories') },
      { id: 'Kuliner', label: t('umkm.culinary') },
      { id: 'Fashion', label: t('umkm.fashion') },
      { id: 'Kerajinan', label: t('umkm.handicraft') },
      { id: 'Pertanian', label: t('umkm.agriculture') },
      { id: 'Jasa', label: t('umkm.services') },
      { id: 'Elektronik', label: t('umkm.electronics') },
      { id: 'Kosmetik', label: t('umkm.beauty') },
      { id: 'Retail', label: 'Retail' },
      { id: 'Tekstil', label: 'Tekstil' },
      { id: 'Meubelair', label: 'Meubelair' }
    ];

  // Helper function untuk mendapatkan nama UMKM
  const getUmkmName = (umkm: UMKM) => {
    return umkm.business_name || umkm.name || 'Nama tidak tersedia';
  };

  // Helper function untuk mendapatkan nama pemilik
  const getOwnerName = (umkm: UMKM) => {
    return umkm.owner_name || umkm.owner || 'Pemilik tidak tersedia';
  };

  // Helper function untuk mendapatkan tahun berdiri
  const getEstablishedYear = (umkm: UMKM) => {
    return umkm.established_year || umkm.establishedYear || 'Tidak diketahui';
  };

  // Helper function untuk mendapatkan jumlah karyawan
  const getEmployeeCount = (umkm: UMKM) => {
    return umkm.employee_count || umkm.employees || 0;
  };

  // Helper function untuk mendapatkan gambar utama
  const getMainImage = (umkm: UMKM) => {
    if (umkm.images) {
      // Jika images sudah berupa array
      if (Array.isArray(umkm.images) && umkm.images.length > 0) {
        return umkm.images[0];
      }
      
      // Jika images berupa string, coba parse sebagai JSON
      if (typeof umkm.images === 'string') {
        try {
          const parsedImages = JSON.parse(umkm.images);
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            return parsedImages[0];
          }
        } catch (e) {
          // Jika parsing gagal, anggap sebagai URL tunggal
          if (umkm.images.trim() && umkm.images !== '[]' && umkm.images !== '""') {
            return umkm.images;
          }
        }
      }
    }
    
    // Default image berdasarkan kategori
    const categoryImages = {
      'Kuliner': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'kuliner': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Perdagangan': 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Kerajinan': 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'kerajinan': 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Pertanian': 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'pertanian': 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Fashion': 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'fashion': 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Kosmetik': 'https://images.pexels.com/photos/7262940/pexels-photo-7262940.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Jasa': 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'jasa': 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    };
    
    return categoryImages[umkm.category as keyof typeof categoryImages] || 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
  };

  // Helper function untuk mendapatkan produk
  const getProducts = (umkm: UMKM) => {
    return umkm.products || 'Produk tidak tersedia';
  };


  const filteredUMKM = umkmData.filter(umkm => {
    const umkmName = getUmkmName(umkm);
    const matchesSearch = umkmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         umkm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         umkm.products.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || umkm.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Untuk featured UMKM, kita ambil 3 UMKM pertama dari hasil filter
  const featuredUMKM = filteredUMKM.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('umkm.title')}</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            {t('umkm.subtitle')}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('umkm.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                {t('ui.grid')}
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                {t('ui.list')}
              </Button>
            </div>
          </div>
        </div>

        {/* Featured UMKM */}
        {featuredUMKM.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('umkm.featured')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container-responsive">
              {featuredUMKM.map((umkm) => (
                <Card key={umkm.id} className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-yellow-200">
                  <div className="relative">
                    <div className="card-image-container aspect-4-3 relative">
                      <Image
                        src={getMainImage(umkm)}
                        alt={getUmkmName(umkm)}
                        fill
                        className="card-image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
                        }}
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500 text-yellow-900">
                        ⭐ {t('umkm.featured')}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{getUmkmName(umkm)}</h3>
                        <p className="text-purple-600 text-sm font-medium">
                          {t(`umkm.${umkm.category}`)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.5</span>
                      <span className="text-xs text-gray-500">(Rating)</span>
                    </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {umkm.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{umkm.address || 'Alamat tidak tersedia'}</span>
                    </div>

                    {/* Owner, Established Year, Employees */}
                    <div className="space-y-1 mb-3">
                      {(umkm.owner_name || umkm.owner) && (
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium mr-1">Pemilik:</span>
                          <span>{umkm.owner_name || umkm.owner}</span>
                        </div>
                      )}
                      {(umkm.established_year || umkm.establishedYear) && (
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium mr-1">Berdiri:</span>
                          <span>{umkm.established_year || umkm.establishedYear}</span>
                        </div>
                      )}
                      {(umkm.employee_count || umkm.employees) && (
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium mr-1">Karyawan:</span>
                          <span>{umkm.employee_count || umkm.employees} orang</span>
                        </div>
                      )}
                    </div>

                    {/* Product Preview */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">{t('umkm.products')}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{getProducts(umkm)}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/umkm/${umkm.id}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          <Store className="h-4 w-4 mr-2" />
                          {t('umkm.view_store')}
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All UMKM */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('umkm.all_umkm')} ({filteredUMKM.length})
          </h2>
          <p className="text-gray-600">
            {selectedCategory !== 'semua' 
              ? `${t('umkm.category')}: ${t(`umkm.${selectedCategory}`)}`
              : t('umkm.showing_all')}
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container-responsive">
            {filteredUMKM.map((umkm) => (
              <Card key={umkm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="card-image-container aspect-4-3 relative">
                  <Image
                    src={getMainImage(umkm)}
                    alt={getUmkmName(umkm)}
                    fill
                    className="card-image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{getUmkmName(umkm)}</h3>
                      <p className="text-purple-600 text-sm">
                        {t(`umkm.${umkm.category}`)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {umkm.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">{umkm.address || 'Alamat tidak tersedia'}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/umkm/${umkm.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        <Store className="h-4 w-4 mr-2" />
                        {t('umkm.view_store')}
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6 container-responsive">
            {filteredUMKM.map((umkm) => (
              <Card key={umkm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="md:flex">
                    <div className="md:w-1/4 relative card-image-container md:aspect-4-3 aspect-16-9">
                      <Image
                        src={getMainImage(umkm)}
                        alt={getUmkmName(umkm)}
                        fill
                        className="card-image"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        quality={80}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
                        }}
                      />
                    </div>
                    
                    <div className="md:w-3/4 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{getUmkmName(umkm)}</h3>
                          <p className="text-purple-600 font-medium">
                            {t(`umkm.${umkm.category}`)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">4.5</span>
                            <span className="text-sm text-gray-500">(Rating)</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {umkm.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{umkm.address || 'Alamat tidak tersedia'}</span>
                        <span className="mx-2">•</span>
                        <span>{umkm.phone || 'Telepon tidak tersedia'}</span>
                      </div>

                      {/* Owner, Established Year, Employees */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        {(umkm.owner_name || umkm.owner) && (
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Pemilik:</span>
                            <span>{umkm.owner_name || umkm.owner}</span>
                          </div>
                        )}
                        {(umkm.established_year || umkm.establishedYear) && (
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Berdiri:</span>
                            <span>{umkm.established_year || umkm.establishedYear}</span>
                          </div>
                        )}
                        {(umkm.employee_count || umkm.employees) && (
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Karyawan:</span>
                            <span>{umkm.employee_count || umkm.employees} orang</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">{t('umkm.products')}</p>
                        <p className="text-sm text-gray-700">{getProducts(umkm)}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Link href={`/umkm/${umkm.id}`}>
                            <Button>
                              <Store className="h-4 w-4 mr-2" />
                              {t('umkm.view_store')}
                            </Button>
                          </Link>
                          <Button variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            {t('umkm.contact')}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {t('umkm.products_available')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredUMKM.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('umkm.no_results')}</p>
            <p className="text-gray-400 mt-2">{t('umkm.try_different_search')}</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 mt-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{t('umkm.register_business')}</h2>
          <p className="text-purple-100 mb-6">
            {t('umkm.register_description')}
          </p>
          <Button className="bg-white text-purple-600 hover:bg-gray-100">
            <Store className="h-4 w-4 mr-2" />
            {t('umkm.register_umkm')}
          </Button>
        </div>
      </div>
    </div>
  );
}