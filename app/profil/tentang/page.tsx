'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Home, Briefcase, GraduationCap, Heart } from 'lucide-react';
import Image from 'next/image';

export default function TentangDesaPage() {
  const { t } = useLanguage();

  const villageStats = [
    {
      icon: Users,
      label: 'Total Penduduk',
      value: '34.700',
      unit: 'Jiwa',
      color: 'bg-blue-500'
    },
    {
      icon: Home,
      label: 'Kepala Keluarga',
      value: '2.156',
      unit: 'KK',
      color: 'bg-green-500'
    },
    {
      icon: Briefcase,
      label: 'UMKM Aktif',
      value: '127',
      unit: 'Usaha',
      color: 'bg-purple-500'
    },
    {
      icon: GraduationCap,
      label: 'Tingkat Pendidikan',
      value: '89%',
      unit: 'Lulusan SMA+',
      color: 'bg-orange-500'
    }
  ];

  const villageFeatures = [
    {
      title: 'Lokasi Strategis',
      description: 'Terletak di jalur utama Bandung-Cimahi dengan akses transportasi yang mudah',
      icon: MapPin
    },
    {
      title: 'Masyarakat Harmonis',
      description: 'Kehidupan masyarakat yang rukun dengan toleransi tinggi antar warga',
      icon: Heart
    },
    {
      title: 'Ekonomi Berkembang',
      description: 'Pertumbuhan UMKM dan ekonomi kreatif yang pesat di berbagai sektor',
      icon: Briefcase
    },
    {
      title: 'Pendidikan Berkualitas',
      description: 'Fasilitas pendidikan lengkap dari TK hingga SMA dengan kualitas terbaik',
      icon: GraduationCap
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tentang Desa Cilame
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-8">
              Desa Modern dengan Nilai Tradisional yang Kuat
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                Kabupaten Bandung Barat
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                Kecamatan Ngamprah
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Village Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {villageStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.color} text-white mb-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.unit}</div>
                <div className="text-sm font-medium text-gray-700 mt-2">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* About Description */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-teal-700">Profil Desa Cilame</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Gambaran Umum</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Desa Cilame adalah salah satu desa di Kecamatan Ngamprah, Kabupaten Bandung Barat, 
                    Provinsi Jawa Barat. Desa ini terletak di lokasi yang strategis dengan akses yang mudah 
                    ke berbagai pusat kota seperti Bandung dan Cimahi. Dengan luas wilayah sekitar 4,2 km², 
                    Desa Cilame memiliki topografi yang beragam mulai dari dataran hingga perbukitan.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Kondisi Geografis</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Desa Cilame berada pada ketinggian 700-900 meter di atas permukaan laut dengan iklim 
                    tropis yang sejuk. Wilayah ini dilalui oleh beberapa sungai kecil yang menjadi sumber 
                    air bersih bagi masyarakat. Tanah yang subur menjadikan desa ini cocok untuk berbagai 
                    jenis tanaman pertanian dan perkebunan.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Kehidupan Masyarakat</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Masyarakat Desa Cilame dikenal dengan keramahan dan gotong royong yang tinggi. 
                    Mayoritas penduduk bekerja di sektor pertanian, perdagangan, dan jasa. Dalam beberapa 
                    tahun terakhir, banyak warga yang mengembangkan usaha mikro, kecil, dan menengah (UMKM) 
                    yang berkontribusi pada perekonomian desa.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Village Image */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-0">
                <div className="relative h-64 lg:h-full min-h-[400px]">
                  <Image
                    src="/mountin.jpg"
                    alt="Pemandangan Desa Cilame"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">Pemandangan Desa Cilame</h3>
                    <p className="text-sm text-gray-200">Keindahan alam yang memukau</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Village Features */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Keunggulan Desa Cilame</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai keunggulan yang menjadikan Desa Cilame sebagai desa yang berkembang dan nyaman untuk ditinggali
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {villageFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Informasi Kontak</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div>
                  <h4 className="font-semibold mb-2">Alamat Kantor Desa</h4>
                  <p className="text-teal-100 text-sm">
                    Jalan Galudra No. 37<br />
                    Desa Cilame, Kecamatan Ngamprah - 40552
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-teal-100 text-sm">info@desacilame.com</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Jam Pelayanan</h4>
                  <p className="text-teal-100 text-sm">
                    Senin - Kamis: 08.00 - 16.00<br />
                    Jumat: 08.00 - 11.30
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}