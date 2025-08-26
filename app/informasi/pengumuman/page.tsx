'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, Eye, ArrowRight, Filter, Clock, AlertTriangle, Info, CheckCircle, Bell, Download, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PengumumanPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');

  const announcements = [
    {
      id: 1,
      title: 'Pembukaan Pendaftaran Bantuan Sosial Tahun 2025',
      content: 'Pemerintah Desa Cilame membuka pendaftaran bantuan sosial untuk keluarga kurang mampu. Pendaftaran dibuka mulai 20 Januari hingga 20 Februari 2025.',
      author: 'Kepala Desa Cilame',
      date: '2024-01-15',
      priority: 'Tinggi',
      status: 'Aktif',
      category: 'Bantuan Sosial',
      views: 2150,
      hasAttachment: true,
      attachmentName: 'Formulir_Pendaftaran_Bansos_2025.pdf',
      deadline: '2025-02-20'
    },
    {
      id: 2,
      title: 'Jadwal Pelayanan Administrasi Selama Libur Nasional',
      content: 'Pelayanan administrasi desa akan tutup pada tanggal 17 Agustus 2024 dalam rangka memperingati Hari Kemerdekaan RI. Pelayanan normal kembali pada 19 Agustus 2024.',
      author: 'Kaur Pemerintahan',
      date: '2024-01-12',
      priority: 'Sedang',
      status: 'Aktif',
      category: 'Pelayanan',
      views: 1890,
      hasAttachment: false,
      deadline: null
    },
    {
      id: 3,
      title: 'Penutupan Jalan Sementara untuk Perbaikan Infrastruktur',
      content: 'Jalan utama Desa Cilame akan ditutup sementara untuk perbaikan dari tanggal 25-30 Januari 2025. Harap gunakan jalur alternatif yang telah disediakan.',
      author: 'Kaur Pembangunan',
      date: '2024-01-10',
      priority: 'Tinggi',
      status: 'Aktif',
      category: 'Infrastruktur',
      views: 1650,
      hasAttachment: true,
      attachmentName: 'Peta_Jalur_Alternatif.pdf',
      deadline: '2025-01-30'
    },
    {
      id: 4,
      title: 'Rekrutmen Tenaga Kontrak Desa Tahun 2025',
      content: 'Pemerintah Desa Cilame membuka lowongan untuk tenaga kontrak di bidang administrasi dan teknis. Pendaftaran dibuka hingga 31 Januari 2025.',
      author: 'Sekretaris Desa',
      date: '2024-01-08',
      priority: 'Sedang',
      status: 'Aktif',
      category: 'Lowongan Kerja',
      views: 2890,
      hasAttachment: true,
      attachmentName: 'Persyaratan_Rekrutmen_2025.pdf',
      deadline: '2025-01-31'
    },
    {
      id: 5,
      title: 'Sosialisasi Program Desa Digital',
      content: 'Mengundang seluruh warga untuk menghadiri sosialisasi program digitalisasi desa yang akan dilaksanakan pada 28 Januari 2025 di Balai Desa.',
      author: 'Tim IT Desa',
      date: '2024-01-05',
      priority: 'Sedang',
      status: 'Aktif',
      category: 'Sosialisasi',
      views: 1420,
      hasAttachment: false,
      deadline: '2025-01-28'
    },
    {
      id: 6,
      title: 'Pembayaran Pajak Bumi dan Bangunan (PBB) 2024',
      content: 'Batas waktu pembayaran PBB tahun 2024 diperpanjang hingga 31 Desember 2024. Pembayaran dapat dilakukan di kantor desa atau melalui bank yang ditunjuk.',
      author: 'Kaur Keuangan',
      date: '2024-01-03',
      priority: 'Tinggi',
      status: 'Berakhir',
      category: 'Pajak',
      views: 3250,
      hasAttachment: true,
      attachmentName: 'Daftar_Bank_Pembayaran_PBB.pdf',
      deadline: '2024-12-31'
    },
    {
      id: 7,
      title: 'Gotong Royong Pembersihan Lingkungan',
      content: 'Mengajak seluruh warga untuk berpartisipasi dalam gotong royong pembersihan lingkungan setiap hari Minggu pertama di setiap bulan.',
      author: 'Ketua RT 01',
      date: '2024-01-01',
      priority: 'Rendah',
      status: 'Aktif',
      category: 'Lingkungan',
      views: 890,
      hasAttachment: false,
      deadline: null
    },
    {
      id: 8,
      title: 'Pendaftaran Peserta Posyandu Balita',
      content: 'Posyandu Desa Cilame membuka pendaftaran untuk balita baru. Pendaftaran dapat dilakukan setiap hari Rabu di Posyandu terdekat.',
      author: 'Bidan Desa',
      date: '2023-12-28',
      priority: 'Sedang',
      status: 'Aktif',
      category: 'Kesehatan',
      views: 1150,
      hasAttachment: true,
      attachmentName: 'Jadwal_Posyandu_2025.pdf',
      deadline: null
    }
  ];

  const priorities = ['Semua', 'Tinggi', 'Sedang', 'Rendah'];
  const statuses = ['Semua', 'Aktif', 'Berakhir'];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'Semua' || announcement.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'Semua' || announcement.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Tinggi': 'bg-red-100 text-red-800 border-red-200',
      'Sedang': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Rendah': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Aktif': 'bg-green-100 text-green-800 border-green-200',
      'Berakhir': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Tinggi':
        return <AlertTriangle className="h-3 w-3" />;
      case 'Sedang':
        return <Info className="h-3 w-3" />;
      case 'Rendah':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const isDeadlineNear = (deadline: string | null) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-700 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Pengumuman Resmi
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 mb-8">
              Informasi Penting dan Pengumuman Desa Cilame
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Bell className="h-4 w-4 mr-2" />
                {announcements.filter(a => a.status === 'Aktif').length} Pengumuman Aktif
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                {announcements.reduce((total, announcement) => total + announcement.views, 0).toLocaleString()} Views
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari pengumuman..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority === 'Semua' ? 'Semua Prioritas' : `Prioritas ${priority}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'Semua' ? 'Semua Status' : status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements List */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || selectedPriority !== 'Semua' || selectedStatus !== 'Semua' ? 'Hasil Pencarian' : 'Daftar Pengumuman'}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredAnnouncements.length} pengumuman ditemukan
            </div>
          </div>
          
          {filteredAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pengumuman ditemukan</h3>
                <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  announcement.priority === 'Tinggi' ? 'border-l-4 border-l-red-500' : 
                  announcement.priority === 'Sedang' ? 'border-l-4 border-l-yellow-500' : 
                  'border-l-4 border-l-green-500'
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={getPriorityColor(announcement.priority)} variant="outline">
                            {getPriorityIcon(announcement.priority)}
                            <span className="ml-1">{announcement.priority}</span>
                          </Badge>
                          <Badge className={getStatusColor(announcement.status)} variant="outline">
                            {announcement.status}
                          </Badge>
                          <Badge variant="outline" className="text-blue-700 border-blue-300">
                            {announcement.category}
                          </Badge>
                          {announcement.deadline && isDeadlineNear(announcement.deadline) && (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 animate-pulse">
                              <Clock className="h-3 w-3 mr-1" />
                              Deadline Dekat
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{announcement.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{announcement.content}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(announcement.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {announcement.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {announcement.views.toLocaleString()} views
                          </div>
                          {announcement.deadline && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Deadline: {formatDate(announcement.deadline)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                            Baca Selengkapnya
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                          {announcement.hasAttachment && (
                            <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                              <Download className="h-3 w-3 mr-1" />
                              {announcement.attachmentName}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {announcement.priority === 'Tinggi' && (
                        <div className="lg:w-20 flex lg:flex-col items-center justify-center bg-red-50 rounded-lg p-3">
                          <AlertTriangle className="h-8 w-8 text-red-600 mb-1" />
                          <span className="text-xs font-medium text-red-700 text-center">PENTING</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Berlangganan Notifikasi</h3>
              <p className="text-gray-600 text-sm mb-4">Dapatkan notifikasi pengumuman terbaru</p>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                Aktifkan Notifikasi
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Arsip Pengumuman</h3>
              <p className="text-gray-600 text-sm mb-4">Lihat pengumuman tahun sebelumnya</p>
              <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                Lihat Arsip
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kirim Pengumuman</h3>
              <p className="text-gray-600 text-sm mb-4">Untuk perangkat desa dan RT/RW</p>
              <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                Akses Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Subscription */}
        <Card className="bg-gradient-to-r from-slate-700 to-blue-700 text-white">
          <CardContent className="py-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Berlangganan Pengumuman</h3>
              <p className="text-slate-100 mb-6">
                Dapatkan pengumuman penting dan informasi terbaru dari Desa Cilame langsung di email Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  placeholder="Masukkan email Anda"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button variant="secondary" className="bg-white text-slate-700 hover:bg-white/90">
                  Berlangganan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}