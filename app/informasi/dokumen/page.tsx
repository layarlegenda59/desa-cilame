'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Download, Eye, Filter, FileText, File, Image, Video, Archive, ExternalLink, Lock, Unlock, Star, Clock, User } from 'lucide-react';

export default function DokumenPublikPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedType, setSelectedType] = useState('Semua');

  const documents = [
    {
      id: 1,
      title: 'Peraturan Desa Cilame Nomor 1 Tahun 2025',
      description: 'Peraturan tentang Rencana Pembangunan Jangka Menengah Desa (RPJMDes) Cilame 2025-2030',
      category: 'Peraturan Desa',
      type: 'PDF',
      size: '2.5 MB',
      uploadDate: '2024-01-15',
      downloadCount: 1250,
      isPublic: true,
      isFeatured: true,
      author: 'Pemerintah Desa Cilame',
      tags: ['RPJMDes', 'Pembangunan', 'Perencanaan']
    },
    {
      id: 2,
      title: 'Laporan Keuangan Desa Tahun 2024',
      description: 'Laporan pertanggungjawaban keuangan desa periode Januari - Desember 2024',
      category: 'Laporan Keuangan',
      type: 'PDF',
      size: '4.2 MB',
      uploadDate: '2024-01-12',
      downloadCount: 890,
      isPublic: true,
      isFeatured: true,
      author: 'Kaur Keuangan',
      tags: ['Keuangan', 'Laporan', 'Transparansi']
    },
    {
      id: 3,
      title: 'Data Statistik Penduduk Cilame 2024',
      description: 'Data lengkap statistik kependudukan Desa Cilame tahun 2024',
      category: 'Data Statistik',
      type: 'Excel',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
      downloadCount: 650,
      isPublic: true,
      isFeatured: false,
      author: 'Kaur Pemerintahan',
      tags: ['Statistik', 'Penduduk', 'Data']
    },
    {
      id: 4,
      title: 'Peta Wilayah Desa Cilame',
      description: 'Peta digital wilayah administratif Desa Cilame dengan batas-batas dusun',
      category: 'Peta dan Tata Ruang',
      type: 'Image',
      size: '5.1 MB',
      uploadDate: '2024-01-08',
      downloadCount: 420,
      isPublic: true,
      isFeatured: false,
      author: 'Kaur Pembangunan',
      tags: ['Peta', 'Wilayah', 'Tata Ruang']
    },
    {
      id: 5,
      title: 'Formulir Permohonan Surat Keterangan',
      description: 'Template formulir untuk berbagai jenis surat keterangan',
      category: 'Formulir',
      type: 'Word',
      size: '0.5 MB',
      uploadDate: '2024-01-05',
      downloadCount: 2100,
      isPublic: true,
      isFeatured: true,
      author: 'Kaur Pemerintahan',
      tags: ['Formulir', 'Surat', 'Template']
    },
    {
      id: 6,
      title: 'Profil Desa Cilame 2025',
      description: 'Dokumen lengkap profil Desa Cilame meliputi sejarah, demografi, dan potensi desa',
      category: 'Profil Desa',
      type: 'PDF',
      size: '8.7 MB',
      uploadDate: '2024-01-03',
      downloadCount: 780,
      isPublic: true,
      isFeatured: false,
      author: 'Tim Penyusun Profil Desa',
      tags: ['Profil', 'Sejarah', 'Demografi']
    },
    {
      id: 7,
      title: 'Rencana Kerja Pemerintah Desa 2025',
      description: 'Dokumen perencanaan kerja pemerintah desa untuk tahun 2025',
      category: 'Perencanaan',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-01',
      downloadCount: 560,
      isPublic: true,
      isFeatured: false,
      author: 'Sekretaris Desa',
      tags: ['RKP', 'Perencanaan', 'Program Kerja']
    },
    {
      id: 8,
      title: 'Dokumentasi Kegiatan Desa 2024',
      description: 'Kumpulan foto dan video kegiatan desa selama tahun 2024',
      category: 'Dokumentasi',
      type: 'Archive',
      size: '125 MB',
      uploadDate: '2023-12-28',
      downloadCount: 340,
      isPublic: true,
      isFeatured: false,
      author: 'Tim Dokumentasi',
      tags: ['Dokumentasi', 'Foto', 'Video']
    },
    {
      id: 9,
      title: 'Standar Operasional Prosedur Pelayanan',
      description: 'SOP lengkap untuk berbagai jenis pelayanan administrasi desa',
      category: 'SOP',
      type: 'PDF',
      size: '2.1 MB',
      uploadDate: '2023-12-25',
      downloadCount: 890,
      isPublic: true,
      isFeatured: false,
      author: 'Sekretaris Desa',
      tags: ['SOP', 'Pelayanan', 'Prosedur']
    },
    {
      id: 10,
      title: 'Daftar Inventaris Desa 2024',
      description: 'Daftar lengkap inventaris barang milik desa tahun 2024',
      category: 'Inventaris',
      type: 'Excel',
      size: '1.2 MB',
      uploadDate: '2023-12-20',
      downloadCount: 230,
      isPublic: false,
      isFeatured: false,
      author: 'Kaur Umum',
      tags: ['Inventaris', 'Aset', 'BMD']
    }
  ];

  const categories = ['Semua', 'Peraturan Desa', 'Laporan Keuangan', 'Data Statistik', 'Peta dan Tata Ruang', 'Formulir', 'Profil Desa', 'Perencanaan', 'Dokumentasi', 'SOP', 'Inventaris'];
  const types = ['Semua', 'PDF', 'Excel', 'Word', 'Image', 'Video', 'Archive'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || doc.category === selectedCategory;
    const matchesType = selectedType === 'Semua' || doc.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredDocuments = documents.filter(doc => doc.isFeatured && doc.isPublic);
  const publicDocuments = filteredDocuments.filter(doc => doc.isPublic);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'Excel':
        return <File className="h-5 w-5 text-green-600" />;
      case 'Word':
        return <File className="h-5 w-5 text-blue-600" />;
      case 'Image':
        return <Image className="h-5 w-5 text-purple-600" />;
      case 'Video':
        return <Video className="h-5 w-5 text-orange-600" />;
      case 'Archive':
        return <Archive className="h-5 w-5 text-gray-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'PDF': 'bg-red-100 text-red-800 border-red-200',
      'Excel': 'bg-green-100 text-green-800 border-green-200',
      'Word': 'bg-blue-100 text-blue-800 border-blue-200',
      'Image': 'bg-purple-100 text-purple-800 border-purple-200',
      'Video': 'bg-orange-100 text-orange-800 border-orange-200',
      'Archive': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-700 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Dokumen Publik
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 mb-8">
              Akses Dokumen dan Informasi Publik Desa Cilame
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <FileText className="h-4 w-4 mr-2" />
                {publicDocuments.length} Dokumen Publik
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Download className="h-4 w-4 mr-2" />
                {documents.reduce((total, doc) => total + doc.downloadCount, 0).toLocaleString()} Downloads
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
                    placeholder="Cari dokumen, deskripsi, atau tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>
                          {type === 'Semua' ? 'Semua Tipe' : type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Documents */}
        {searchTerm === '' && selectedCategory === 'Semua' && selectedType === 'Semua' && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dokumen Unggulan</h2>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDocuments.map((doc) => (
                <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        {getFileIcon(doc.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={getTypeColor(doc.type)} variant="outline">
                            {doc.type}
                          </Badge>
                          <Badge variant="outline" className="text-blue-700 border-blue-300">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{doc.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{doc.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {doc.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-gray-600 border-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(doc.uploadDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {doc.downloadCount.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Documents */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || selectedCategory !== 'Semua' || selectedType !== 'Semua' ? 'Hasil Pencarian' : 'Semua Dokumen'}
            </h2>
            <div className="text-sm text-gray-500">
              {publicDocuments.length} dokumen ditemukan
            </div>
          </div>
          
          {publicDocuments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumen ditemukan</h3>
                <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {(searchTerm === '' && selectedCategory === 'Semua' && selectedType === 'Semua' 
                ? publicDocuments.filter(doc => !doc.isFeatured) 
                : publicDocuments
              ).map((doc) => (
                <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className={getTypeColor(doc.type)} variant="outline">
                              {doc.type}
                            </Badge>
                            <Badge variant="outline" className="text-gray-700 border-gray-300">
                              {doc.category}
                            </Badge>
                            {doc.isFeatured && (
                              <Badge variant="outline" className="text-blue-700 border-blue-300">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline" className={doc.isPublic ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300'}>
                              {doc.isPublic ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                              {doc.isPublic ? 'Publik' : 'Terbatas'}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{doc.title}</h3>
                          <p className="text-gray-600 leading-relaxed mb-4">{doc.description}</p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {doc.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs text-gray-600 border-gray-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(doc.uploadDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {doc.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {doc.downloadCount.toLocaleString()} downloads
                            </div>
                            <div className="flex items-center gap-1">
                              <Archive className="h-4 w-4" />
                              {formatFileSize(doc.size)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 lg:w-40">
                        {doc.isPublic ? (
                          <>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <Lock className="h-3 w-3 mr-1" />
                            Akses Terbatas
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{publicDocuments.length}</h3>
              <p className="text-gray-600 text-sm">Dokumen Publik</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {documents.reduce((total, doc) => total + doc.downloadCount, 0).toLocaleString()}
              </h3>
              <p className="text-gray-600 text-sm">Total Downloads</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{featuredDocuments.length}</h3>
              <p className="text-gray-600 text-sm">Dokumen Unggulan</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">24/7</h3>
              <p className="text-gray-600 text-sm">Akses Online</p>
            </CardContent>
          </Card>
        </div>

        {/* Information */}
        <Card className="bg-gradient-to-r from-slate-700 to-blue-700 text-white">
          <CardContent className="py-8">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Informasi Akses Dokumen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Dokumen Publik</h4>
                  <ul className="text-slate-100 text-sm space-y-2 text-left">
                    <li>• Dapat diakses dan diunduh secara gratis</li>
                    <li>• Tidak memerlukan registrasi atau login</li>
                    <li>• Tersedia dalam format digital</li>
                    <li>• Update berkala sesuai kebutuhan</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Permintaan Dokumen</h4>
                  <ul className="text-slate-100 text-sm space-y-2 text-left">
                    <li>• Dokumen tidak tersedia dapat diminta</li>
                    <li>• Ajukan permohonan melalui kantor desa</li>
                    <li>• Proses sesuai ketentuan yang berlaku</li>
                    <li>• Hubungi kami untuk informasi lebih lanjut</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="secondary" className="bg-white text-slate-700 hover:bg-white/90">
                  Hubungi Kami untuk Informasi Lebih Lanjut
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}