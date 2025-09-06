'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  PieChart, 
  Users, 
  UserCheck, 
  Baby, 
  GraduationCap,
  Briefcase,
  Heart,
  Home,
  TrendingUp,
  Download,
  Calendar,
  MapPin,
  Filter
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatistikData {
  kategori: string;
  jumlah: number;
  persentase: number;
  warna: string;
}

export default function StatistikPendudukPage() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample statistical data
  const totalPenduduk = 34700;
  const pertumbuhanTahunan = 2.3;

  const statistikJenisKelamin: StatistikData[] = [
    { kategori: 'Laki-laki', jumlah: 17350, persentase: 50.0, warna: 'bg-blue-500' },
    { kategori: 'Perempuan', jumlah: 17350, persentase: 50.0, warna: 'bg-pink-500' }
  ];

  const statistikUsia: StatistikData[] = [
    { kategori: '0-14 tahun', jumlah: 6246, persentase: 18.0, warna: 'bg-green-500' },
    { kategori: '15-64 tahun', jumlah: 24143, persentase: 69.6, warna: 'bg-blue-500' },
    { kategori: '65+ tahun', jumlah: 4307, persentase: 12.4, warna: 'bg-orange-500' }
  ];

  const statistikPendidikan: StatistikData[] = [
    { kategori: 'Tidak Sekolah', jumlah: 1770, persentase: 5.1, warna: 'bg-red-500' },
    { kategori: 'SD/Sederajat', jumlah: 10445, persentase: 30.1, warna: 'bg-yellow-500' },
    { kategori: 'SMP/Sederajat', jumlah: 9057, persentase: 26.1, warna: 'bg-green-500' },
    { kategori: 'SMA/Sederajat', jumlah: 8395, persentase: 24.2, warna: 'bg-blue-500' },
    { kategori: 'Diploma/S1+', jumlah: 5066, persentase: 14.6, warna: 'bg-purple-500' }
  ];

  const statistikPekerjaan: StatistikData[] = [
    { kategori: 'Petani', jumlah: 8363, persentase: 24.1, warna: 'bg-green-600' },
    { kategori: 'Buruh', jumlah: 6381, persentase: 18.4, warna: 'bg-orange-600' },
    { kategori: 'Wiraswasta', jumlah: 5032, persentase: 14.5, warna: 'bg-blue-600' },
    { kategori: 'PNS/TNI/Polri', jumlah: 3644, persentase: 10.5, warna: 'bg-indigo-600' },
    { kategori: 'Ibu Rumah Tangga', jumlah: 5552, persentase: 16.0, warna: 'bg-pink-600' },
    { kategori: 'Pelajar/Mahasiswa', jumlah: 3505, persentase: 10.1, warna: 'bg-purple-600' },
    { kategori: 'Lainnya', jumlah: 2256, persentase: 6.5, warna: 'bg-gray-600' }
  ];

  const statistikPerkawinan: StatistikData[] = [
    { kategori: 'Belum Kawin', jumlah: 13717, persentase: 39.5, warna: 'bg-blue-500' },
    { kategori: 'Kawin', jumlah: 17737, persentase: 51.1, warna: 'bg-green-500' },
    { kategori: 'Cerai Hidup', jumlah: 2290, persentase: 6.6, warna: 'bg-yellow-500' },
    { kategori: 'Cerai Mati', jumlah: 972, persentase: 2.8, warna: 'bg-gray-500' }
  ];

  const statistikAgama: StatistikData[] = [
    { kategori: 'Islam', jumlah: 32340, persentase: 93.2, warna: 'bg-green-600' },
    { kategori: 'Kristen', jumlah: 1492, persentase: 4.3, warna: 'bg-blue-600' },
    { kategori: 'Katolik', jumlah: 555, persentase: 1.6, warna: 'bg-purple-600' },
    { kategori: 'Hindu', jumlah: 174, persentase: 0.5, warna: 'bg-orange-600' },
    { kategori: 'Buddha', jumlah: 139, persentase: 0.4, warna: 'bg-yellow-600' }
  ];

  const renderStatistikCard = (title: string, data: StatistikData[], icon: React.ReactNode) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-4 h-4 rounded ${item.warna}`}></div>
                <span className="text-sm font-medium">{item.kategori}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{item.jumlah.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{item.persentase}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Statistik Kependudukan</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Data statistik dan demografi penduduk Desa Cilame yang transparan dan akurat
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Penduduk</p>
                  <p className="text-3xl font-bold text-emerald-600">{totalPenduduk.toLocaleString()}</p>
                </div>
                <Users className="h-12 w-12 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kepala Keluarga</p>
                  <p className="text-3xl font-bold text-blue-600">2,156</p>
                </div>
                <Home className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pertumbuhan/Tahun</p>
                  <p className="text-3xl font-bold text-green-600">+{pertumbuhanTahunan}%</p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kepadatan</p>
                  <p className="text-3xl font-bold text-purple-600">187/km²</p>
                </div>
                <MapPin className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Export */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="2024">Tahun 2024</option>
              <option value="2023">Tahun 2023</option>
              <option value="2022">Tahun 2022</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Semua Kategori</option>
              <option value="gender">Jenis Kelamin</option>
              <option value="age">Kelompok Usia</option>
              <option value="education">Pendidikan</option>
              <option value="occupation">Pekerjaan</option>
            </select>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderStatistikCard(
            'Berdasarkan Jenis Kelamin',
            statistikJenisKelamin,
            <Users className="h-5 w-5" />
          )}
          
          {renderStatistikCard(
            'Berdasarkan Kelompok Usia',
            statistikUsia,
            <Baby className="h-5 w-5" />
          )}
          
          {renderStatistikCard(
            'Berdasarkan Pendidikan',
            statistikPendidikan,
            <GraduationCap className="h-5 w-5" />
          )}
          
          {renderStatistikCard(
            'Berdasarkan Status Perkawinan',
            statistikPerkawinan,
            <Heart className="h-5 w-5" />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderStatistikCard(
            'Berdasarkan Pekerjaan',
            statistikPekerjaan,
            <Briefcase className="h-5 w-5" />
          )}
          
          {renderStatistikCard(
            'Berdasarkan Agama',
            statistikAgama,
            <UserCheck className="h-5 w-5" />
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi Tambahan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Sumber Data</h3>
              <p className="text-gray-600 text-sm">
                Data bersumber dari Sistem Informasi Administrasi Kependudukan (SIAK) 
                yang diperbarui secara berkala setiap bulan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Periode Data</h3>
              <p className="text-gray-600 text-sm">
                Data statistik ini mencakup periode Januari - Desember {selectedYear} 
                dan diperbarui setiap akhir bulan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Metodologi</h3>
              <p className="text-gray-600 text-sm">
                Pengumpulan data dilakukan melalui pendataan langsung, 
                registrasi kelahiran/kematian, dan migrasi penduduk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}