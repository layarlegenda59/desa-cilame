'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, MapPin, Phone, User, CheckCircle, AlertCircle, Info, FileText, Users, Building, Heart, Briefcase, Home } from 'lucide-react';
import Image from 'next/image';

export default function JadwalPelayananPage() {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState('Senin');

  const serviceSchedule = {
    'Senin': [
      {
        time: '08:00 - 12:00',
        service: 'Pelayanan Administrasi Umum',
        officer: 'Kaur Pemerintahan',
        location: 'Kantor Desa - Ruang Pelayanan',
        description: 'Pembuatan surat keterangan, surat pengantar, dan dokumen administrasi lainnya',
        status: 'available',
        maxCapacity: 20,
        currentBooking: 8
      },
      {
        time: '13:00 - 16:00',
        service: 'Konsultasi Pembangunan Desa',
        officer: 'Kaur Pembangunan',
        location: 'Kantor Desa - Ruang Rapat',
        description: 'Konsultasi terkait usulan pembangunan infrastruktur dan program desa',
        status: 'available',
        maxCapacity: 10,
        currentBooking: 3
      }
    ],
    'Selasa': [
      {
        time: '08:00 - 12:00',
        service: 'Pelayanan Kependudukan',
        officer: 'Kaur Pemerintahan',
        location: 'Kantor Desa - Ruang Pelayanan',
        description: 'Pembuatan KTP, KK, akta kelahiran, dan dokumen kependudukan lainnya',
        status: 'available',
        maxCapacity: 25,
        currentBooking: 15
      },
      {
        time: '13:00 - 16:00',
        service: 'Pelayanan Kesehatan Posyandu',
        officer: 'Bidan Desa',
        location: 'Posyandu Melati',
        description: 'Pemeriksaan kesehatan ibu hamil, balita, dan lansia',
        status: 'full',
        maxCapacity: 30,
        currentBooking: 30
      }
    ],
    'Rabu': [
      {
        time: '08:00 - 12:00',
        service: 'Pelayanan Sosial dan Bantuan',
        officer: 'Kaur Kesejahteraan',
        location: 'Kantor Desa - Ruang Pelayanan',
        description: 'Pendaftaran bantuan sosial, verifikasi data penerima bantuan',
        status: 'available',
        maxCapacity: 15,
        currentBooking: 12
      },
      {
        time: '13:00 - 16:00',
        service: 'Konsultasi UMKM',
        officer: 'Pendamping UMKM',
        location: 'Kantor Desa - Ruang Rapat',
        description: 'Konsultasi pengembangan usaha, bantuan modal, dan pemasaran',
        status: 'available',
        maxCapacity: 12,
        currentBooking: 5
      }
    ],
    'Kamis': [
      {
        time: '08:00 - 12:00',
        service: 'Pelayanan Pertanahan',
        officer: 'Kaur Pemerintahan',
        location: 'Kantor Desa - Ruang Pelayanan',
        description: 'Surat keterangan tanah, rekomendasi sertifikat, dan dokumen pertanahan',
        status: 'available',
        maxCapacity: 18,
        currentBooking: 7
      },
      {
        time: '13:00 - 16:00',
        service: 'Pelayanan Perizinan Usaha',
        officer: 'Sekretaris Desa',
        location: 'Kantor Desa - Ruang Sekretaris',
        description: 'Pengurusan izin usaha mikro, rekomendasi usaha, dan dokumen perizinan',
        status: 'available',
        maxCapacity: 10,
        currentBooking: 4
      }
    ],
    'Jumat': [
      {
        time: '08:00 - 11:00',
        service: 'Pelayanan Administrasi Umum',
        officer: 'Kaur Pemerintahan',
        location: 'Kantor Desa - Ruang Pelayanan',
        description: 'Pelayanan administrasi umum (waktu terbatas)',
        status: 'available',
        maxCapacity: 15,
        currentBooking: 6
      },
      {
        time: '13:00 - 16:00',
        service: 'Konsultasi Kepala Desa',
        officer: 'Kepala Desa Cilame',
        location: 'Kantor Desa - Ruang Kepala Desa',
        description: 'Konsultasi langsung dengan Kepala Desa (dengan perjanjian)',
        status: 'appointment',
        maxCapacity: 5,
        currentBooking: 3
      }
    ],
    'Sabtu': [
      {
        time: '08:00 - 12:00',
        service: 'Pelayanan Darurat',
        officer: 'Petugas Piket',
        location: 'Kantor Desa - Ruang Piket',
        description: 'Pelayanan khusus untuk keperluan mendesak dan darurat',
        status: 'emergency',
        maxCapacity: 10,
        currentBooking: 2
      }
    ]
  };

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'appointment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'emergency':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-3 w-3" />;
      case 'full':
        return <AlertCircle className="h-3 w-3" />;
      case 'appointment':
        return <Calendar className="h-3 w-3" />;
      case 'emergency':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Tersedia';
      case 'full':
        return 'Penuh';
      case 'appointment':
        return 'Dengan Janji';
      case 'emergency':
        return 'Darurat';
      default:
        return 'Tidak Diketahui';
    }
  };

  const getServiceIcon = (service: string) => {
    if (service.includes('Administrasi')) return <FileText className="h-5 w-5" />;
    if (service.includes('Kependudukan')) return <Users className="h-5 w-5" />;
    if (service.includes('Pembangunan')) return <Building className="h-5 w-5" />;
    if (service.includes('Kesehatan')) return <Heart className="h-5 w-5" />;
    if (service.includes('UMKM') || service.includes('Perizinan')) return <Briefcase className="h-5 w-5" />;
    if (service.includes('Sosial')) return <Users className="h-5 w-5" />;
    if (service.includes('Pertanahan')) return <Home className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const importantInfo = [
    {
      title: 'Syarat Umum Pelayanan',
      items: [
        'Membawa KTP asli dan fotokopi',
        'Mengisi formulir permohonan',
        'Membawa dokumen pendukung sesuai jenis layanan',
        'Datang sesuai jadwal yang telah ditentukan'
      ]
    },
    {
      title: 'Ketentuan Khusus',
      items: [
        'Pelayanan Jumat berakhir pukul 11:00 (istirahat sholat Jumat)',
        'Pelayanan Sabtu hanya untuk keperluan darurat',
        'Konsultasi Kepala Desa memerlukan perjanjian terlebih dahulu',
        'Maksimal 3 jenis layanan per orang per hari'
      ]
    },
    {
      title: 'Kontak Darurat',
      items: [
        'Kepala Desa: 0812-3456-7890',
        'Sekretaris Desa: 0812-3456-7891',
        'Kaur Pemerintahan: 0812-3456-7892',
        'Kantor Desa: (022) 1234-5678'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-700 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Jadwal Pelayanan
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 mb-8">
              Jadwal Lengkap Pelayanan Administrasi Desa Cilame
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                Senin - Sabtu
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                Kantor Desa Cilame
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Day Selector */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    onClick={() => setSelectedDay(day)}
                    className={selectedDay === day ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule for Selected Day */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Jadwal {selectedDay}</h2>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {serviceSchedule[selectedDay as keyof typeof serviceSchedule]?.length || 0} Layanan
            </Badge>
          </div>
          
          {serviceSchedule[selectedDay as keyof typeof serviceSchedule] ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {serviceSchedule[selectedDay as keyof typeof serviceSchedule].map((schedule, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        {getServiceIcon(schedule.service)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={getStatusColor(schedule.status)} variant="outline">
                            {getStatusIcon(schedule.status)}
                            <span className="ml-1">{getStatusText(schedule.status)}</span>
                          </Badge>
                          <Badge variant="outline" className="text-gray-700 border-gray-300">
                            <Clock className="h-3 w-3 mr-1" />
                            {schedule.time}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{schedule.service}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{schedule.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span className="font-medium">Petugas:</span>
                            <span>{schedule.officer}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Lokasi:</span>
                            <span>{schedule.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">Kapasitas:</span>
                            <span>{schedule.currentBooking}/{schedule.maxCapacity} orang</span>
                          </div>
                        </div>
                        
                        {/* Capacity Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Kapasitas Terisi</span>
                            <span>{Math.round((schedule.currentBooking / schedule.maxCapacity) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                schedule.status === 'full' ? 'bg-red-500' :
                                (schedule.currentBooking / schedule.maxCapacity) > 0.8 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(schedule.currentBooking / schedule.maxCapacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {schedule.status === 'available' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Daftar Sekarang
                            </Button>
                          )}
                          {schedule.status === 'appointment' && (
                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                              Buat Janji
                            </Button>
                          )}
                          {schedule.status === 'full' && (
                            <Button size="sm" variant="outline" disabled>
                              Penuh
                            </Button>
                          )}
                          {schedule.status === 'emergency' && (
                            <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-50">
                              Hubungi Petugas
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Calendar className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada layanan</h3>
                <p className="text-gray-600">Tidak ada jadwal pelayanan untuk hari {selectedDay}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Important Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Penting</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {importantInfo.map((info, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {info.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Buat Janji</h3>
              <p className="text-gray-600 text-sm mb-4">Jadwalkan kunjungan Anda</p>
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                Buat Janji
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hubungi Kami</h3>
              <p className="text-gray-600 text-sm mb-4">Informasi lebih lanjut</p>
              <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                Hubungi
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Form</h3>
              <p className="text-gray-600 text-sm mb-4">Formulir permohonan</p>
              <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                Download
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6 text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lokasi</h3>
              <p className="text-gray-600 text-sm mb-4">Peta kantor desa</p>
              <Button variant="outline" size="sm" className="text-orange-600 border-orange-300 hover:bg-orange-50">
                Lihat Peta
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-slate-700 to-blue-700 text-white">
          <CardContent className="py-8">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6">Informasi Kontak</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Alamat</h4>
                  <p className="text-slate-100 text-sm">Jalan Galudra No. 37<br />Desa Cilame, Kecamatan Ngamprah - 40552</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Telepon</h4>
                  <p className="text-slate-100 text-sm">(022) 1234-5678<br />0812-3456-7890</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Jam Operasional</h4>
                  <p className="text-slate-100 text-sm">Senin - Jumat: 08:00 - 16:00<br />Sabtu: 08:00 - 12:00</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-slate-100 text-sm">info@desacilame.com<br />pelayanan@desacilame.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}