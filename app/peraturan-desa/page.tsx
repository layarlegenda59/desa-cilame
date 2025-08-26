'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Search, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PeraturanDesa {
  id: string;
  judul: string;
  tahun: number;
  jenis: string;
  kategori: string;
  jumlahUnduhan: number;
  deskripsi?: string;
}

const peraturanDesaData: PeraturanDesa[] = [
  {
    id: '1',
    judul: 'Tentang Pembentukan Kelompok Keluarga Sadar Hukum Desa Karanganyar',
    tahun: 2023,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 51,
    deskripsi: 'Peraturan mengenai pembentukan kelompok keluarga sadar hukum untuk meningkatkan kesadaran hukum masyarakat desa.'
  },
  {
    id: '2',
    judul: 'Tentang Penetapan Daftar Keluarga Penerima Bantuan Langsung Tunai (BLT) Desa Tahun Anggaran 2023',
    tahun: 2023,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 42,
    deskripsi: 'Penetapan daftar penerima bantuan langsung tunai untuk keluarga yang memenuhi kriteria di desa.'
  },
  {
    id: '3',
    judul: 'Tentang Rencana Kerja Pemerintah Desa Gunungmasigit Kecamatan Cipatat Kabupaten Bandung Barat Tahun 2024',
    tahun: 2023,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 34,
    deskripsi: 'Rencana kerja pemerintah desa untuk tahun 2024 yang mencakup program pembangunan dan pelayanan masyarakat.'
  },
  {
    id: '4',
    judul: 'Tentang Perlindungan Anak',
    tahun: 2023,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 69,
    deskripsi: 'Peraturan untuk melindungi hak-hak anak dan mencegah kekerasan terhadap anak di lingkungan desa.'
  },
  {
    id: '5',
    judul: 'Tentang Pemanfaatan Tanah Kas Desa',
    tahun: 2022,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 206,
    deskripsi: 'Pengaturan pemanfaatan tanah kas desa untuk kepentingan pembangunan dan kesejahteraan masyarakat.'
  },
  {
    id: '6',
    judul: 'Tentang Rencana Pembangunan Jangka Menengah Desa (RPJM Desa) Desa Cimanggu Tahun 2022 - 2028',
    tahun: 2022,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 62,
    deskripsi: 'Rencana pembangunan jangka menengah desa untuk periode 2022-2028.'
  },
  {
    id: '7',
    judul: 'Tentang Rencana Pembangunan Jangka Menengah Desa (RPJMDes) Tahun 2021 - 2027',
    tahun: 2022,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 63,
    deskripsi: 'Dokumen perencanaan pembangunan desa untuk periode 2021-2027.'
  },
  {
    id: '8',
    judul: 'Tentang Tatacara Kerja Sama Desa',
    tahun: 2022,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 43,
    deskripsi: 'Pengaturan mengenai tatacara dan mekanisme kerja sama antar desa.'
  },
  {
    id: '9',
    judul: 'Tentang Larangan Buang Air Besar Sembarangan Wujudkan Lingkungan Bersih Dan Sehat',
    tahun: 2022,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 53,
    deskripsi: 'Peraturan untuk menjaga kebersihan lingkungan dan kesehatan masyarakat desa.'
  },
  {
    id: '10',
    judul: 'Tentang Rencana Kerja Pemerintah Desa (RKP Desa) Cimareme Kecamatan Ngamprah Kabupaten Bandung Barat Tahun Anggaran 2023',
    tahun: 2022,
    jenis: 'Peraturan Desa',
    kategori: 'Peraturan',
    jumlahUnduhan: 38,
    deskripsi: 'Rencana kerja pemerintah desa untuk tahun anggaran 2023.'
  }
];

export default function PeraturanDesaPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const filteredPeraturan = peraturanDesaData.filter(peraturan => {
    const matchesSearch = peraturan.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || peraturan.tahun.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  const availableYears = [...new Set(peraturanDesaData.map(p => p.tahun))].sort((a, b) => b - a);

  const content = {
    id: {
      title: 'Peraturan Desa',
      subtitle: 'Kumpulan peraturan desa yang berlaku di wilayah Kabupaten Bandung Barat',
      searchPlaceholder: 'Cari peraturan desa...',
      allYears: 'Semua Tahun',
      downloadCount: 'kali diunduh',
      noResults: 'Tidak ada peraturan yang ditemukan',
      downloadButton: 'Unduh'
    },
    en: {
      title: 'Village Regulations',
      subtitle: 'Collection of village regulations applicable in West Bandung Regency',
      searchPlaceholder: 'Search village regulations...',
      allYears: 'All Years',
      downloadCount: 'downloads',
      noResults: 'No regulations found',
      downloadButton: 'Download'
    }
  };

  const t = content[language as keyof typeof content];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">{t.allYears}</option>
            {availableYears.map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {language === 'id' ? `Menampilkan ${filteredPeraturan.length} peraturan` : `Showing ${filteredPeraturan.length} regulations`}
          </p>
        </div>

        {/* Peraturan List */}
        {filteredPeraturan.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPeraturan.map((peraturan) => (
              <Card key={peraturan.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {peraturan.tahun}
                    </Badge>
                    <Badge variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      {peraturan.kategori}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {peraturan.judul}
                  </CardTitle>
                  {peraturan.deskripsi && (
                    <CardDescription className="text-sm">
                      {peraturan.deskripsi}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Download className="h-4 w-4 mr-1" />
                      {peraturan.jumlahUnduhan}x {t.downloadCount}
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Download className="h-4 w-4 mr-1" />
                      {t.downloadButton}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}