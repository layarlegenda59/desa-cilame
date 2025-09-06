'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, MessageSquare, Send, CheckCircle, AlertCircle, Info, Clock, User, MapPin, Phone, Camera, FileText, Eye, Filter, Search, Calendar, Star } from 'lucide-react';
import Image from 'next/image';

export default function LaporanPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: 'Infrastruktur',
    title: '',
    description: '',
    location: '',
    isAnonymous: false,
    priority: 'Sedang'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'form' | 'status'>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

  const categories = [
    'Infrastruktur',
    'Kebersihan',
    'Keamanan',
    'Pelayanan Publik',
    'Lingkungan',
    'Kesehatan',
    'Pendidikan',
    'Ekonomi',
    'Sosial',
    'Lainnya'
  ];

  const priorities = ['Rendah', 'Sedang', 'Tinggi', 'Mendesak'];

  const reportStatuses = [
    {
      id: 'RPT001',
      title: 'Jalan Rusak di RT 02',
      category: 'Infrastruktur',
      status: 'Dalam Proses',
      priority: 'Tinggi',
      date: '2024-01-15',
      reporter: 'Anonim',
      description: 'Jalan di depan rumah warga mengalami kerusakan parah dengan lubang besar yang membahayakan pengendara.',
      response: 'Laporan telah diterima dan sedang dalam tahap survei lokasi oleh tim teknis.',
      progress: 60
    },
    {
      id: 'RPT002',
      title: 'Lampu Jalan Mati',
      category: 'Infrastruktur',
      status: 'Selesai',
      priority: 'Sedang',
      date: '2024-01-10',
      reporter: 'Budi Santoso',
      description: 'Lampu jalan di Jalan Mawar tidak menyala sejak 3 hari yang lalu.',
      response: 'Lampu jalan telah diperbaiki dan sudah berfungsi normal kembali.',
      progress: 100
    },
    {
      id: 'RPT003',
      title: 'Sampah Menumpuk',
      category: 'Kebersihan',
      status: 'Baru',
      priority: 'Sedang',
      date: '2024-01-18',
      reporter: 'Siti Aminah',
      description: 'Sampah di TPS RT 05 sudah menumpuk dan tidak diangkut selama seminggu.',
      response: 'Laporan sedang diverifikasi oleh petugas kebersihan.',
      progress: 20
    },
    {
      id: 'RPT004',
      title: 'Gangguan Air Bersih',
      category: 'Pelayanan Publik',
      status: 'Dalam Proses',
      priority: 'Tinggi',
      date: '2024-01-16',
      reporter: 'Ahmad Fauzi',
      description: 'Air PDAM tidak mengalir di wilayah RT 03 sejak kemarin.',
      response: 'Tim teknis sedang memperbaiki pipa yang bocor di jalan utama.',
      progress: 75
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        category: 'Infrastruktur',
        title: '',
        description: '',
        location: '',
        isAnonymous: false,
        priority: 'Sedang'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Baru': return 'bg-blue-100 text-blue-800';
      case 'Dalam Proses': return 'bg-yellow-100 text-yellow-800';
      case 'Selesai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Rendah': return 'bg-gray-100 text-gray-800';
      case 'Sedang': return 'bg-blue-100 text-blue-800';
      case 'Tinggi': return 'bg-orange-100 text-orange-800';
      case 'Mendesak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reportStatuses.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'Semua' || report.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Laporan Warga
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8">
              Sampaikan Keluhan dan Aspirasi Anda untuk Desa yang Lebih Baik
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Respon Cepat
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                Transparan
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <User className="h-4 w-4 mr-2" />
                Anonim Tersedia
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'form'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2 inline" />
              Buat Laporan
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'status'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              Status Laporan
            </button>
          </div>
        </div>

        {activeTab === 'form' && (
          <div className="max-w-4xl mx-auto">
            {/* Report Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Formulir Laporan Warga</CardTitle>
                <p className="text-gray-600">Sampaikan keluhan, saran, atau aspirasi Anda untuk kemajuan desa</p>
              </CardHeader>
              <CardContent>
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">Laporan berhasil dikirim! ID Laporan: RPT{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-800">Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung.</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Anonymous Option */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        id="isAnonymous"
                        name="isAnonymous"
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="isAnonymous" className="text-sm font-medium text-blue-900">
                        Kirim laporan secara anonim
                      </label>
                    </div>
                    <p className="text-xs text-blue-700">
                      Jika dicentang, identitas Anda akan dirahasiakan dalam laporan
                    </p>
                  </div>

                  {/* Personal Information */}
                  {!formData.isAnonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required={!formData.isAnonymous}
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="nama@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Nomor Telepon
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Alamat
                        </label>
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="RT/RW, Dusun"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Report Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori Laporan *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        Tingkat Prioritas *
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        required
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Laporan *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ringkasan singkat masalah yang dilaporkan"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Kejadian *
                    </label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Alamat atau lokasi spesifik kejadian"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Laporan *
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      rows={6}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Jelaskan secara detail masalah yang ingin dilaporkan, termasuk waktu kejadian dan dampak yang dirasakan..."
                      className="resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim Laporan...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Laporan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="max-w-6xl mx-auto">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Cari laporan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="Semua">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                            <p className="text-sm text-gray-500">ID: {report.id} • Dilaporkan oleh: {report.reporter}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <Badge className={getPriorityColor(report.priority)}>
                              {report.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {report.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {report.category}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{report.description}</p>
                        
                        {report.response && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <h4 className="font-medium text-blue-900 mb-1">Tanggapan Petugas:</h4>
                            <p className="text-blue-800 text-sm">{report.response}</p>
                          </div>
                        )}
                        
                        {report.progress > 0 && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress Penanganan</span>
                              <span>{report.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${report.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada laporan ditemukan</h3>
                <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
              </div>
            )}
          </div>
        )}

        {/* Information Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Respon Cepat</h3>
              <p className="text-gray-600 text-sm">Laporan akan ditanggapi dalam 1x24 jam dan ditindaklanjuti sesuai prioritas</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparan</h3>
              <p className="text-gray-600 text-sm">Pantau progress penanganan laporan Anda secara real-time dan transparan</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privasi Terjaga</h3>
              <p className="text-gray-600 text-sm">Opsi laporan anonim tersedia untuk menjaga privasi dan keamanan pelapor</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}