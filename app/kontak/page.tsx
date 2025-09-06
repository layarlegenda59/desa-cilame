'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, User, MessageSquare, Send, CheckCircle, AlertCircle, Info, Building, Users, Heart, FileText, Globe, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function KontakPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'Umum',
    message: '',
    isUrgent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Alamat Kantor',
      content: 'Jalan Galudra No. 37, Desa Cilame, Kecamatan Ngamprah - 40552',
      action: 'Lihat di Peta',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      content: 'info@desacilame.com',
      action: 'Kirim Email',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Jam Operasional',
      content: 'Senin - Jumat: 08:00 - 16:00\nSabtu: 08:00 - 12:00\nMinggu: Tutup',
      action: 'Lihat Jadwal',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const departments = [
    {
      name: 'Kepala Desa',
      officer: 'AAS MOHAMAD ASOR, S.H., M.H., NL.P.',
      email: 'kades@desacilame.com',
      description: 'Pimpinan tertinggi pemerintahan desa',
      icon: <User className="h-5 w-5" />,
      color: 'bg-red-100 text-red-600'
    },
    {
      name: 'Sekretaris Desa',
      officer: 'DENI AHMAD BERLIAN',
      email: 'sekdes@desacilame.com',
      description: 'Koordinator administrasi dan tata usaha',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Kaur Pemerintahan',
      officer: 'TRI SOPYAN',
      email: 'pemerintahan@desacilame.com',
      description: 'Pelayanan administrasi kependudukan',
      icon: <Building className="h-5 w-5" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'Kaur Kesejahteraan',
      officer: 'USEP SUDARYA',
      email: 'kesejahteraan@desacilame.com',
      description: 'Program sosial dan bantuan masyarakat',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: 'Kaur Pembangunan',
      officer: 'INDRA LESMANA',
      email: 'perencanaan@desacilame.com',
      description: 'Infrastruktur dan pembangunan desa',
      icon: <Building className="h-5 w-5" />,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      name: 'Kaur Keuangan',
      officer: 'DEDEH MARYATI',
      email: 'keuangan@desacilame.com',
      description: 'Pengelolaan keuangan desa',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const categories = [
    'Umum',
    'Administrasi Kependudukan',
    'Pelayanan Surat',
    'Bantuan Sosial',
    'Pembangunan Infrastruktur',
    'UMKM dan Ekonomi',
    'Kesehatan',
    'Pendidikan',
    'Lingkungan',
    'Keluhan/Saran'
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
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'Umum',
        message: '',
        isUrgent: false
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/desa.cilame', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-700 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hubungi Kami
            </h1>
            <p className="text-xl md:text-2xl text-slate-100 mb-8">
              Kami Siap Melayani dan Membantu Anda
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <MessageSquare className="h-4 w-4 mr-2" />
                Respon Cepat
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Contact Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Informasi Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6 text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${info.color}`}>
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">{info.content}</p>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Kirim Pesan</CardTitle>
                <p className="text-gray-600">Sampaikan pertanyaan, saran, atau keluhan Anda kepada kami</p>
              </CardHeader>
              <CardContent>
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800">Pesan Anda berhasil dikirim! Kami akan merespons dalam 1x24 jam.</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-800">Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung.</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subjek *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Ringkasan singkat pesan Anda"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Pesan *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tulis pesan Anda secara detail..."
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      id="isUrgent"
                      name="isUrgent"
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isUrgent" className="text-sm text-gray-700">
                      Ini adalah pesan mendesak
                    </label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Department Contacts */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Kontak Perangkat Desa</h3>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${dept.color}`}>
                        {dept.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{dept.name}</h4>
                        <p className="text-blue-600 font-medium mb-2">{dept.officer}</p>
                        <p className="text-gray-600 text-sm mb-3">{dept.description}</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Lokasi Kantor Desa</h2>
          <Card>
            <CardContent className="p-0">
              <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Peta Interaktif Kantor Desa Cilame</p>
                    <Button variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                      Buka di Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Media */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ikuti Media Sosial Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Facebook className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Facebook</h3>
                <p className="text-gray-600 text-sm mb-4">@DesaCilameOfficial</p>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Kunjungi
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Instagram className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instagram</h3>
                <p className="text-gray-600 text-sm mb-4">@desa.cilame</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-pink-600 border-pink-300 hover:bg-pink-50"
                  onClick={handleInstagramClick}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Kunjungi
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6 text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Youtube className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">YouTube</h3>
                <p className="text-gray-600 text-sm mb-4">Desa Cilame TV</p>
                <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Kunjungi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pertanyaan Umum</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Berapa lama respon pesan?</h4>
                    <p className="text-gray-600 text-sm">Kami berusaha merespons dalam 1x24 jam pada hari kerja.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Kapan kantor desa buka?</h4>
                    <div className="text-gray-600 text-sm space-y-2">
                      <div className="font-medium text-gray-800 text-sm mb-2">Hari & Waktu Layanan</div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Senin – Kamis</span>
                          <span className="text-sm">08.00 – 15.00 WIB</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Jumat</span>
                          <span className="text-sm">08.00 – 11.30 WIB</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="font-medium text-gray-800 text-sm mb-1">Jam Istirahat</div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Senin – Kamis</span>
                          <span className="text-sm">12.00 – 13.00 WIB</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-red-600">Sabtu – Minggu & Hari Libur Nasional</span>
                          <span className="font-medium text-red-600">Tutup</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bagaimana cara mengajukan keluhan?</h4>
                    <p className="text-gray-600 text-sm">Gunakan formulir di atas dengan kategori 'Keluhan/Saran' atau datang langsung ke kantor desa.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}