'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Heart,
  Share2,
  MessageCircle,
  ExternalLink,
  Store,
  Award,
  User
} from 'lucide-react';

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

interface UMKMDetailClientProps {
  umkm: UMKM | undefined;
  umkmData: UMKM[];
}

export function UMKMDetailClient({ umkm, umkmData }: UMKMDetailClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  // Helper functions
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
    
    // Default images based on category
    const defaultImages = {
      'Kuliner': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'kuliner': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Kerajinan': 'https://images.pexels.com/photos/1029620/pexels-photo-1029620.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'kerajinan': 'https://images.pexels.com/photos/1029620/pexels-photo-1029620.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Pertanian': 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'pertanian': 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Fashion': 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'fashion': 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'Jasa': 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      'jasa': 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    };
    
    return defaultImages[umkm.category as keyof typeof defaultImages] || 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
  };

  const getSocialMedia = (umkm: UMKM) => {
    if (umkm.social_media) {
      try {
        return typeof umkm.social_media === 'string' ? JSON.parse(umkm.social_media) : umkm.social_media;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const getImageGallery = (umkm: UMKM) => {
    if (umkm.images) {
      // Jika images sudah berupa array
      if (Array.isArray(umkm.images)) {
        return umkm.images.filter(img => img && img.trim());
      }
      
      // Jika images berupa string, coba parse sebagai JSON
      if (typeof umkm.images === 'string') {
        try {
          const parsedImages = JSON.parse(umkm.images);
          if (Array.isArray(parsedImages)) {
            return parsedImages.filter(img => img && img.trim());
          }
        } catch (e) {
          // Jika parsing gagal, anggap sebagai URL tunggal
          if (umkm.images.trim() && umkm.images !== '[]' && umkm.images !== '""') {
            return [umkm.images];
          }
        }
      }
    }
    return [getMainImage(umkm)];
  };

  const getProducts = (umkm: UMKM) => {
    if (umkm.products) {
      try {
        const products = JSON.parse(umkm.products);
        if (Array.isArray(products)) {
          return products.join(', ');
        }
        return umkm.products;
      } catch (e) {
        return umkm.products;
      }
    }
    return 'Produk tidak tersedia';
  };

  if (!umkm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('umkm.store_not_found')}</h1>
          <Link href="/umkm">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('umkm.back_to_list')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{umkm.business_name || umkm.name}</h1>
                <p className="text-sm text-gray-500">{t(`umkm.${umkm.category}`)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card>
              <CardContent className="p-0">
                <ImageCarousel
                  images={getImageGallery(umkm)}
                  alt={umkm.business_name || umkm.name || 'UMKM'}
                  autoPlay={true}
                  autoPlayInterval={5000}
                  showControls={true}
                  showIndicators={true}
                  className="rounded-t-lg"
                />
              </CardContent>
            </Card>

            {/* Store Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{umkm.business_name || umkm.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">4.5</span>
                        <span>(12 ulasan)</span>
                      </div>
                      <Badge variant="secondary">{t(`umkm.${umkm.category}`)}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{umkm.description || 'Deskripsi tidak tersedia'}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{umkm.address || 'Alamat tidak tersedia'}</span>
                  </div>
                  {umkm.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{umkm.phone}</span>
                    </div>
                  )}
                  {umkm.owner_name && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{umkm.owner_name}</span>
                    </div>
                  )}
                  {umkm.established_year && (
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">Berdiri {umkm.established_year}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Produk & Layanan</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{getProducts(umkm)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Social Media */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Kontak & Media Sosial</h3>
                <div className="space-y-4">
                  {umkm.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{umkm.phone}</span>
                    </div>
                  )}
                  {umkm.email && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                      <a href={`mailto:${umkm.email}`} className="text-purple-600 hover:underline">
                        {umkm.email}
                      </a>
                    </div>
                  )}
                  {umkm.website && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                      <a href={umkm.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  {getSocialMedia(umkm)?.instagram && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                      <a href={getSocialMedia(umkm)?.instagram} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        Instagram
                      </a>
                    </div>
                  )}
                  {getSocialMedia(umkm)?.facebook && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                      <a href={getSocialMedia(umkm)?.facebook} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        Facebook
                      </a>
                    </div>
                  )}
                  {getSocialMedia(umkm)?.whatsapp && (
                    <div className="flex items-center space-x-3">
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                      <a href={getSocialMedia(umkm)?.whatsapp} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('umkm.contact_store')}</h3>
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    {t('umkm.call_now')}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('umkm.chat_whatsapp')}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MapPin className="h-4 w-4 mr-2" />
                    {t('umkm.view_location')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('umkm.store_stats')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('umkm.rating')}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">4.5/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('umkm.total_reviews')}</span>
                    <span className="font-semibold">12</span>
                  </div>
                  {umkm.employee_count && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('umkm.employees')}</span>
                      <span className="font-semibold">{umkm.employee_count}</span>
                    </div>
                  )}
                  {umkm.established_year && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('umkm.established_year')}</span>
                      <span className="font-semibold">{umkm.established_year}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Related Stores */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('umkm.similar_stores')}</h3>
                <div className="space-y-3">
                  {umkmData
                    .filter(item => item.category === umkm.category && item.id !== umkm.id)
                    .slice(0, 2)
                    .map((relatedUmkm) => (
                      <Link key={relatedUmkm.id} href={`/umkm/${relatedUmkm.id}`}>
                        <div className="flex space-x-3 p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={getMainImage(relatedUmkm)}
                              alt={relatedUmkm.business_name || relatedUmkm.name || 'UMKM'}
                              fill
                              className="object-cover"
                              sizes="48px"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{relatedUmkm.business_name || relatedUmkm.name}</h4>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span>4.5</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  }
                </div>
                <Link href="/umkm">
                  <Button variant="outline" className="w-full mt-4">
                    <Store className="h-4 w-4 mr-2" />
                    {t('umkm.view_all_umkm')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}