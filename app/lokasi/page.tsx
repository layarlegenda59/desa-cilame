'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Phone, Clock, Building, School, Hospital, Store, Fuel, TreePine, Mountain, Users, Car, Bus, Bike, ExternalLink, Info, Globe, Compass, Route } from 'lucide-react';
import Image from 'next/image';

export default function LokasiPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('semua');

  const villageInfo = {
    name: 'Desa Cilame',
    coordinates: {
      latitude: -6.8734,
      longitude: 107.4784
    },
    area: '12.45 km²',
    altitude: '650-850 mdpl',
    population: '8.247 jiwa',
    households: '2.156 KK',
    address: 'Jalan Galudra No. 37, Desa Cilame, Kecamatan Ngamprah, Kabupaten Bandung Barat 40552'
  };

  const boundaries = [
    { direction: 'Utara', area: 'Desa Cihampelas' },
    { direction: 'Selatan', area: 'Desa Ngamprah' },
    { direction: 'Timur', area: 'Desa Cimareme' },
    { direction: 'Barat', area: 'Desa Tanimulya' }
  ];

  const facilities = [
    {
      id: 1,
      name: 'Kantor Desa Cilame',
      category: 'pemerintahan',
      type: 'Kantor Pemerintahan',
      address: 'Jalan Galudra No. 37',
      phone: '(022) 1234-5678',
      hours: 'Senin-Jumat: 08:00-16:00',
      icon: Building,
      color: 'bg-blue-100 text-blue-600',
      description: 'Pusat pelayanan administrasi dan pemerintahan desa'
    },
    {
      id: 2,
      name: 'SDN Cilame 1',
      category: 'pendidikan',
      type: 'Sekolah Dasar',
      address: 'Jalan Pendidikan No. 15',
      phone: '(022) 1234-5679',
      hours: 'Senin-Sabtu: 07:00-15:00',
      icon: School,
      color: 'bg-green-100 text-green-600',
      description: 'Sekolah dasar negeri dengan fasilitas lengkap'
    },
    {
      id: 3,
      name: 'SDN Cilame 2',
      category: 'pendidikan',
      type: 'Sekolah Dasar',
      address: 'Jalan Mawar No. 8',
      phone: '(022) 1234-5680',
      hours: 'Senin-Sabtu: 07:00-15:00',
      icon: School,
      color: 'bg-green-100 text-green-600',
      description: 'Sekolah dasar negeri dengan program unggulan'
    },
    {
      id: 4,
      name: 'Puskesmas Cilame',
      category: 'kesehatan',
      type: 'Pusat Kesehatan',
      address: 'Jalan Sehat No. 22',
      phone: '(022) 1234-5681',
      hours: '24 Jam',
      icon: Hospital,
      color: 'bg-red-100 text-red-600',
      description: 'Pusat kesehatan masyarakat dengan layanan 24 jam'
    },
    {
      id: 5,
      name: 'Posyandu Melati',
      category: 'kesehatan',
      type: 'Posyandu',
      address: 'RT 02/RW 01',
      phone: '-',
      hours: 'Setiap Rabu: 09:00-12:00',
      icon: Hospital,
      color: 'bg-red-100 text-red-600',
      description: 'Pos pelayanan terpadu untuk ibu dan anak'
    },
    {
      id: 6,
      name: 'Pasar Cilame',
      category: 'ekonomi',
      type: 'Pasar Tradisional',
      address: 'Jalan Pasar No. 5',
      phone: '-',
      hours: 'Setiap hari: 05:00-17:00',
      icon: Store,
      color: 'bg-purple-100 text-purple-600',
      description: 'Pasar tradisional dengan berbagai kebutuhan sehari-hari'
    },
    {
      id: 7,
      name: 'SPBU Cilame',
      category: 'ekonomi',
      type: 'SPBU',
      address: 'Jalan Raya Cilame',
      phone: '(022) 1234-5682',
      hours: '24 Jam',
      icon: Fuel,
      color: 'bg-yellow-100 text-yellow-600',
      description: 'Stasiun pengisian bahan bakar umum'
    },
    {
      id: 8,
      name: 'Masjid Al-Ikhlas',
      category: 'ibadah',
      type: 'Masjid',
      address: 'Jalan Masjid No. 10',
      phone: '-',
      hours: 'Setiap hari: 04:00-22:00',
      icon: Building,
      color: 'bg-indigo-100 text-indigo-600',
      description: 'Masjid utama desa dengan kapasitas 500 jamaah'
    },
    {
      id: 9,
      name: 'Balai Desa',
      category: 'sosial',
      type: 'Balai Pertemuan',
      address: 'Jalan Galudra No. 35',
      phone: '(022) 1234-5683',
      hours: 'Senin-Minggu: 08:00-22:00',
      icon: Users,
      color: 'bg-orange-100 text-orange-600',
      description: 'Balai serbaguna untuk acara dan pertemuan warga'
    },
    {
      id: 10,
      name: 'Taman Cilame',
      category: 'rekreasi',
      type: 'Taman Kota',
      address: 'Jalan Taman No. 1',
      phone: '-',
      hours: 'Setiap hari: 06:00-18:00',
      icon: TreePine,
      color: 'bg-green-100 text-green-600',
      description: 'Taman rekreasi keluarga dengan fasilitas bermain anak'
    }
  ];

  const transportationRoutes = [
    {
      type: 'Angkot',
      route: 'Cilame - Ngamprah - Padalarang',
      schedule: 'Setiap 15 menit (06:00-20:00)',
      fare: 'Rp 5.000',
      icon: Bus,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      type: 'Ojek Online',
      route: 'Tersedia di seluruh area desa',
      schedule: '24 Jam',
      fare: 'Sesuai aplikasi',
      icon: Bike,
      color: 'bg-green-100 text-green-600'
    },
    {
      type: 'Bus Antar Kota',
      route: 'Terminal Padalarang - Bandung',
      schedule: 'Setiap 30 menit (05:00-22:00)',
      fare: 'Rp 15.000',
      icon: Car,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const categories = [
    { id: 'semua', label: 'Semua Fasilitas', icon: Globe },
    { id: 'pemerintahan', label: 'Pemerintahan', icon: Building },
    { id: 'pendidikan', label: 'Pendidikan', icon: School },
    { id: 'kesehatan', label: 'Kesehatan', icon: Hospital },
    { id: 'ekonomi', label: 'Ekonomi', icon: Store },
    { id: 'ibadah', label: 'Ibadah', icon: Building },
    { id: 'sosial', label: 'Sosial', icon: Users },
    { id: 'rekreasi', label: 'Rekreasi', icon: TreePine }
  ];

  const filteredFacilities = activeCategory === 'semua' 
    ? facilities 
    : facilities.filter(facility => facility.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Lokasi & Peta Desa Cilame
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8">
              Temukan Fasilitas dan Lokasi Penting di Desa Cilame
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                12.45 km²
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Mountain className="h-4 w-4 mr-2" />
                650-850 mdpl
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                8.247 jiwa
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Village Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Informasi Geografis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-green-600" />
                  Data Geografis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Luas Wilayah</p>
                    <p className="font-semibold text-gray-900">{villageInfo.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ketinggian</p>
                    <p className="font-semibold text-gray-900">{villageInfo.altitude}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jumlah Penduduk</p>
                    <p className="font-semibold text-gray-900">{villageInfo.population}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jumlah KK</p>
                    <p className="font-semibold text-gray-900">{villageInfo.households}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Koordinat</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-mono">
                      Lat: {villageInfo.coordinates.latitude}<br/>
                      Lng: {villageInfo.coordinates.longitude}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Alamat Lengkap</p>
                  <p className="text-sm text-gray-900">{villageInfo.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Boundaries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-green-600" />
                  Batas Wilayah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {boundaries.map((boundary, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{boundary.direction}</span>
                      <span className="text-gray-600">{boundary.area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Peta Interaktif</h2>
          <Card>
            <CardContent className="p-0">
              <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Peta Interaktif Desa Cilame</h3>
                    <p className="text-gray-600 mb-6">Jelajahi lokasi fasilitas dan tempat penting di desa</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Buka di Google Maps
                      </Button>
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                        <Navigation className="h-4 w-4 mr-2" />
                        Petunjuk Arah
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Map Overlay Elements */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Kantor Desa</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Fasilitas Umum</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Area Rekreasi</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facility Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fasilitas Desa</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${facility.color}`}>
                    <facility.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{facility.name}</h3>
                    <Badge variant="outline" className="mb-2 text-xs">
                      {facility.type}
                    </Badge>
                    <p className="text-gray-600 text-sm mb-3">{facility.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>{facility.address}</span>
                      </div>
                      {facility.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{facility.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{facility.hours}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                        <Navigation className="h-3 w-3 mr-1" />
                        Rute
                      </Button>
                      {facility.phone && (
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                          <Phone className="h-3 w-3 mr-1" />
                          Hubungi
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transportation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Transportasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transportationRoutes.map((transport, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${transport.color}`}>
                    <transport.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{transport.type}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-2">
                      <Route className="h-3 w-3" />
                      <span>{transport.route}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{transport.schedule}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg mt-3">
                      <span className="font-medium text-gray-900">Tarif: {transport.fare}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Butuh Bantuan Navigasi?</h2>
          <p className="text-green-100 mb-6">Tim kami siap membantu Anda menemukan lokasi yang dicari</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              <Phone className="h-4 w-4 mr-2" />
              Hubungi Petugas
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              Download Peta PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}