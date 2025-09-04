'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserPlus, 
  Search, 
  Users, 
  FileText, 
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PendudukData {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pendidikan: string;
  pekerjaan: string;
  statusPerkawinan: string;
  alamat: string;
  rt: string;
  rw: string;
  noTelepon?: string;
  email?: string;
  statusKependudukan: 'Tetap' | 'Sementara' | 'Pendatang';
  createdAt: string;
}

export default function PendudukPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Sample data - in real app this would come from API
  const pendudukData: PendudukData[] = [
    {
      id: '1',
      nik: '3217012345678901',
      nama: 'Ahmad Suryadi',
      jenisKelamin: 'L',
      tempatLahir: 'Bandung',
      tanggalLahir: '1985-05-15',
      agama: 'Islam',
      pendidikan: 'SMA',
      pekerjaan: 'Petani',
      statusPerkawinan: 'Kawin',
      alamat: 'Jl. Merdeka No. 123',
      rt: '001',
      rw: '001',
      noTelepon: '0812-3456-7890',
      email: 'ahmad.suryadi@email.com',
      statusKependudukan: 'Tetap',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      nik: '3217012345678902',
      nama: 'Siti Nurhaliza',
      jenisKelamin: 'P',
      tempatLahir: 'Cimahi',
      tanggalLahir: '1990-08-22',
      agama: 'Islam',
      pendidikan: 'S1',
      pekerjaan: 'Guru',
      statusPerkawinan: 'Kawin',
      alamat: 'Jl. Sudirman No. 456',
      rt: '002',
      rw: '001',
      noTelepon: '0813-4567-8901',
      email: 'siti.nurhaliza@email.com',
      statusKependudukan: 'Tetap',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      nik: '3217012345678903',
      nama: 'Budi Santoso',
      jenisKelamin: 'L',
      tempatLahir: 'Jakarta',
      tanggalLahir: '1988-12-10',
      agama: 'Kristen',
      pendidikan: 'D3',
      pekerjaan: 'Wiraswasta',
      statusPerkawinan: 'Belum Kawin',
      alamat: 'Jl. Gatot Subroto No. 789',
      rt: '003',
      rw: '002',
      noTelepon: '0814-5678-9012',
      statusKependudukan: 'Sementara',
      createdAt: '2024-02-01'
    }
  ];

  const filteredData = pendudukData.filter(penduduk => {
    const matchesSearch = penduduk.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penduduk.nik.includes(searchTerm) ||
                         penduduk.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = selectedGender === 'all' || penduduk.jenisKelamin === selectedGender;
    const matchesStatus = selectedStatus === 'all' || penduduk.statusKependudukan === selectedStatus;
    return matchesSearch && matchesGender && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tetap': return 'bg-green-100 text-green-800';
      case 'Sementara': return 'bg-yellow-100 text-yellow-800';
      case 'Pendatang': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const statistik = {
    total: pendudukData.length,
    lakiLaki: pendudukData.filter(p => p.jenisKelamin === 'L').length,
    perempuan: pendudukData.filter(p => p.jenisKelamin === 'P').length,
    tetap: pendudukData.filter(p => p.statusKependudukan === 'Tetap').length,
    sementara: pendudukData.filter(p => p.statusKependudukan === 'Sementara').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <UserPlus className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Data Kependudukan</h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Sistem informasi dan pengelolaan data penduduk Desa Cilame
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{statistik.total}</div>
              <div className="text-sm text-gray-600">Total Penduduk</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statistik.lakiLaki}</div>
              <div className="text-sm text-gray-600">Laki-laki</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{statistik.perempuan}</div>
              <div className="text-sm text-gray-600">Perempuan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statistik.tetap}</div>
              <div className="text-sm text-gray-600">Penduduk Tetap</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{statistik.sementara}</div>
              <div className="text-sm text-gray-600">Penduduk Sementara</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Data Penduduk
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari berdasarkan nama, NIK, atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Semua Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="Tetap">Tetap</option>
              <option value="Sementara">Sementara</option>
              <option value="Pendatang">Pendatang</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RT/RW</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((penduduk) => (
                  <tr key={penduduk.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {penduduk.nik}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{penduduk.nama}</div>
                        <div className="text-sm text-gray-500">{penduduk.pekerjaan}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {penduduk.jenisKelamin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {calculateAge(penduduk.tanggalLahir)} tahun
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {penduduk.alamat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {penduduk.rt}/{penduduk.rw}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(penduduk.statusKependudukan)}>
                        {penduduk.statusKependudukan}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Layanan Kependudukan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Surat Keterangan</h3>
              <p className="text-gray-600 text-sm">Penerbitan surat keterangan domisili, kelahiran, kematian, dan lainnya</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Kartu Keluarga</h3>
              <p className="text-gray-600 text-sm">Pembuatan dan perubahan data kartu keluarga</p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Jadwal Pelayanan</h3>
              <p className="text-gray-600 text-sm">Senin - Jumat: 08:00 - 16:00 WIB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}