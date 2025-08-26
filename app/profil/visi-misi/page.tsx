'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Target, CheckCircle, Users, Lightbulb, Heart, Zap, Globe } from 'lucide-react';
import Image from 'next/image';

export default function VisiMisiPage() {
  const { t } = useLanguage();

  const missionItems = [
    {
      icon: Users,
      title: 'Pemberdayaan Masyarakat',
      description: 'Meningkatkan kapasitas dan partisipasi aktif masyarakat dalam pembangunan desa melalui program-program pemberdayaan yang berkelanjutan.',
      color: 'bg-blue-500'
    },
    {
      icon: Lightbulb,
      title: 'Inovasi dan Teknologi',
      description: 'Mengembangkan dan menerapkan inovasi teknologi untuk meningkatkan kualitas pelayanan publik dan efisiensi administrasi desa.',
      color: 'bg-purple-500'
    },
    {
      icon: Heart,
      title: 'Kesejahteraan Sosial',
      description: 'Membangun sistem perlindungan sosial yang komprehensif untuk menjamin kesejahteraan seluruh lapisan masyarakat.',
      color: 'bg-red-500'
    },
    {
      icon: Zap,
      title: 'Ekonomi Berkelanjutan',
      description: 'Mengembangkan ekonomi desa yang berkelanjutan melalui UMKM, pertanian modern, dan ekonomi kreatif.',
      color: 'bg-green-500'
    },
    {
      icon: Globe,
      title: 'Lingkungan Hijau',
      description: 'Melestarikan lingkungan hidup dan mengembangkan desa yang ramah lingkungan untuk generasi mendatang.',
      color: 'bg-teal-500'
    },
    {
      icon: CheckCircle,
      title: 'Tata Kelola Baik',
      description: 'Menerapkan prinsip-prinsip good governance dalam penyelenggaraan pemerintahan desa yang transparan dan akuntabel.',
      color: 'bg-orange-500'
    }
  ];

  const strategicGoals = [
    {
      category: 'Ekonomi',
      goals: [
        'Meningkatkan pendapatan per kapita masyarakat sebesar 15% dalam 5 tahun',
        'Mengembangkan 200 UMKM baru yang berkelanjutan',
        'Membangun pasar modern dan sentra ekonomi desa',
        'Mengoptimalkan potensi wisata dan ekonomi kreatif'
      ],
      color: 'border-green-200 bg-green-50'
    },
    {
      category: 'Sosial',
      goals: [
        'Mencapai angka partisipasi pendidikan 100% untuk usia wajib belajar',
        'Menurunkan angka kemiskinan menjadi di bawah 5%',
        'Meningkatkan akses layanan kesehatan berkualitas',
        'Memperkuat kohesi sosial dan toleransi antar warga'
      ],
      color: 'border-blue-200 bg-blue-50'
    },
    {
      category: 'Infrastruktur',
      goals: [
        'Membangun infrastruktur digital yang menyeluruh',
        'Meningkatkan kualitas jalan dan transportasi',
        'Menyediakan akses air bersih dan sanitasi untuk semua',
        'Mengembangkan fasilitas olahraga dan rekreasi'
      ],
      color: 'border-purple-200 bg-purple-50'
    },
    {
      category: 'Lingkungan',
      goals: [
        'Mencapai target zero waste melalui program daur ulang',
        'Meningkatkan tutupan hijau desa sebesar 30%',
        'Mengembangkan energi terbarukan untuk kebutuhan desa',
        'Melindungi dan melestarikan sumber daya air'
      ],
      color: 'border-teal-200 bg-teal-50'
    }
  ];

  const coreValues = [
    {
      value: 'Integritas',
      description: 'Berkomitmen pada kejujuran, transparansi, dan akuntabilitas dalam setiap tindakan',
      icon: '🤝'
    },
    {
      value: 'Inovasi',
      description: 'Selalu mencari cara-cara baru dan kreatif untuk meningkatkan kualitas hidup masyarakat',
      icon: '💡'
    },
    {
      value: 'Inklusivitas',
      description: 'Memastikan partisipasi dan manfaat pembangunan dapat dirasakan oleh seluruh lapisan masyarakat',
      icon: '🤗'
    },
    {
      value: 'Keberlanjutan',
      description: 'Membangun masa depan yang berkelanjutan dengan memperhatikan aspek ekonomi, sosial, dan lingkungan',
      icon: '🌱'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Visi & Misi Desa Cilame
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">
              Membangun Masa Depan Bersama dengan Visi yang Jelas
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                Visi 2025
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                6 Misi Utama
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Vision Section */}
        <div className="mb-12">
          <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                <Eye className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl text-indigo-700">VISI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <blockquote className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-6">
                  "Mewujudkan Desa Cilame sebagai Desa Modern, Mandiri, dan Berkelanjutan 
                  yang Berlandaskan Nilai-nilai Kearifan Lokal pada Tahun 2025"
                </blockquote>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏘️</div>
                    <h3 className="font-semibold text-indigo-700 mb-2">MODERN</h3>
                    <p className="text-sm text-gray-600">Mengadopsi teknologi dan inovasi terkini</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">💪</div>
                    <h3 className="font-semibold text-indigo-700 mb-2">MANDIRI</h3>
                    <p className="text-sm text-gray-600">Kemandirian ekonomi dan sosial masyarakat</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌿</div>
                    <h3 className="font-semibold text-indigo-700 mb-2">BERKELANJUTAN</h3>
                    <p className="text-sm text-gray-600">Pembangunan yang ramah lingkungan</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mx-auto mb-4">
              <Target className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">MISI</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enam misi strategis untuk mewujudkan visi Desa Cilame 2025
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionItems.map((mission, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${mission.color} text-white mb-4`}>
                      <mission.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" className="text-purple-700 border-purple-300 mb-3">
                      Misi {index + 1}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{mission.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{mission.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tujuan Strategis</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Target-target konkret yang akan dicapai dalam periode 2021-2025
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategicGoals.map((category, index) => (
              <Card key={index} className={`border-2 ${category.color} hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.goals.map((goal, goalIndex) => (
                      <li key={goalIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm leading-relaxed">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Inti</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Prinsip-prinsip fundamental yang menjadi landasan dalam setiap langkah pembangunan desa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.value}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Timeline */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardContent className="py-8">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Roadmap Implementasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">2021-2022</div>
                  <h4 className="font-semibold mb-2">Fase Persiapan</h4>
                  <p className="text-indigo-100 text-sm">
                    Penyusunan rencana detail, pembentukan tim, dan sosialisasi program
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">2023-2024</div>
                  <h4 className="font-semibold mb-2">Fase Implementasi</h4>
                  <p className="text-indigo-100 text-sm">
                    Pelaksanaan program-program prioritas dan pembangunan infrastruktur
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">2025</div>
                  <h4 className="font-semibold mb-2">Fase Evaluasi</h4>
                  <p className="text-indigo-100 text-sm">
                    Evaluasi pencapaian target dan penyusunan rencana jangka panjang
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