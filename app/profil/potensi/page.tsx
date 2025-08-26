'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Mountain, Factory, GraduationCap, Camera, Utensils, TreePine, Waves, Users, TrendingUp, MapPin, Star } from 'lucide-react';
import Image from 'next/image';

export default function PotensiDesaPage() {
  const { t } = useLanguage();

  const potensiEkonomi = [
    {
      icon: Leaf,
      title: 'Pertanian Organik',
      description: 'Lahan pertanian seluas 180 hektar dengan produksi padi, sayuran, dan buah-buahan organik berkualitas tinggi',
      value: '180 Ha',
      growth: '+12%',
      color: 'bg-green-500'
    },
    {
      icon: Factory,
      title: 'UMKM Kreatif',
      description: 'Lebih dari 127 unit UMKM yang bergerak di bidang kerajinan, kuliner, dan produk digital',
      value: '127 Unit',
      growth: '+25%',
      color: 'bg-blue-500'
    },
    {
      icon: Camera,
      title: 'Wisata Alam',
      description: 'Destinasi wisata alam dengan pemandangan pegunungan dan air terjun yang menarik ribuan pengunjung',
      value: '15.000',
      growth: '+30%',
      color: 'bg-purple-500'
    },
    {
      icon: Utensils,
      title: 'Kuliner Lokal',
      description: 'Beragam kuliner khas Sunda dan produk olahan makanan yang menjadi daya tarik wisata kuliner',
      value: '45 Produk',
      growth: '+18%',
      color: 'bg-orange-500'
    }
  ];

  const potensiWisata = [
    {
      name: 'Curug Cilame',
      type: 'Wisata Alam',
      description: 'Air terjun setinggi 25 meter dengan kolam alami yang jernih, dikelilingi hutan bambu yang asri',
      facilities: ['Area parkir', 'Warung makan', 'Toilet', 'Gazebo'],
      visitors: '8.000/tahun',
      image: '/mountin.jpg'
    },
    {
      name: 'Puncak Cilame',
      type: 'Wisata Pegunungan',
      description: 'Spot terbaik untuk menikmati sunrise dan sunset dengan pemandangan 360 derajat kota Bandung',
      facilities: ['Camping ground', 'View deck', 'Warung kopi', 'Toilet'],
      visitors: '12.000/tahun',
      image: '/mountin.jpg'
    },
    {
      name: 'Desa Wisata Cilame',
      type: 'Wisata Budaya',
      description: 'Paket wisata edukasi pertanian organik dan pengalaman hidup di desa dengan homestay',
      facilities: ['Homestay', 'Sawah edukasi', 'Workshop', 'Kuliner lokal'],
      visitors: '5.000/tahun',
      image: '/mountin.jpg'
    }
  ];

  const sumberDayaAlam = [
    {
      resource: 'Air Bersih',
      description: 'Sumber mata air alami yang melimpah dengan kualitas air yang sangat baik',
      potential: 'Tinggi',
      utilization: '75%',
      icon: Waves
    },
    {
      resource: 'Hutan Bambu',
      description: 'Hutan bambu seluas 45 hektar yang dapat dikembangkan untuk industri kerajinan',
      potential: 'Tinggi',
      utilization: '40%',
      icon: TreePine
    },
    {
      resource: 'Tanah Subur',
      description: 'Tanah vulkanis yang sangat subur cocok untuk berbagai jenis tanaman pertanian',
      potential: 'Sangat Tinggi',
      utilization: '85%',
      icon: Mountain
    },
    {
      resource: 'Udara Sejuk',
      description: 'Iklim sejuk dengan suhu rata-rata 20-25°C yang ideal untuk wisata dan pertanian',
      potential: 'Tinggi',
      utilization: '60%',
      icon: Leaf
    }
  ];

  const sumberDayaManusia = [
    {
      category: 'Pendidikan',
      description: 'Tingkat pendidikan masyarakat yang tinggi dengan 89% lulusan SMA ke atas',
      stats: [
        { label: 'Lulusan S1/S2', value: '35%' },
        { label: 'Lulusan SMA/SMK', value: '54%' },
        { label: 'Lulusan SMP', value: '11%' }
      ]
    },
    {
      category: 'Keterampilan',
      description: 'Beragam keterampilan tradisional dan modern yang dimiliki masyarakat',
      stats: [
        { label: 'Kerajinan Bambu', value: '120 orang' },
        { label: 'Pertanian Organik', value: '200 orang' },
        { label: 'Digital Marketing', value: '85 orang' }
      ]
    },
    {
      category: 'Entrepreneurship',
      description: 'Semangat kewirausahaan yang tinggi dengan banyak pelaku UMKM muda',
      stats: [
        { label: 'Pengusaha Muda', value: '65%' },
        { label: 'UMKM Digital', value: '40%' },
        { label: 'Ekspor Produk', value: '15%' }
      ]
    }
  ];

  const programPengembangan = [
    {
      title: 'Cilame Agro Tourism',
      description: 'Pengembangan wisata pertanian terpadu dengan teknologi modern dan edukasi',
      timeline: '2024-2026',
      investment: 'Rp 2.5 Miliar',
      impact: 'Peningkatan pendapatan 40%'
    },
    {
      title: 'Digital Village Hub',
      description: 'Pusat inovasi digital untuk UMKM dan startup lokal dengan fasilitas co-working',
      timeline: '2024-2025',
      investment: 'Rp 1.8 Miliar',
      impact: '200 UMKM digital baru'
    },
    {
      title: 'Eco-Tourism Development',
      description: 'Pengembangan wisata ramah lingkungan dengan konsep sustainable tourism',
      timeline: '2025-2027',
      investment: 'Rp 3.2 Miliar',
      impact: '50.000 wisatawan/tahun'
    },
    {
      title: 'Organic Farming Center',
      description: 'Pusat pelatihan dan sertifikasi pertanian organik untuk petani se-Jawa Barat',
      timeline: '2024-2026',
      investment: 'Rp 2.0 Miliar',
      impact: '500 petani tersertifikasi'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Potensi Desa Cilame
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-8">
              Kekayaan Alam dan Sumber Daya yang Melimpah
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Leaf className="h-4 w-4 mr-2" />
                Pertanian Organik
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Camera className="h-4 w-4 mr-2" />
                Wisata Alam
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Factory className="h-4 w-4 mr-2" />
                UMKM Kreatif
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Potensi Ekonomi */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Potensi Ekonomi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai sektor ekonomi yang menjadi kekuatan utama pembangunan Desa Cilame
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {potensiEkonomi.map((potensi, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${potensi.color} text-white mb-4`}>
                    <potensi.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{potensi.title}</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                      {potensi.value}
                    </Badge>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {potensi.growth}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{potensi.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Potensi Wisata */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Potensi Wisata</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Destinasi wisata unggulan yang menawarkan keindahan alam dan pengalaman budaya
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {potensiWisata.map((wisata, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={wisata.image}
                    alt={wisata.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-2">
                      {wisata.type}
                    </Badge>
                    <h3 className="text-lg font-semibold">{wisata.name}</h3>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-emerald-500 text-white border-emerald-400">
                      <Users className="h-3 w-3 mr-1" />
                      {wisata.visitors}
                    </Badge>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{wisata.description}</p>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 mb-2">Fasilitas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {wisata.facilities.map((facility, facilityIndex) => (
                        <Badge key={facilityIndex} variant="outline" className="text-xs text-emerald-700 border-emerald-300">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sumber Daya Alam */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sumber Daya Alam</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kekayaan alam yang melimpah dan berpotensi untuk dikembangkan lebih lanjut
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sumberDayaAlam.map((sda, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <sda.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{sda.resource}</h3>
                        <Badge variant="outline" className={`text-xs ${
                          sda.potential === 'Sangat Tinggi' ? 'text-green-700 border-green-300' :
                          sda.potential === 'Tinggi' ? 'text-emerald-700 border-emerald-300' :
                          'text-yellow-700 border-yellow-300'
                        }`}>
                          {sda.potential}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{sda.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Pemanfaatan:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: sda.utilization }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{sda.utilization}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sumber Daya Manusia */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sumber Daya Manusia</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kualitas dan kapasitas masyarakat yang menjadi modal utama pembangunan desa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sumberDayaManusia.map((sdm, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                    {sdm.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{sdm.description}</p>
                  <div className="space-y-3">
                    {sdm.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{stat.label}</span>
                        <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                          {stat.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Program Pengembangan */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Pengembangan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Rencana strategis untuk mengoptimalkan potensi desa dalam jangka menengah
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programPengembangan.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">{program.title}</CardTitle>
                      <Badge variant="outline" className="text-emerald-700 border-emerald-300 mt-2">
                        {program.timeline}
                      </Badge>
                    </div>
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{program.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Investasi:</span>
                      <span className="text-sm text-gray-600">{program.investment}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Target Dampak:</span>
                      <span className="text-sm text-gray-600">{program.impact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardContent className="py-8">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Bergabunglah dalam Pengembangan Potensi Desa</h3>
              <p className="text-emerald-100 leading-relaxed mb-6">
                Desa Cilame terbuka untuk kerjasama dan investasi dalam mengembangkan berbagai potensi yang ada. 
                Mari bersama-sama membangun desa yang maju, mandiri, dan berkelanjutan untuk kesejahteraan 
                masyarakat dan generasi mendatang.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">180+</div>
                  <div className="text-emerald-100 text-sm">Hektar Lahan Produktif</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">127+</div>
                  <div className="text-emerald-100 text-sm">UMKM Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">25.000+</div>
                  <div className="text-emerald-100 text-sm">Wisatawan per Tahun</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}