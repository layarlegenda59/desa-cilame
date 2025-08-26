'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Users, Building, Phone, Mail, MapPin, Award, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function StrukturOrganisasiPage() {
  const { t } = useLanguage();

  const kepalaDesaInfo = {
    name: 'AAS MOHAMAD ASOR, S.H., M.H., NL.P.',
    position: 'Kepala Desa Cilame',
    period: '2020 - 2026',
    education: 'S1 Hukum, S2 Hukum',
    experience: '15 tahun di bidang pemerintahan',
    vision: 'Memimpin Desa Cilame menuju desa modern dan mandiri'
  };

  const perangkatDesa = [
    {
      name: 'DENI AHMAD BERLIAN',
      position: 'Sekretaris Desa',
      department: 'Sekretariat',
      responsibilities: ['Administrasi umum', 'Koordinasi program', 'Dokumentasi kegiatan'],
      contact: 'sekdes@desacilame.com'
    },
    {
      name: 'KOKO KOSWARA',
      position: 'Kepala Urusan Umum & Tata Usaha',
      department: 'Umum & Tata Usaha',
      responsibilities: ['Pelayanan masyarakat', 'Administrasi surat', 'Kearsipan', 'Tata usaha'],
      contact: 'umum@desacilame.com'
    },
    {
      name: 'DEDEH MARYATI',
      position: 'Kepala Urusan Keuangan',
      department: 'Keuangan',
      responsibilities: ['Pengelolaan keuangan desa', 'Pelaporan keuangan', 'Administrasi pajak'],
      contact: 'keuangan@desacilame.com'
    },
    {
      name: 'INDRA LESMANA',
      position: 'Kepala Urusan Perencanaan',
      department: 'Perencanaan',
      responsibilities: ['Penyusunan RPJM Desa', 'Monitoring program', 'Evaluasi pembangunan'],
      contact: 'perencanaan@desacilame.com'
    },
    {
      name: 'TRI SOPYAN',
      position: 'Kepala Seksi Pemerintahan',
      department: 'Pemerintahan',
      responsibilities: ['Administrasi pemerintahan', 'Pelayanan publik', 'Koordinasi wilayah'],
      contact: 'pemerintahan@desacilame.com'
    },
    {
      name: 'RIKA KARTIKA, S.Pd',
      position: 'Kepala Seksi Pelayanan',
      department: 'Pelayanan',
      responsibilities: ['Pelayanan masyarakat', 'Administrasi kependudukan', 'Perizinan'],
      contact: 'pelayanan@desacilame.com'
    },
    {
      name: 'USEP SUDARYA',
      position: 'Kepala Seksi Kesejahteraan',
      department: 'Kesejahteraan',
      responsibilities: ['Program kesejahteraan', 'Pemberdayaan masyarakat', 'Bantuan sosial'],
      contact: 'kesejahteraan@desacilame.com'
    }
  ];

  const kepalaDusun = [
    {
      name: 'RAMDANI',
      position: 'Kepala Dusun I',
      area: 'Dusun Cilame I',
      population: '2.156 jiwa',
      households: '564 KK',
      contact: 'dusun1@desacilame.com'
    },
    {
      name: 'RAHMAN BAIDILLAH',
      position: 'Kepala Dusun II',
      area: 'Dusun Cilame II',
      population: '1.987 jiwa',
      households: '521 KK',
      contact: 'dusun2@desacilame.com'
    },
    {
      name: 'MOMO SAHRONI',
      position: 'Kepala Dusun III',
      area: 'Dusun Cilame III',
      population: '2.234 jiwa',
      households: '587 KK',
      contact: 'dusun3@desacilame.com'
    },
    {
      name: 'ENGKUS KUSWARA',
      position: 'Kepala Dusun IV',
      area: 'Dusun Cilame IV',
      population: '1.870 jiwa',
      households: '484 KK',
      contact: 'dusun4@desacilame.com'
    },
    {
      name: 'CECEP ANANG K',
      position: 'Kepala Dusun V',
      area: 'Dusun Cilame V',
      population: '1.654 jiwa',
      households: '432 KK',
      contact: 'dusun5@desacilame.com'
    }
  ];

  const lembagaDesa = [
    {
      name: 'BPD (Badan Permusyawaratan Desa)',
      chairman: 'Bapak H. Yusuf Hidayat',
      members: 9,
      function: 'Fungsi legislatif dan pengawasan',
      responsibilities: [
        'Membahas dan menyepakati Rancangan Peraturan Desa',
        'Menampung dan menyalurkan aspirasi masyarakat',
        'Melakukan pengawasan kinerja Kepala Desa'
      ]
    },
    {
      name: 'LPMD (Lembaga Pemberdayaan Masyarakat Desa)',
      chairman: 'Ibu Dr. Hj. Neneng Suryani',
      members: 7,
      function: 'Pemberdayaan masyarakat',
      responsibilities: [
        'Penyusunan rencana pembangunan partisipatif',
        'Pelaksanaan pemberdayaan masyarakat',
        'Pengembangan kapasitas masyarakat'
      ]
    },
    {
      name: 'PKK (Pemberdayaan Kesejahteraan Keluarga)',
      chairman: 'Ibu Hj. Siti Fatimah',
      members: 15,
      function: 'Pemberdayaan perempuan dan keluarga',
      responsibilities: [
        'Program kesehatan ibu dan anak',
        'Pendidikan dan keterampilan perempuan',
        'Ekonomi keluarga dan UMKM'
      ]
    },
    {
      name: 'Karang Taruna',
      chairman: 'Sdr. Rizki Ramadhan',
      members: 25,
      function: 'Pemberdayaan pemuda',
      responsibilities: [
        'Pengembangan kreativitas pemuda',
        'Kegiatan sosial dan lingkungan',
        'Olahraga dan seni budaya'
      ]
    }
  ];

  const tugasPokok = [
    {
      category: 'Kepala Desa',
      tasks: [
        'Menyelenggarakan pemerintahan desa',
        'Melaksanakan pembangunan desa',
        'Pembinaan kemasyarakatan',
        'Pemberdayaan masyarakat desa'
      ]
    },
    {
      category: 'Sekretaris Desa',
      tasks: [
        'Membantu Kepala Desa dalam bidang administrasi pemerintahan',
        'Melaksanakan urusan ketatausahaan',
        'Menyiapkan bahan rapat dan keputusan',
        'Melaksanakan tugas lain yang diberikan Kepala Desa'
      ]
    },
    {
      category: 'Kepala Urusan',
      tasks: [
        'Membantu Sekretaris Desa dalam urusan pelayanan administrasi',
        'Melaksanakan kegiatan sesuai bidang tugasnya',
        'Menyiapkan bahan perumusan kebijakan',
        'Melakukan monitoring dan evaluasi'
      ]
    },
    {
      category: 'Kepala Dusun',
      tasks: [
        'Membantu Kepala Desa dalam wilayah kerjanya',
        'Pembinaan ketentraman dan ketertiban',
        'Pelaksanaan kegiatan pemerintahan',
        'Mobilisasi swadaya gotong royong'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Struktur Organisasi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Pemerintahan Desa Cilame
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Building className="h-4 w-4 mr-2" />
                Periode 2020-2026
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                12 Perangkat Desa
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Kepala Desa Section */}
        <div className="mb-12">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <User className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Kepala Desa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{kepalaDesaInfo.name}</h3>
                  <Badge variant="outline" className="text-blue-700 border-blue-300 mb-4">
                    {kepalaDesaInfo.position}
                  </Badge>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Periode: {kepalaDesaInfo.period}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Pendidikan: {kepalaDesaInfo.education}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Pengalaman: {kepalaDesaInfo.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="relative h-64">
                  <Image
                    src="/Kantor Desa Cilame.jpeg"
                    alt="Kantor Desa Cilame"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white p-2 rounded">
                    <p className="text-sm font-medium">{kepalaDesaInfo.vision}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bagan Struktur Organisasi */}
        <div className="mb-12">
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Bagan Struktur Organisasi Pemerintah Desa Cilame
              </CardTitle>
              <p className="text-gray-600">
                Struktur organisasi lengkap pemerintahan Desa Cilame beserta hierarki dan hubungan kerja
              </p>
            </CardHeader>
            <CardContent className="py-6">
              <div className="flex justify-center">
                <div className="w-full max-w-6xl">
                  <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Dokumen Struktur Organisasi
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Untuk melihat bagan struktur organisasi lengkap, silakan unduh dokumen PDF di bawah ini:
                      </p>
                      <a 
                        href="/Struktur Organisasi.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Unduh & Lihat Struktur Organisasi (PDF)
                      </a>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>Format: PDF | Ukuran: ~500KB | Resolusi Tinggi</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Struktur Hierarki Organisasi */}
                  <div className="mt-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-600" />
                        Struktur Hierarki Organisasi
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                        <div className="space-y-1 text-gray-800">
                          <div className="font-semibold text-blue-800">Kepala Desa Cilame</div>
                          <div className="font-medium">AAS MOHAMAD ASOR, S.H., M.H., NL.P.</div>
                          <div className="mt-2">└── Sekretaris Desa</div>
                          <div className="ml-4">DENI AHMAD BERLIAN</div>
                          <div className="ml-4 mt-2">├── Kepala Urusan Umum & Tata Usaha</div>
                          <div className="ml-8">KOKO KOSWARA</div>
                          <div className="ml-4">├── Kepala Urusan Keuangan</div>
                          <div className="ml-8">DEDEH MARYATI</div>
                          <div className="ml-4">├── Kepala Urusan Perencanaan</div>
                          <div className="ml-8">INDRA LESMANA</div>
                          <div className="ml-4">├── Kepala Seksi Pemerintahan</div>
                          <div className="ml-8">TRI SOPYAN</div>
                          <div className="ml-4">├── Kepala Seksi Pelayanan</div>
                          <div className="ml-8">RIKA KARTIKA, S.Pd</div>
                          <div className="ml-4">└── Kepala Seksi Kesejahteraan</div>
                          <div className="ml-8">USEP SUDARYA</div>
                          
                          <div className="mt-4 font-semibold text-green-800">Kepala Dusun (Kadus):</div>
                          <div className="mt-1">Kadus I : RAMDANI</div>
                          <div>Kadus II : RAHMAN BAIDILLAH</div>
                          <div>Kadus III : MOMO SAHRONI</div>
                          <div>Kadus IV : ENGKUS KUSWARA</div>
                          <div>Kadus V : CECEP ANANG K</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Tambahan */}
                  <div className="mt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800 mb-1">Informasi Dokumen</h4>
                          <p className="text-sm text-blue-700">
                            Dokumen struktur organisasi berisi bagan lengkap hierarki pemerintahan desa, 
                            pembagian tugas, dan alur koordinasi antar unit kerja. Klik tombol di atas untuk 
                            mengunduh dan melihat dokumen dalam format PDF.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Perangkat Desa */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perangkat Desa</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tim profesional yang mendukung pelaksanaan pemerintahan dan pelayanan masyarakat
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {perangkatDesa.map((perangkat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{perangkat.name}</h3>
                      <Badge variant="outline" className="text-blue-700 border-blue-300 mb-3">
                        {perangkat.position}
                      </Badge>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{perangkat.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{perangkat.contact}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Tanggung Jawab:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {perangkat.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Kepala Dusun */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kepala Dusun</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pemimpin di tingkat dusun yang mengkoordinasikan kegiatan di wilayah masing-masing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kepalaDusun.map((kadus, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{kadus.name}</h3>
                      <Badge variant="outline" className="text-indigo-700 border-indigo-300 mb-3">
                        {kadus.position}
                      </Badge>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{kadus.area}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{kadus.population}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{kadus.households}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{kadus.contact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lembaga Desa */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lembaga Desa</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Organisasi kemasyarakatan yang mendukung pembangunan dan pemberdayaan masyarakat
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lembagaDesa.map((lembaga, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    {lembaga.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Ketua: </span>
                      <span className="text-sm text-gray-600">{lembaga.chairman}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Anggota: </span>
                      <span className="text-sm text-gray-600">{lembaga.members} orang</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Fungsi: </span>
                      <span className="text-sm text-gray-600">{lembaga.function}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Tugas Pokok:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {lembaga.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tugas Pokok dan Fungsi */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tugas Pokok dan Fungsi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Uraian tugas dan tanggung jawab masing-masing jabatan dalam struktur pemerintahan desa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tugasPokok.map((category, index) => (
              <Card key={index} className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Informasi Kontak Pemerintah Desa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div>
                  <h4 className="font-semibold mb-2">Alamat Kantor</h4>
                  <p className="text-blue-100 text-sm">
                    Jalan Galudra No. 37<br />
                    Desa Cilame, Kecamatan Ngamprah - 40552
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Kontak</h4>
                  <p className="text-blue-100 text-sm">
                    Email: info@desacilame.com<br />
                    Website: www.desacilame.com
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Jam Pelayanan</h4>
                  <p className="text-blue-100 text-sm">
                    Senin - Kamis: 08.00 - 16.00<br />
                    Jumat: 08.00 - 11.30<br />
                    Sabtu - Minggu: Tutup
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