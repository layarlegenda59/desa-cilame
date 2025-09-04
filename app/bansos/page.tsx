'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  Search, 
  Calendar, 
  Users, 
  MapPin,
  Phone,
  FileText,
  Download
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BansosProgram {
  id: string;
  name: string;
  description: string;
  type: 'PKH' | 'BPNT' | 'BST' | 'Bansos Lainnya';
  status: 'active' | 'completed' | 'upcoming';
  beneficiaries: number;
  startDate: string;
  endDate?: string;
  requirements: string[];
  contact: string;
}

export default function BansosPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const bansosPrograms: BansosProgram[] = [
    {
      id: '1',
      name: 'Program Keluarga Harapan (PKH)',
      description: 'Bantuan tunai bersyarat untuk keluarga miskin dengan komponen kesehatan, pendidikan, dan kesejahteraan sosial.',
      type: 'PKH',
      status: 'active',
      beneficiaries: 245,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      requirements: [
        'Memiliki KTP Desa Cilame',
        'Keluarga prasejahtera atau sejahtera I',
        'Memiliki anak usia sekolah atau ibu hamil/menyusui',
        'Terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS)'
      ],
      contact: '0812-3456-7890'
    },
    {
      id: '2',
      name: 'Bantuan Pangan Non Tunai (BPNT)',
      description: 'Bantuan pangan dalam bentuk non tunai untuk memenuhi sebagian kebutuhan pangan keluarga penerima manfaat.',
      type: 'BPNT',
      status: 'active',
      beneficiaries: 180,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      requirements: [
        'Keluarga penerima manfaat PKH',
        'Keluarga miskin non PKH',
        'Memiliki e-Warong atau agen Brilink terdekat',
        'Terdaftar dalam DTKS'
      ],
      contact: '0812-3456-7891'
    },
    {
      id: '3',
      name: 'Bantuan Sosial Tunai (BST)',
      description: 'Bantuan tunai untuk keluarga yang terdampak pandemi COVID-19 dan membutuhkan bantuan sosial.',
      type: 'BST',
      status: 'completed',
      beneficiaries: 320,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      requirements: [
        'Keluarga terdampak COVID-19',
        'Tidak menerima bantuan sosial lainnya',
        'Memiliki KTP Desa Cilame',
        'Pendapatan keluarga menurun akibat pandemi'
      ],
      contact: '0812-3456-7892'
    },
    {
      id: '4',
      name: 'Bantuan Sembako Ramadan',
      description: 'Bantuan paket sembako untuk keluarga kurang mampu dalam menyambut bulan suci Ramadan.',
      type: 'Bansos Lainnya',
      status: 'upcoming',
      beneficiaries: 150,
      startDate: '2024-03-01',
      requirements: [
        'Keluarga kurang mampu',
        'Beragama Islam',
        'Domisili Desa Cilame minimal 1 tahun',
        'Tidak menerima bantuan sembako dari instansi lain'
      ],
      contact: '0812-3456-7893'
    }
  ];

  const filteredPrograms = bansosPrograms.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || program.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Selesai';
      case 'upcoming': return 'Akan Datang';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Informasi Bantuan Sosial</h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Informasi lengkap program bantuan sosial untuk masyarakat Desa Cilame
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari program bantuan sosial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Semua Program</option>
              <option value="PKH">PKH</option>
              <option value="BPNT">BPNT</option>
              <option value="BST">BST</option>
              <option value="Bansos Lainnya">Bansos Lainnya</option>
            </select>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getStatusColor(program.status)}>
                    {getStatusText(program.status)}
                  </Badge>
                  <Badge variant="outline">{program.type}</Badge>
                </div>
                <CardTitle className="text-lg">{program.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {program.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{program.beneficiaries} penerima manfaat</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{program.startDate} {program.endDate && `- ${program.endDate}`}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{program.contact}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">Persyaratan:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {program.requirements.slice(0, 2).map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                    {program.requirements.length > 2 && (
                      <li className="text-red-600 font-medium">+{program.requirements.length - 2} persyaratan lainnya</li>
                    )}
                  </ul>
                </div>

                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Lihat Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi Penting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Cara Mendaftar</h3>
              <ol className="text-gray-600 space-y-2">
                <li>1. Datang ke Kantor Desa Cilame</li>
                <li>2. Bawa dokumen persyaratan yang diperlukan</li>
                <li>3. Isi formulir pendaftaran</li>
                <li>4. Tunggu proses verifikasi dan validasi</li>
                <li>5. Pengumuman hasil seleksi</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Kontak Bantuan</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Kantor Desa Cilame, Jl. Raya Cilame No. 123</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(022) 1234-5678</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Senin - Jumat: 08:00 - 16:00 WIB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}