'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Megaphone, 
  Store, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Plus,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import Link from 'next/link';

interface StatsData {
  totalBerita: number;
  totalPengumuman: number;
  totalUMKM: number;
  totalPerangkat: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    time: string;
    status: 'success' | 'warning' | 'info';
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalBerita: 0,
    totalPengumuman: 0,
    totalUMKM: 0,
    totalPerangkat: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading data - dalam implementasi nyata akan fetch dari API
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalBerita: 25,
        totalPengumuman: 12,
        totalUMKM: 18,
        totalPerangkat: 8,
        recentActivity: [
          {
            id: '1',
            type: 'Berita',
            title: 'Berita baru tentang pembangunan jalan desa',
            time: '2 jam yang lalu',
            status: 'success'
          },
          {
            id: '2',
            type: 'Pengumuman',
            title: 'Pengumuman rapat desa bulan ini',
            time: '5 jam yang lalu',
            status: 'info'
          },
          {
            id: '3',
            type: 'UMKM',
            title: 'UMKM baru terdaftar: Warung Makan Sederhana',
            time: '1 hari yang lalu',
            status: 'success'
          },
          {
            id: '4',
            type: 'Perangkat',
            title: 'Update data perangkat desa',
            time: '2 hari yang lalu',
            status: 'warning'
          }
        ]
      });
      setIsLoading(false);
    };

    loadData();
  }, []);

  const statsCards = [
    {
      title: 'Total Berita',
      value: stats.totalBerita,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/berita'
    },
    {
      title: 'Total Pengumuman',
      value: stats.totalPengumuman,
      icon: Megaphone,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/pengumuman'
    },
    {
      title: 'Total UMKM',
      value: stats.totalUMKM,
      icon: Store,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/umkm'
    },
    {
      title: 'Perangkat Desa',
      value: stats.totalPerangkat,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/admin/perangkat'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di panel admin Desa Cilame</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-300">
            <Activity className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} href={card.href}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${card.bgColor}`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Lihat detail</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                Lihat Semua Aktivitas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/admin/berita">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Tambah Berita Baru
                </Button>
              </Link>
              <Link href="/admin/pengumuman">
                <Button variant="outline" className="w-full justify-start">
                  <Megaphone className="h-4 w-4 mr-2" />
                  Buat Pengumuman
                </Button>
              </Link>
              <Link href="/admin/umkm">
                <Button variant="outline" className="w-full justify-start">
                  <Store className="h-4 w-4 mr-2" />
                  Daftarkan UMKM
                </Button>
              </Link>
              <Link href="/admin/perangkat">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Kelola Perangkat Desa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistik Konten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Berita</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{stats.totalBerita}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pengumuman</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{stats.totalPengumuman}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">UMKM</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{stats.totalUMKM}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jadwal Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Rapat Koordinasi</p>
                  <p className="text-xs text-gray-500">09:00 - 11:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Pelayanan Masyarakat</p>
                  <p className="text-xs text-gray-500">13:00 - 16:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Review Laporan</p>
                  <p className="text-xs text-gray-500">16:00 - 17:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}