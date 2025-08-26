'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  DollarSign,
  User,
  Briefcase
} from 'lucide-react';

export default function PasarKerjaPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [selectedLocation, setSelectedLocation] = useState('semua');

  const categories = [
    { id: 'semua', label: 'Semua Kategori' },
    { id: 'tukang', label: 'Tukang & Konstruksi' },
    { id: 'rumah-tangga', label: 'Pembantu Rumah Tangga' },
    { id: 'kebun', label: 'Pertanian & Kebun' },
    { id: 'otomotif', label: 'Otomotif' },
    { id: 'elektronik', label: 'Elektronik' },
    { id: 'kuliner', label: 'Kuliner' },
    { id: 'lainnya', label: 'Lainnya' }
  ];

  const locations = [
    { id: 'semua', label: 'Semua Lokasi' },
    { id: 'pusat', label: 'Cilame Pusat' },
    { id: 'utara', label: 'Cilame Utara' },
    { id: 'selatan', label: 'Cilame Selatan' },
    { id: 'timur', label: 'Cilame Timur' },
    { id: 'barat', label: 'Cilame Barat' }
  ];

  const workers = [
    {
      id: 1,
      name: 'Budi Santoso',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      profession: 'Tukang Bangunan',
      category: 'tukang',
      location: t('job.north'),
      rating: 4.8,
      reviewCount: 23,
      hourlyRate: '50000',
      description: 'Berpengalaman 10 tahun dalam konstruksi bangunan, renovasi rumah, dan perbaikan atap.',
      skills: ['Bangunan', 'Renovasi', 'Atap'],
      availability: t('job.available'),
      phone: '081234567891',
      completedJobs: 45
    },
    {
      id: 2,
      name: 'Sari Wulandari',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      profession: 'Pembantu Rumah Tangga',
      category: 'rumah-tangga',
      location: t('job.center'),
      rating: 4.9,
      reviewCount: 31,
      hourlyRate: '25000',
      description: 'Berpengalaman mengurus rumah tangga, memasak, dan merawat anak-anak dengan penuh perhatian.',
      skills: ['Memasak', 'Membersihkan', 'Perawatan Anak'],
      availability: t('job.available'),
      phone: '081234567892',
      completedJobs: 67
    },
    {
      id: 3,
      name: 'Agus Permana',
      photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      profession: 'Teknisi Motor',
      category: 'otomotif',
      location: t('job.south'),
      rating: 4.7,
      reviewCount: 18,
      hourlyRate: '40000',
      description: 'Spesialis service motor dan mobil, berpengalaman 8 tahun dengan berbagai merk kendaraan.',
      skills: ['Service Motor', 'Service Mobil', 'Spare Part'],
      availability: t('job.busy_until'),
      phone: '081234567893',
      completedJobs: 34
    },
    {
      id: 4,
      name: 'Rina Handayani',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      profession: 'Chef Pribadi',
      category: 'kuliner',
      location: t('job.east'),
      rating: 5.0,
      reviewCount: 12,
      hourlyRate: '75000',
      description: 'Chef berpengalaman untuk acara khusus, catering, dan masakan rumahan dengan cita rasa istimewa.',
      skills: ['Masakan Indonesia', 'Catering', 'Kue'],
      availability: t('job.available'),
      phone: '081234567894',
      completedJobs: 28
    },
    {
      id: 5,
      name: 'Dedi Kurniawan',
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      profession: 'Tukang Kebun',
      category: 'kebun',
      location: t('job.west'),
      rating: 4.6,
      reviewCount: 15,
      hourlyRate: '30000',
      description: 'Ahli dalam perawatan taman, pemangkasan pohon, dan berkebun organik.',
      skills: ['Taman', 'Pemangkasan', 'Organik'],
      availability: t('job.available'),
      phone: '081234567895',
      completedJobs: 52
    },
    {
      id: 6,
      name: 'Fitri Rahayu',
      photo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      profession: 'Teknisi Elektronik',
      category: 'elektronik',
      location: t('job.center'),
      rating: 4.8,
      reviewCount: 26,
      hourlyRate: '45000',
      description: 'Service TV, kulkas, mesin cuci, dan elektronik rumah tangga lainnya dengan garansi.',
      skills: ['TV', 'Kulkas', 'Mesin Cuci'],
      availability: t('job.available'),
      phone: '081234567896',
      completedJobs: 41
    }
  ];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'semua' || worker.category === selectedCategory;
    const matchesLocation = selectedLocation === 'semua' || worker.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Pasar Tenaga Kerja Lokal</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Temukan jasa dan pekerja terpercaya di Desa Cilame dengan sistem booking dan pembayaran yang aman
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('job.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {t('job.showing_workers').replace('{count}', filteredWorkers.length.toString())}
          </p>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container-responsive">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Worker Photo */}
                <div className="relative card-image-container aspect-4-3">
                  <Image
                    src={worker.photo}
                    alt={worker.name}
                    fill
                    className="card-image"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={worker.availability === 'Tersedia' ? 'default' : 'secondary'}>
                      {worker.availability}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{worker.rating}</span>
                        <span className="text-sm text-gray-600">({worker.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Worker Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                      <p className="text-blue-600 font-medium">{worker.profession}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        Rp {parseInt(worker.hourlyRate).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{t('job.per_hour')}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{worker.location}</span>
                    <span className="mx-2">•</span>
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{worker.completedJobs} {t('job.completed_jobs')}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {worker.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {worker.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button className="flex-1" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {t('job.booking')}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('job.no_workers')}</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-lg p-8 mt-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{t('job.join_worker')}</h2>
          <p className="text-blue-100 mb-6">
            {t('job.join_description')}
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100">
            <User className="h-4 w-4 mr-2" />
            {t('job.register_worker')}
          </Button>
        </div>
      </div>
    </div>
  );
}