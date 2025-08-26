'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload, 
  User, 
  Home, 
  Briefcase, 
  Heart, 
  GraduationCap, 
  Car, 
  Building, 
  Search,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Info,
  Send,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function SuratOnlinePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('request');
  const [selectedLetterType, setSelectedLetterType] = useState('');
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    nik: '',
    birthPlace: '',
    birthDate: '',
    gender: '',
    religion: '',
    maritalStatus: '',
    occupation: '',
    address: '',
    rt: '',
    rw: '',
    phone: '',
    email: '',
    
    // Letter specific
    letterPurpose: '',
    businessName: '',
    businessType: '',
    businessAddress: '',
    incomeAmount: '',
    familyMembers: '',
    additionalInfo: '',
    urgentRequest: false
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchTracking, setSearchTracking] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');

  const letterTypes = [
    {
      id: 'ktp',
      name: 'Surat Pengantar KTP',
      description: 'Surat pengantar untuk pembuatan atau perpanjangan KTP',
      icon: User,
      color: 'bg-blue-100 text-blue-600',
      requirements: ['Fotokopi KK', 'Pas foto 3x4 (2 lembar)', 'Fotokopi akta kelahiran'],
      processingTime: '1-2 hari kerja',
      fee: 'Gratis'
    },
    {
      id: 'kk',
      name: 'Surat Pengantar KK',
      description: 'Surat pengantar untuk pembuatan atau perubahan Kartu Keluarga',
      icon: Home,
      color: 'bg-green-100 text-green-600',
      requirements: ['Fotokopi KTP kepala keluarga', 'Fotokopi akta nikah', 'Fotokopi akta kelahiran anak'],
      processingTime: '1-2 hari kerja',
      fee: 'Gratis'
    },
    {
      id: 'domisili',
      name: 'Surat Keterangan Domisili',
      description: 'Surat keterangan tempat tinggal/domisili',
      icon: MapPin,
      color: 'bg-purple-100 text-purple-600',
      requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Surat kontrak/sewa (jika mengontrak)'],
      processingTime: '1 hari kerja',
      fee: 'Rp 5.000'
    },
    {
      id: 'usaha',
      name: 'Surat Keterangan Usaha',
      description: 'Surat keterangan untuk keperluan usaha/UMKM',
      icon: Briefcase,
      color: 'bg-orange-100 text-orange-600',
      requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Foto lokasi usaha', 'Surat izin RT/RW'],
      processingTime: '2-3 hari kerja',
      fee: 'Rp 10.000'
    },
    {
      id: 'tidak_mampu',
      name: 'Surat Keterangan Tidak Mampu',
      description: 'Surat keterangan untuk keperluan bantuan sosial',
      icon: Heart,
      color: 'bg-red-100 text-red-600',
      requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Surat keterangan penghasilan', 'Foto rumah'],
      processingTime: '2-3 hari kerja',
      fee: 'Gratis'
    },
    {
      id: 'kelahiran',
      name: 'Surat Keterangan Kelahiran',
      description: 'Surat keterangan untuk pengurusan akta kelahiran',
      icon: User,
      color: 'bg-pink-100 text-pink-600',
      requirements: ['Fotokopi KTP orang tua', 'Fotokopi KK', 'Surat keterangan lahir dari bidan/dokter'],
      processingTime: '1 hari kerja',
      fee: 'Gratis'
    },
    {
      id: 'kematian',
      name: 'Surat Keterangan Kematian',
      description: 'Surat keterangan untuk pengurusan akta kematian',
      icon: User,
      color: 'bg-gray-100 text-gray-600',
      requirements: ['Fotokopi KTP almarhum', 'Fotokopi KK', 'Surat keterangan kematian dari dokter/RS'],
      processingTime: '1 hari kerja',
      fee: 'Gratis'
    },
    {
      id: 'pindah',
      name: 'Surat Keterangan Pindah',
      description: 'Surat keterangan untuk keperluan pindah domisili',
      icon: Home,
      color: 'bg-teal-100 text-teal-600',
      requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Surat keterangan RT/RW tujuan'],
      processingTime: '1-2 hari kerja',
      fee: 'Rp 5.000'
    },
    {
      id: 'penghasilan',
      name: 'Surat Keterangan Penghasilan',
      description: 'Surat keterangan penghasilan untuk keperluan kredit/pinjaman',
      icon: Briefcase,
      color: 'bg-yellow-100 text-yellow-600',
      requirements: ['Fotokopi KTP', 'Fotokopi KK', 'Slip gaji/keterangan usaha'],
      processingTime: '1-2 hari kerja',
      fee: 'Rp 10.000'
    },
    {
      id: 'nikah',
      name: 'Surat Pengantar Nikah',
      description: 'Surat pengantar untuk keperluan pernikahan',
      icon: Heart,
      color: 'bg-rose-100 text-rose-600',
      requirements: ['Fotokopi KTP calon pengantin', 'Fotokopi KK', 'Fotokopi akta kelahiran', 'Pas foto 4x6'],
      processingTime: '2-3 hari kerja',
      fee: 'Rp 15.000'
    }
  ];

  const mockApplications = [
    {
      id: 'SRT-2025-001',
      type: 'Surat Keterangan Domisili',
      applicant: 'Ahmad Fauzi',
      date: '2025-01-15',
      status: 'completed',
      estimatedCompletion: '2025-01-16'
    },
    {
      id: 'SRT-2025-002',
      type: 'Surat Keterangan Usaha',
      applicant: 'Siti Nurhaliza',
      date: '2025-01-16',
      status: 'in_progress',
      estimatedCompletion: '2025-01-19'
    },
    {
      id: 'SRT-2025-003',
      type: 'Surat Pengantar KTP',
      applicant: 'Budi Santoso',
      date: '2025-01-17',
      status: 'pending',
      estimatedCompletion: '2025-01-19'
    },
    {
      id: 'SRT-2025-004',
      type: 'Surat Keterangan Tidak Mampu',
      applicant: 'Rina Marlina',
      date: '2025-01-17',
      status: 'review',
      estimatedCompletion: '2025-01-20'
    }
  ];

  const statusConfig = {
    pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    review: { label: 'Sedang Ditinjau', color: 'bg-blue-100 text-blue-800', icon: Eye },
    in_progress: { label: 'Sedang Diproses', color: 'bg-orange-100 text-orange-800', icon: RefreshCw },
    completed: { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800', icon: AlertCircle }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      const newTrackingNumber = `SRT-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      setTrackingNumber(newTrackingNumber);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        fullName: '', nik: '', birthPlace: '', birthDate: '', gender: '', religion: '',
        maritalStatus: '', occupation: '', address: '', rt: '', rw: '', phone: '', email: '',
        letterPurpose: '', businessName: '', businessType: '', businessAddress: '',
        incomeAmount: '', familyMembers: '', additionalInfo: '', urgentRequest: false
      });
      setSelectedLetterType('');
    }, 2000);
  };

  const selectedLetter = letterTypes.find(letter => letter.id === selectedLetterType);

  const filteredApplications = filterStatus === 'semua' 
    ? mockApplications 
    : mockApplications.filter(app => app.status === filterStatus);

  const searchedApplications = searchTracking
    ? filteredApplications.filter(app => 
        app.id.toLowerCase().includes(searchTracking.toLowerCase()) ||
        app.applicant.toLowerCase().includes(searchTracking.toLowerCase())
      )
    : filteredApplications;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ajukan Surat Online
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Layanan Pengajuan Surat Administrasi Desa yang Mudah dan Cepat
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                Proses 1-3 Hari
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <FileText className="h-4 w-4 mr-2" />
                10+ Jenis Surat
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                Tracking Real-time
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="request" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Ajukan Surat
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Lacak Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="request">
            <div className="max-w-6xl mx-auto">
              {/* Letter Type Selection */}
              {!selectedLetterType && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pilih Jenis Surat</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {letterTypes.map((letter) => (
                      <Card 
                        key={letter.id} 
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        onClick={() => setSelectedLetterType(letter.id)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${letter.color}`}>
                              <letter.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{letter.name}</h3>
                              <p className="text-gray-600 text-sm mb-3">{letter.description}</p>
                              
                              <div className="space-y-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{letter.processingTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  <span>{letter.fee}</span>
                                </div>
                              </div>
                              
                              <Button size="sm" className="mt-3 w-full bg-blue-600 hover:bg-blue-700">
                                Pilih Surat Ini
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Form */}
              {selectedLetterType && selectedLetter && (
                <div className="space-y-8">
                  {/* Selected Letter Info */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${selectedLetter.color}`}>
                            <selectedLetter.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{selectedLetter.name}</h3>
                            <p className="text-gray-600">{selectedLetter.description}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedLetterType('')}
                          className="text-gray-600"
                        >
                          Ganti Surat
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Waktu Proses</h4>
                          <p className="text-sm text-gray-600">{selectedLetter.processingTime}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Biaya</h4>
                          <p className="text-sm text-gray-600">{selectedLetter.fee}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Persyaratan</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {selectedLetter.requirements.map((req, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <div className="font-medium mb-2">Pengajuan surat berhasil dikirim!</div>
                        <div className="text-sm">
                          Nomor tracking: <span className="font-mono font-bold">{trackingNumber}</span>
                          <br />Silakan simpan nomor ini untuk melacak status pengajuan Anda.
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Application Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Formulir Pengajuan</CardTitle>
                      <p className="text-gray-600">Lengkapi data berikut dengan benar dan sesuai dokumen resmi</p>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Pribadi</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="fullName">Nama Lengkap *</Label>
                              <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                placeholder="Masukkan nama lengkap sesuai KTP"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="nik">NIK *</Label>
                              <Input
                                id="nik"
                                value={formData.nik}
                                onChange={(e) => handleInputChange('nik', e.target.value)}
                                placeholder="16 digit NIK"
                                maxLength={16}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="birthPlace">Tempat Lahir *</Label>
                              <Input
                                id="birthPlace"
                                value={formData.birthPlace}
                                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                                placeholder="Kota/Kabupaten tempat lahir"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                              <Input
                                id="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="gender">Jenis Kelamin *</Label>
                              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="laki-laki">Laki-laki</SelectItem>
                                  <SelectItem value="perempuan">Perempuan</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="religion">Agama *</Label>
                              <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih agama" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="islam">Islam</SelectItem>
                                  <SelectItem value="kristen">Kristen</SelectItem>
                                  <SelectItem value="katolik">Katolik</SelectItem>
                                  <SelectItem value="hindu">Hindu</SelectItem>
                                  <SelectItem value="buddha">Buddha</SelectItem>
                                  <SelectItem value="konghucu">Konghucu</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="maritalStatus">Status Perkawinan *</Label>
                              <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih status perkawinan" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="belum-kawin">Belum Kawin</SelectItem>
                                  <SelectItem value="kawin">Kawin</SelectItem>
                                  <SelectItem value="cerai-hidup">Cerai Hidup</SelectItem>
                                  <SelectItem value="cerai-mati">Cerai Mati</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="occupation">Pekerjaan *</Label>
                              <Input
                                id="occupation"
                                value={formData.occupation}
                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                placeholder="Pekerjaan saat ini"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Address Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alamat</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <Label htmlFor="address">Alamat Lengkap *</Label>
                              <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Jalan, nomor rumah, kelurahan"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="rt">RT *</Label>
                              <Input
                                id="rt"
                                value={formData.rt}
                                onChange={(e) => handleInputChange('rt', e.target.value)}
                                placeholder="001"
                                maxLength={3}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="rw">RW *</Label>
                              <Input
                                id="rw"
                                value={formData.rw}
                                onChange={(e) => handleInputChange('rw', e.target.value)}
                                placeholder="001"
                                maxLength={3}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">Nomor Telepon *</Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="08xxxxxxxxxx"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="email@example.com"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Letter Specific Fields */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keperluan Surat</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="letterPurpose">Tujuan/Keperluan Surat *</Label>
                              <Textarea
                                id="letterPurpose"
                                value={formData.letterPurpose}
                                onChange={(e) => handleInputChange('letterPurpose', e.target.value)}
                                placeholder="Jelaskan untuk keperluan apa surat ini digunakan"
                                required
                              />
                            </div>

                            {/* Business specific fields */}
                            {(selectedLetterType === 'usaha' || selectedLetterType === 'penghasilan') && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="businessName">Nama Usaha</Label>
                                  <Input
                                    id="businessName"
                                    value={formData.businessName}
                                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                                    placeholder="Nama usaha/bisnis"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="businessType">Jenis Usaha</Label>
                                  <Input
                                    id="businessType"
                                    value={formData.businessType}
                                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                                    placeholder="Bidang usaha"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label htmlFor="businessAddress">Alamat Usaha</Label>
                                  <Textarea
                                    id="businessAddress"
                                    value={formData.businessAddress}
                                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                                    placeholder="Alamat lokasi usaha"
                                  />
                                </div>
                              </div>
                            )}

                            {selectedLetterType === 'penghasilan' && (
                              <div>
                                <Label htmlFor="incomeAmount">Perkiraan Penghasilan per Bulan</Label>
                                <Input
                                  id="incomeAmount"
                                  value={formData.incomeAmount}
                                  onChange={(e) => handleInputChange('incomeAmount', e.target.value)}
                                  placeholder="Rp 0"
                                />
                              </div>
                            )}

                            {selectedLetterType === 'kk' && (
                              <div>
                                <Label htmlFor="familyMembers">Jumlah Anggota Keluarga</Label>
                                <Input
                                  id="familyMembers"
                                  type="number"
                                  value={formData.familyMembers}
                                  onChange={(e) => handleInputChange('familyMembers', e.target.value)}
                                  placeholder="Jumlah anggota keluarga"
                                />
                              </div>
                            )}

                            <div>
                              <Label htmlFor="additionalInfo">Informasi Tambahan</Label>
                              <Textarea
                                id="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                                placeholder="Informasi tambahan yang diperlukan"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="urgentRequest"
                                checked={formData.urgentRequest}
                                onChange={(e) => handleInputChange('urgentRequest', e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor="urgentRequest" className="text-sm">
                                Pengajuan Mendesak (akan diproses lebih cepat dengan biaya tambahan)
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t">
                          <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700" 
                            disabled={submitStatus === 'loading'}
                          >
                            {submitStatus === 'loading' ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Mengirim Pengajuan...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Kirim Pengajuan
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tracking">
            <div className="max-w-6xl mx-auto">
              {/* Search and Filter */}
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="searchTracking">Cari Berdasarkan Nomor Tracking atau Nama</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="searchTracking"
                          value={searchTracking}
                          onChange={(e) => setSearchTracking(e.target.value)}
                          placeholder="SRT-2025-001 atau nama pemohon"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="filterStatus">Filter Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semua">Semua Status</SelectItem>
                          <SelectItem value="pending">Menunggu</SelectItem>
                          <SelectItem value="review">Sedang Ditinjau</SelectItem>
                          <SelectItem value="in_progress">Sedang Diproses</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                          <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applications List */}
              <div className="space-y-4">
                {searchedApplications.map((application) => {
                  const status = statusConfig[application.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  
                  return (
                    <Card key={application.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{application.type}</h3>
                              <Badge className={status.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{application.applicant}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Diajukan: {application.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Estimasi selesai: {application.estimatedCompletion}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">No. Tracking</div>
                              <div className="text-lg font-mono font-bold text-blue-600">{application.id}</div>
                            </div>
                            {application.status === 'completed' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Download className="h-3 w-3 mr-1" />
                                Unduh
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {searchedApplications.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data ditemukan</h3>
                    <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter status</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Jam Pelayanan</h3>
              <p className="text-sm text-gray-600">
                Senin - Kamis: 08:00 - 16:00<br/>
                Jumat: 08:00 - 11:30<br/>
                Sabtu - Minggu: Tutup
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Bantuan</h3>
              <p className="text-sm text-gray-600">
                Telepon: (022) 1234-5678<br/>
                WhatsApp: 0812-3456-7890<br/>
                Email: admin@desacilame.com
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Info className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Catatan Penting</h3>
              <p className="text-sm text-gray-600">
                Pastikan data yang diisi benar<br/>
                Siapkan dokumen persyaratan<br/>
                Simpan nomor tracking dengan baik
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}