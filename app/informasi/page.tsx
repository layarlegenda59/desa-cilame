'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Calendar,
  User,
  Download,
  Filter,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react'

export default function InformasiPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('semua')
  const { t } = useLanguage()

  const categories = [
    { id: 'semua', label: 'Semua' },
    { id: 'pengumuman', label: 'Pengumuman' },
    { id: 'berita', label: 'Berita' },
    { id: 'jadwal', label: 'Jadwal Layanan' },
    { id: 'dokumen', label: 'Dokumen Publik' },
  ]

  const announcements = [
    {
      id: 1,
      title: 'Pendaftaran Bantuan Sosial PKH Tahap II',
      excerpt:
        'Pendaftaran bantuan sosial PKH untuk tahap II telah dibuka dari tanggal 15 Januari hingga 31 Januari 2025.',
      image:
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      date: '2025-01-15',
      author: 'Bagian Sosial',
      category: 'pengumuman',
      type: 'Pengumuman',
      urgent: true,
    },
    {
      id: 2,
      title: 'Jadwal Pelayanan Administrasi Bulan Februari',
      excerpt:
        'Informasi jadwal pelayanan administrasi kependudukan untuk bulan Februari 2025 dengan sistem antrian online.',
      image:
        'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      date: '2025-01-12',
      author: 'Bagian Administrasi',
      category: 'jadwal',
      type: 'Jadwal Layanan',
    },
    {
      id: 3,
      title: 'Laporan Kegiatan Pembangunan Infrastruktur',
      excerpt:
        'Laporan lengkap progres pembangunan infrastruktur desa tahun 2024 dan rencana 2025.',
      image:
        'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      date: '2025-01-10',
      author: 'Tim Pembangunan',
      category: 'dokumen',
      type: 'Dokumen Publik',
    },
    {
      id: 4,
      title: 'Festival Budaya Desa Cilame 2025',
      excerpt:
        'Persiapan festival budaya tahunan dengan berbagai kegiatan seni dan budaya lokal.',
      image:
        'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      date: '2025-01-08',
      author: 'Bagian Kebudayaan',
      category: 'berita',
      type: 'Berita',
    },
  ]

  const schedules = [
    {
      service: 'Pembuatan KTP',
      day: 'Senin - Kamis',
      time: '08:00 - 15:00',
      location: 'Kantor Desa',
    },
    {
      service: 'Surat Keterangan',
      day: 'Senin - Jumat',
      time: '08:00 - 16:00',
      location: 'Kantor Desa',
    },
    {
      service: 'Konsultasi Hukum',
      day: 'Rabu',
      time: '09:00 - 12:00',
      location: 'Ruang Konsultasi',
    },
    {
      service: 'Pelayanan Kesehatan',
      day: 'Setiap Hari',
      time: '07:00 - 21:00',
      location: 'Puskesmas Desa',
    },
  ]

  const documents = [
    {
      title: 'Peraturan Desa No. 1/2025',
      description: 'Tentang Tata Tertib Kegiatan Usaha di Wilayah Desa',
      size: '2.4 MB',
      format: 'PDF',
    },
    {
      title: 'Laporan APBDes 2024',
      description: 'Laporan Anggaran Pendapatan dan Belanja Desa Tahun 2024',
      size: '5.8 MB',
      format: 'PDF',
    },
    {
      title: 'Rencana Pembangunan Jangka Menengah',
      description: 'RPJM Desa Cilame 2025-2030',
      size: '3.2 MB',
      format: 'PDF',
    },
    {
      title: 'Data Kependudukan 2024',
      description: 'Statistik dan demografi penduduk Desa Cilame',
      size: '1.9 MB',
      format: 'PDF',
    },
  ]

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'semua' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Portal Informasi Desa</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Akses informasi terkini, pengumuman resmi, jadwal layanan, dan
            dokumen publik Desa Cilame
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('info.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {t(
                      `info.${
                        category.id === 'semua' ? 'all_categories' : category.id
                      }`
                    )}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Content */}
            {filteredAnnouncements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedCategory === 'semua'
                    ? t('info.latest_info')
                    : t(
                        `info.${
                          selectedCategory === 'semua'
                            ? 'latest_info'
                            : selectedCategory
                        }`
                      )}
                </h2>

                <div className="space-y-6 container-responsive">
                  {filteredAnnouncements.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 relative card-image-container md:aspect-4-3 aspect-16-9">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="card-image"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            quality={80}
                            loading="lazy"
                          />
                          {item.urgent && (
                            <div className="absolute top-4 left-4">
                              <span className="bg-red-500 text-white px-2 py-1 text-xs rounded flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Penting
                              </span>
                            </div>
                          )}
                        </div>

                        <CardContent className="md:w-2/3 p-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded">
                              {item.type}
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(item.date).toLocaleDateString('id-ID')}
                            </div>
                          </div>

                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {item.excerpt}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-4 w-4 mr-1" />
                              {item.author}
                            </div>
                            <Link href={`/informasi/${item.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                {t('news.read_more')}
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('info.no_results')}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Jadwal Layanan */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  {t('info.service_schedule_title')}
                </h3>
                <div className="space-y-3">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-green-500 pl-3"
                    >
                      <h4 className="font-medium text-sm">
                        {schedule.service}
                      </h4>
                      <p className="text-xs text-gray-600">{schedule.day}</p>
                      <p className="text-xs text-gray-600">{schedule.time}</p>
                      <p className="text-xs text-green-600">
                        {schedule.location}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dokumen Publik */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-green-600" />
                  {t('info.public_documents_title')}
                </h3>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <h4 className="font-medium text-sm mb-1">{doc.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {doc.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {doc.format} • {doc.size}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {t('info.download')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Kontak Darurat */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  {t('info.emergency_contact')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-red-800">
                      {t('info.police')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">
                      {t('info.fire_dept')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">
                      {t('info.ambulance')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">
                      {t('info.village_office')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
