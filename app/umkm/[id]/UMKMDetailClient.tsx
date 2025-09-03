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
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  ExternalLink,
  Store,
  Users,
  Award
} from 'lucide-react';

interface Product {
  name: string;
  price: number;
  image: string;
}

interface UMKM {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  phone: string;
  products: Product[];
  featured: boolean;
  openTime: string;
  owner: string;
  established: string;
  specialties: string[];
  gallery: string[];
}

interface UMKMDetailClientProps {
  umkm: UMKM | undefined;
  umkmData: UMKM[];
}

export function UMKMDetailClient({ umkm, umkmData }: UMKMDetailClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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
                <h1 className="text-lg font-semibold text-gray-900">{umkm.name}</h1>
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
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video relative rounded-t-lg overflow-hidden">
                  <Image
                    src={umkm.gallery[selectedImage]}
                    alt={umkm.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    quality={90}
                  />
                </div>
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {umkm.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-purple-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${umkm.name} ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{umkm.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{umkm.rating}</span>
                        <span>({umkm.reviewCount} ulasan)</span>
                      </div>
                      <Badge variant="secondary">{t(`umkm.${umkm.category}`)}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{umkm.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{umkm.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{umkm.openTime}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{umkm.owner}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{t('umkm.since')} {umkm.established}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('umkm.specialties')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {umkm.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('umkm.featured_products')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {umkm.products.map((product, index) => (
                    <div key={index} className="flex space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-lg font-bold text-purple-600">{formatPrice(product.price)}</p>
                        <Button size="sm" className="mt-2">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {t('umkm.order')}
                        </Button>
                      </div>
                    </div>
                  ))}
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
                      <span className="font-semibold">{umkm.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('umkm.total_reviews')}</span>
                    <span className="font-semibold">{umkm.reviewCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('umkm.products')}</span>
                    <span className="font-semibold">{umkm.products.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('umkm.established_year')}</span>
                    <span className="font-semibold">{umkm.established}</span>
                  </div>
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
                              src={relatedUmkm.image}
                              alt={relatedUmkm.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{relatedUmkm.name}</h4>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span>{relatedUmkm.rating}</span>
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