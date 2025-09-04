'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText, Download, Phone, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function TransparansiPage() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPeriod, setSelectedPeriod] = useState('annual');

  // Sample financial data
  const financialData = {
    totalBudget: 2500000000,
    incomeRealization: 2200000000,
    expenseRealization: 1950000000,
    remainingBudget: 250000000
  };

  const incomeBreakdown = [
    { name: 'Dana Desa', value: 1200000000, color: '#3b82f6' },
    { name: 'Alokasi Dana Desa', value: 600000000, color: '#10b981' },
    { name: 'Bagi Hasil Pajak', value: 250000000, color: '#f59e0b' },
    { name: 'Pendapatan Asli Desa', value: 150000000, color: '#ef4444' }
  ];

  const expenseBreakdown = [
    { name: 'Bidang Penyelenggaraan Pemerintahan Desa', amount: 650000000 },
    { name: 'Bidang Pelaksanaan Pembangunan Desa', amount: 780000000 },
    { name: 'Bidang Pembinaan Kemasyarakatan', amount: 320000000 },
    { name: 'Bidang Pemberdayaan Masyarakat', amount: 200000000 }
  ];

  const developmentPrograms = [
    {
      id: 1,
      name: 'Pembangunan Jalan Desa',
      budget: 500000000,
      progress: 85,
      status: 'ongoing',
      description: 'Pembangunan dan perbaikan jalan utama desa sepanjang 2.5 km'
    },
    {
      id: 2,
      name: 'Renovasi Balai Desa',
      budget: 200000000,
      progress: 100,
      status: 'completed',
      description: 'Renovasi total balai desa untuk meningkatkan pelayanan masyarakat'
    },
    {
      id: 3,
      name: 'Program Air Bersih',
      budget: 150000000,
      progress: 60,
      status: 'ongoing',
      description: 'Pembangunan sistem distribusi air bersih untuk 200 KK'
    },
    {
      id: 4,
      name: 'Pelatihan UMKM',
      budget: 80000000,
      progress: 100,
      status: 'completed',
      description: 'Program pelatihan dan pemberdayaan UMKM untuk 150 peserta'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {t('transparency.title') || 'Transparansi Keuangan Desa'}
            </h1>
            <p className="text-xl text-blue-100">
              {t('transparency.subtitle') || 'Keterbukaan informasi keuangan dan pelaksanaan program pembangunan untuk kepercayaan masyarakat'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t('transparency.year') || 'Tahun:'}
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t('transparency.period') || 'Periode:'}
            </label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">{t('transparency.annual') || 'Tahunan'}</SelectItem>
                <SelectItem value="q4">{t('transparency.quarter_4') || 'Triwulan IV'}</SelectItem>
                <SelectItem value="q3">{t('transparency.quarter_3') || 'Triwulan III'}</SelectItem>
                <SelectItem value="q2">{t('transparency.quarter_2') || 'Triwulan II'}</SelectItem>
                <SelectItem value="q1">{t('transparency.quarter_1') || 'Triwulan I'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('transparency.total_budget') || 'Total Anggaran'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(financialData.totalBudget)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('transparency.income_realization') || 'Realisasi Pendapatan'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(financialData.incomeRealization)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">88%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('transparency.expense_realization') || 'Realisasi Belanja'}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(financialData.expenseRealization)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-orange-600 mr-1" />
                    <span className="text-sm text-orange-600">78%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('transparency.remaining_budget') || 'Sisa Anggaran'}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(financialData.remainingBudget)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-purple-600">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Financial Information */}
        <Tabs defaultValue="income" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="income">
              {t('transparency.income_breakdown') || 'Rincian Pendapatan'}
            </TabsTrigger>
            <TabsTrigger value="expense">
              {t('transparency.expense_breakdown') || 'Rincian Belanja'}
            </TabsTrigger>
            <TabsTrigger value="programs">
              {t('transparency.program_progress') || 'Progress Program Pembangunan'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Komposisi Pendapatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incomeBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {incomeBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detail Pendapatan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incomeBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expense" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rincian Belanja per Bidang</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={expenseBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <div className="grid gap-6">
              {developmentPrograms.map((program) => (
                <Card key={program.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{program.name}</h3>
                          <Badge 
                            variant={program.status === 'completed' ? 'default' : 'secondary'}
                            className={program.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            {program.status === 'completed' ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t('transparency.completed') || 'Selesai'}
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                {t('transparency.ongoing') || 'Berlangsung'}
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{program.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{program.progress}%</span>
                            </div>
                            <Progress value={program.progress} className="h-2" />
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Anggaran</p>
                            <p className="font-semibold">{formatCurrency(program.budget)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Financial Reports Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('transparency.financial_reports') || 'Laporan Keuangan'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Laporan Realisasi APBDes 2024', date: '31 Desember 2024', downloads: 245 },
                { name: 'Laporan Keuangan Triwulan IV', date: '31 Desember 2024', downloads: 189 },
                { name: 'Laporan Pertanggungjawaban Kepala Desa', date: '15 Januari 2025', downloads: 156 }
              ].map((report, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium mb-2">{report.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{report.date}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {report.downloads} {t('transparency.downloads') || 'unduhan'}
                    </span>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {t('transparency.need_more_info') || 'Butuh Informasi Lebih Lanjut?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('transparency.contact_finance') || 'Hubungi Bagian Keuangan Desa untuk penjelasan detail mengenai laporan keuangan'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t('transparency.ask_question') || 'Ajukan Pertanyaan'}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('transparency.schedule_consultation') || 'Jadwalkan Konsultasi'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}