'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  TrendingUp, 
  DollarSign, 
  PieChart,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

export default function TransparansiPage() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPeriod, setSelectedPeriod] = useState('tahunan');

  const years = ['2024', '2023', '2022'];
  const periods = [
    { id: 'tahunan', label: t('transparency.annual') },
    { id: 'triwulan-4', label: t('transparency.quarter_4') },
    { id: 'triwulan-3', label: t('transparency.quarter_3') },
    { id: 'triwulan-2', label: t('transparency.quarter_2') },
    { id: 'triwulan-1', label: t('transparency.quarter_1') }
  ];

  const budgetData = {
    totalBudget: 2850000000,
    totalIncome: 2850000000,
    totalExpense: 2456000000,
    remainingBudget: 394000000,
    incomeRealization: 100,
    expenseRealization: 86.2
  };

  const incomeCategories = [
    { name: 'Dana Desa (DD)', budget: 1200000000, realization: 1200000000, percentage: 100 },
    { name: 'Alokasi Dana Desa (ADD)', budget: 850000000, realization: 850000000, percentage: 100 },
    { name: 'Bagi Hasil Pajak & Retribusi', budget: 350000000, realization: 350000000, percentage: 100 },
    { name: 'Bantuan Keuangan Provinsi', budget: 200000000, realization: 200000000, percentage: 100 },
    { name: 'Bantuan Keuangan Kabupaten', budget: 150000000, realization: 150000000, percentage: 100 },
    { name: 'Pendapatan Asli Desa', budget: 100000000, realization: 100000000, percentage: 100 }
  ];

  const expenseCategories = [
    { name: 'Penyelenggaraan Pemerintahan Desa', budget: 890000000, realization: 756000000, percentage: 84.9 },
    { name: 'Pelaksanaan Pembangunan Desa', budget: 950000000, realization: 845000000, percentage: 88.9 },
    { name: 'Pembinaan Kemasyarakatan', budget: 350000000, realization: 298000000, percentage: 85.1 },
    { name: 'Pemberdayaan Masyarakat', budget: 400000000, realization: 342000000, percentage: 85.5 },
    { name: 'Penanggulangan Bencana & Darurat', budget: 260000000, realization: 215000000, percentage: 82.7 }
  ];

  const programs = [
    {
      name: 'Pembangunan Jalan Desa',
      budget: 450000000,
      realization: 425000000,
      progress: 94.4,
      status: 'Selesai',
      description: 'Pembangunan dan perbaikan jalan sepanjang 2.5 km'
    },
    {
      name: 'Program Air Bersih',
      budget: 275000000,
      realization: 240000000,
      progress: 87.3,
      status: 'Berlangsung',
      description: 'Instalasi sistem air bersih untuk 150 rumah'
    },
    {
      name: 'Bantuan Sosial PKH',
      budget: 180000000,
      realization: 180000000,
      progress: 100,
      status: 'Selesai',
      description: 'Penyaluran bantuan untuk 120 KK penerima'
    },
    {
      name: 'Pelatihan UMKM',
      budget: 125000000,
      realization: 98000000,
      progress: 78.4,
      status: 'Berlangsung',
      description: 'Pelatihan dan pendampingan 85 pelaku UMKM'
    }
  ];

  const reports = [
    {
      title: 'Laporan Realisasi APBDes Tahun 2024',
      description: 'Laporan lengkap realisasi anggaran pendapatan dan belanja desa',
      date: '2025-01-15',
      size: '4.2 MB',
      downloads: 342
    },
    {
      title: 'Laporan Keuangan Triwulan IV 2024',
      description: 'Laporan keuangan periode Oktober-Desember 2024',
      date: '2025-01-10',
      size: '2.8 MB',
      downloads: 189
    },
    {
      title: 'Laporan Pelaksanaan Program Pembangunan',
      description: 'Progress dan realisasi program pembangunan desa 2024',
      date: '2025-01-05',
      size: '5.1 MB',
      downloads: 156
    },
    {
      title: 'Laporan Pertanggungjawaban Kades 2024',
      description: 'Laporan pertanggungjawaban kepala desa tahun 2024',
      date: '2024-12-31',
      size: '3.6 MB',
      downloads: 278
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Transparansi Keuangan Desa</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Keterbukaan informasi keuangan dan pelaksanaan program pembangunan untuk kepercayaan masyarakat
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <label className="font-medium">{t('transparency.year')}</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="font-medium">{t('transparency.period')}</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {periods.map(period => (
                  <option key={period.id} value={period.id}>{period.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('transparency.total_budget')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(budgetData.totalBudget)}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('transparency.income_realization')}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {budgetData.incomeRealization}%
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('transparency.expense_realization')}</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {budgetData.expenseRealization}%
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <PieChart className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t('transparency.remaining_budget')}</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(budgetData.remainingBudget)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                {t('transparency.income_breakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-700">{category.name}</p>
                      <span className="text-sm text-green-600 font-medium">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Target: {formatCurrency(category.budget)}</span>
                      <span>Realisasi: {formatCurrency(category.realization)}</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                {t('transparency.expense_breakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-700">{category.name}</p>
                      <span className="text-sm text-orange-600 font-medium">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Anggaran: {formatCurrency(category.budget)}</span>
                      <span>Realisasi: {formatCurrency(category.realization)}</span>
                    </div>
                    <Progress 
                      value={category.percentage} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Programs Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
              {t('transparency.program_progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((program, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{program.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      program.status === t('transparency.completed')
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {program.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {program.progress}%</span>
                      <span>{formatCurrency(program.realization)} / {formatCurrency(program.budget)}</span>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    {program.status === t('transparency.completed') ? (
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                    )}
                    <span>
                      {program.status === t('transparency.completed')
                        ? t('transparency.program_completed')
                        : t('transparency.program_ongoing')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2 text-purple-600" />
              {t('transparency.financial_reports')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>{new Date(report.date).toLocaleDateString('id-ID')}</span>
                        <span>{report.size}</span>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{report.downloads} {t('transparency.downloads')}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      {t('info.download')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="bg-green-600 rounded-lg p-8 mt-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">{t('transparency.need_more_info')}</h2>
          <p className="text-green-100 mb-6">
            {t('transparency.contact_finance')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              <FileText className="h-4 w-4 mr-2" />
              {t('transparency.ask_question')}
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              {t('transparency.schedule_consultation')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}