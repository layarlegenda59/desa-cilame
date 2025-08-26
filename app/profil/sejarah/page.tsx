'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Building, Landmark, TreePine, Award } from 'lucide-react';
import Image from 'next/image';

export default function SejarahDesaPage() {
  const { t } = useLanguage();

  const timelineEvents = [
    {
      year: 'Sebelum 1897',
      title: 'Kepemimpinan Aju Gantang',
      description: 'Masa kepemimpinan kepala desa pertama Aju Gantang yang memimpin hingga tahun 1897.',
      icon: TreePine,
      color: 'bg-green-500'
    },
    {
      year: '1897-1900',
      title: 'Era Djenggot',
      description: 'Masa kepemimpinan Djenggot sebagai kepala desa kedua dalam periode transisi.',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      year: '1905',
      title: 'Ekspansi Wilayah',
      description: 'Desa Cijamil Leutik bergabung ke dalam wilayah Desa Cilame, memperluas wilayah administratif desa.',
      icon: Building,
      color: 'bg-purple-500'
    },
    {
      year: '1920-1945',
      title: 'Era Kolonial',
      description: 'Periode kepemimpinan H. Syarief (1920-1930) dan Udung (1930-1945) selama masa penjajahan Belanda.',
      icon: Landmark,
      color: 'bg-red-500'
    },
    {
      year: '1945-1965',
      title: 'Era Kemerdekaan',
      description: 'Masa kemerdekaan dengan kepemimpinan Diding (1945-1948) dan Imar Natamihardja (1948-1965).',
      icon: Landmark,
      color: 'bg-orange-500'
    },
    {
      year: '2006-2027',
      title: 'Era Modern',
      description: 'Kepemimpinan Aas Mohamad Asor, SH dalam mengembangkan desa menuju modernisasi dan digitalisasi.',
      icon: Award,
      color: 'bg-teal-500'
    }
  ];

  const historicalFigures = [
    {
      name: 'Bapak Sukarman',
      role: 'Kepala Desa Pertama (1965-1975)',
      contribution: 'Pelopor pembentukan struktur pemerintahan desa dan pembangunan infrastruktur dasar'
    },
    {
      name: 'Bapak Darmawan',
      role: 'Kepala Desa (1975-1990)',
      contribution: 'Mengembangkan sektor pertanian dan membangun fasilitas pendidikan'
    },
    {
      name: 'Bapak Rahmat Hidayat',
      role: 'Kepala Desa (1990-2005)',
      contribution: 'Modernisasi administrasi desa dan pengembangan ekonomi masyarakat'
    },
    {
      name: 'Bapak Ahmad Solichin',
      role: 'Kepala Desa (2005-2020)',
      contribution: 'Digitalisasi pelayanan dan pengembangan UMKM berbasis teknologi'
    }
  ];

  const culturalHeritage = [
    {
      name: 'Tradisi Seren Taun',
      description: 'Upacara adat syukuran panen yang dilaksanakan setiap tahun sebagai wujud rasa syukur kepada Tuhan Yang Maha Esa',
      period: 'Sejak 1920'
    },
    {
      name: 'Kesenian Angklung',
      description: 'Seni musik tradisional Sunda yang dilestarikan dan dikembangkan oleh generasi muda desa',
      period: 'Sejak 1950'
    },
    {
      name: 'Gotong Royong',
      description: 'Tradisi kerja sama masyarakat dalam berbagai kegiatan pembangunan dan sosial kemasyarakatan',
      period: 'Sejak awal berdiri'
    },
    {
      name: 'Festival Budaya Tahunan',
      description: 'Perayaan budaya yang menampilkan berbagai kesenian dan kuliner khas daerah',
      period: 'Sejak 2010'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sejarah Desa Cilame
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 mb-8">
              Perjalanan Panjang Menuju Desa Modern
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                Berdiri sejak 1920
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                100+ Tahun Sejarah
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-amber-700 text-center">Asal Usul Nama Cilame</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Penamaan Desa Cilame berasal dari nama sebuah pohon yang tumbuh dan berdiri di sekitar sumber mata air 
                    yang berlokasi di Kampung Cibatu (dahulu dikenal sebagai Kampung Kebon Kalapa). 
                    Pohon tersebut adalah pohon LAME yang tumbuh di lahan tanah milik H. Muhidin.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Nama "Cilame" terdiri dari dua kata dalam bahasa Sunda: "Ci" yang berarti air atau sungai, 
                    dan "Lame" yang merujuk pada nama pohon yang tumbuh di sekitar mata air tersebut. 
                    Pohon Lame ini menjadi penanda geografis yang penting bagi masyarakat, sehingga wilayah 
                    di sekitarnya kemudian dikenal dengan nama Cilame yang bertahan hingga saat ini.
                  </p>
                </div>
                <div className="relative h-64">
                  <Image
                    src="/mountin.jpg"
                    alt="Sungai Cilame tempo dulu"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">Sungai yang menjadi asal nama Cilame</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perjalanan Sejarah</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kronologi perkembangan Desa Cilame dari masa ke masa
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-amber-200 to-orange-200 h-full hidden md:block"></div>
            
            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${event.color} text-white`}>
                            <event.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <Badge variant="outline" className="text-amber-700 border-amber-300">
                              {event.year}
                            </Badge>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden md:block relative z-10">
                    <div className={`w-4 h-4 rounded-full ${event.color} border-4 border-white shadow-lg`}></div>
                  </div>
                  
                  <div className="w-full md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historical Figures */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tokoh Bersejarah</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Para pemimpin yang telah berkontribusi dalam pembangunan Desa Cilame
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Aju Gantang</h3>
                    <Badge variant="outline" className="text-amber-700 border-amber-300 mb-3">
                      Kepala Desa Pertama (- 1897)
                    </Badge>
                    <p className="text-gray-600 text-sm leading-relaxed">Kepala desa pertama Cilame yang memimpin pembentukan awal struktur pemerintahan desa dan meletakkan dasar-dasar kehidupan bermasyarakat.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Abu Bakar</h3>
                    <Badge variant="outline" className="text-amber-700 border-amber-300 mb-3">
                      Kepala Desa (1905-1920)
                    </Badge>
                    <p className="text-gray-600 text-sm leading-relaxed">Kepala desa yang memimpin konsolidasi wilayah setelah bergabungnya Desa Cijamil Leutik dan mengembangkan sistem administrasi yang lebih baik.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">H. Syarief</h3>
                    <Badge variant="outline" className="text-amber-700 border-amber-300 mb-3">
                      Kepala Desa (1920-1930)
                    </Badge>
                    <p className="text-gray-600 text-sm leading-relaxed">Tokoh agama yang memimpin desa pada masa awal periode kolonial dan berperan dalam pengembangan kehidupan beragama masyarakat.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Aas Mohamad Asor, SH</h3>
                    <Badge variant="outline" className="text-amber-700 border-amber-300 mb-3">
                      Kepala Desa (2006-2027)
                    </Badge>
                    <p className="text-gray-600 text-sm leading-relaxed">Kepala desa era modern yang memimpin transformasi desa menuju digitalisasi dan pengembangan potensi wisata serta ekonomi kreatif.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cultural Heritage */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Warisan Budaya</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tradisi dan budaya yang masih dilestarikan hingga saat ini
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {culturalHeritage.map((heritage, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
                      <Landmark className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{heritage.name}</h3>
                    <Badge variant="outline" className="text-amber-700 border-amber-300 mb-3">
                      {heritage.period}
                    </Badge>
                    <p className="text-gray-600 text-sm leading-relaxed">{heritage.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <CardContent className="py-8">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Melangkah ke Masa Depan</h3>
              <p className="text-amber-100 leading-relaxed">
                Dengan sejarah panjang lebih dari 100 tahun, Desa Cilame terus berkomitmen untuk mempertahankan 
                nilai-nilai luhur budaya sambil terus berinovasi mengikuti perkembangan zaman. Warisan sejarah 
                dan budaya yang kaya menjadi fondasi kuat untuk membangun masa depan yang lebih cerah bagi 
                seluruh masyarakat Desa Cilame.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}