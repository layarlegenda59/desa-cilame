'use client';

import { useState } from 'react';
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

export default function UMKMPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'semua', label: 'Semua Kategori' },
    { id: 'kuliner', label: 'Kuliner' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'kerajinan', label: 'Kerajinan' },
    { id: 'pertanian', label: 'Pertanian' },
    { id: 'jasa', label: 'Jasa' },
    { id: 'elektronik', label: 'Elektronik' },
    { id: 'kosmetik', label: 'Kosmetik & Kecantikan' }
  ];

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
      openTime: '06:00 - 22:00'
    },
    {
      id: 2,
      name: 'Kerajinan Bambu Hani',
      category: 'kerajinan',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Kerajinan bambu berkualitas tinggi untuk dekorasi rumah dan keperluan sehari-hari.',
      location: 'Kampung Bambu, Cilame Utara',
      rating: 4.9,
      reviewCount: 87,
      phone: '081234567891',
      products: [
        { name: 'Keranjang Bambu', price: 45000, image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { name: 'Vas Bunga Bambu', price: 35000, image: 'https://images.pexels.com/photos/1029620/pexels-photo-1029620.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { name: 'Anyaman Dinding', price: 75000, image: 'https://images.pexels.com/photos/6207387/pexels-photo-6207387.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
      ],
      featured: true,
      openTime: '08:00 - 17:00'
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
      openTime: '05:00 - 10:00'
    },
    {
      id: 4,
      name: 'Fashion Muslim Aini',
      category: 'fashion',
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Koleksi hijab dan busana muslim modern dengan bahan berkualitas dan desain terkini.',
      location: 'Toko Online & Offline Cilame',
      rating: 4.6,
      reviewCount: 203,
      phone: '081234567893',
      products: [
        { name: 'Hijab Segi Empat Premium', price: 45000, image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { name: 'Gamis Katun', price: 150000, image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { name: 'Mukena Traveling', price: 85000, image: 'https://images.pexels.com/photos/6069955/pexels-photo-6069955.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
      ],
      featured: false,
      openTime: '09:00 - 21:00'
    },
    {
      id: 5,
      name: 'Kopi Arabica Cilame',
      category: 'kuliner',
      image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Kopi arabica premium dari perkebunan lokal Cilame dengan proses roasting tradisional.',
      location: 'Perkebunan Kopi Cilame',
      rating: 4.9,
      reviewCount: 78,
      phone: '081234567894',
      products: [
        { name: 'Kopi Bubuk Arabica 250g', price: 35000, image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { name: 'Kopi Biji Sangrai 500g', price: 55000, image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { name: 'Cold Brew Concentrate', price: 25000, image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
      ],
      featured: true,
      openTime: '07:00 - 19:00'
    },
    {
      id: 6,
      name: 'Skincare Herbal Nana',
      category: 'kosmetik',
      image: 'https://images.pexels.com/photos/7262940/pexels-photo-7262940.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      description: 'Produk skincare alami dari bahan herbal lokal yang aman untuk semua jenis kulit.',
      location: 'Online Store Cilame',
      rating: 4.8,
      reviewCount: 92,
      phone: '081234567895',
      products: [
        { name: 'Face Serum Herbal', price: 65000, image: 'https://images.pexels.com/photos/7262940/pexels-photo-7262940.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { name: 'Masker Wajah Alami', price: 35000, image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' },
        { name: 'Sabun Madu Propolis', price: 25000, image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop' }
      ],
      featured: false,
      openTime: '24 Jam (Online)'
    }
  ];

  const filteredUMKM = umkmData.filter(umkm => {
    const matchesSearch = umkm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         umkm.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || umkm.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredUMKM = filteredUMKM.filter(umkm => umkm.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Direktori UMKM Desa Cilame</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Temukan dan dukung produk lokal berkualitas dari usaha mikro, kecil, dan menengah di Desa Cilame
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
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
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
                        src={umkm.image}
                        alt={umkm.name}
                        fill
                        className="card-image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={80}
                        loading="lazy"
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
                        <h3 className="text-lg font-semibold text-gray-900">{umkm.name}</h3>
                        <p className="text-purple-600 text-sm font-medium">
                          {t(`umkm.${umkm.category}`)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{umkm.rating}</span>
                        <span className="text-xs text-gray-500">({umkm.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {umkm.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{umkm.location}</span>
                    </div>

                    {/* Product Preview */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">{t('umkm.popular_products')}</p>
                      <div className="flex space-x-2 overflow-x-auto">
                        {umkm.products.slice(0, 3).map((product, index) => (
                          <div key={index} className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden aspect-square">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="card-image"
                              sizes="64px"
                              quality={75}
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
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
                    src={umkm.image}
                    alt={umkm.name}
                    fill
                    className="card-image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                    loading="lazy"
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
                      <h3 className="text-lg font-semibold text-gray-900">{umkm.name}</h3>
                      <p className="text-purple-600 text-sm">
                        {t(`umkm.${umkm.category}`)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{umkm.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {umkm.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">{umkm.location}</span>
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
                        src={umkm.image}
                        alt={umkm.name}
                        fill
                        className="card-image"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        quality={80}
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="md:w-3/4 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{umkm.name}</h3>
                          <p className="text-purple-600 font-medium">
                            {t(`umkm.${umkm.category}`)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{umkm.rating}</span>
                            <span className="text-sm text-gray-500">({umkm.reviewCount})</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {umkm.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{umkm.location}</span>
                        <span className="mx-2">•</span>
                        <span>{umkm.openTime}</span>
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
                          {umkm.products.length} {t('umkm.products_available')}
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