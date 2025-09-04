'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Pengumuman {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent' | 'success';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive' | 'expired';
  author: string;
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  targetAudience: string;
}

export default function PengumumanManagement() {
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [filteredPengumuman, setFilteredPengumuman] = useState<Pengumuman[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPengumuman, setEditingPengumuman] = useState<Pengumuman | null>(null);
  const [deletePengumumanId, setDeletePengumumanId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: 'info' | 'warning' | 'urgent' | 'success';
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'inactive' | 'expired';
    expiryDate: string;
    targetAudience: string;
  }>({
    title: '',
    content: '',
    type: 'info',
    priority: 'medium',
    status: 'active',
    expiryDate: '',
    targetAudience: ''
  });

  // Mock data
  useEffect(() => {
    const mockData: Pengumuman[] = [
      {
        id: '1',
        title: 'Rapat Desa Bulan Januari 2024',
        content: 'Mengundang seluruh warga untuk menghadiri rapat desa yang akan membahas program kerja tahun 2024. Rapat akan dilaksanakan pada hari Minggu, 28 Januari 2024 pukul 09.00 WIB di Balai Desa.',
        type: 'info',
        priority: 'high',
        status: 'active',
        author: 'Admin Desa',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        expiryDate: '2024-01-28',
        targetAudience: 'Seluruh Warga'
      },
      {
        id: '2',
        title: 'Penutupan Jalan Sementara untuk Perbaikan',
        content: 'Jalan utama desa akan ditutup sementara untuk perbaikan infrastruktur. Penutupan berlangsung dari tanggal 20-25 Januari 2024. Mohon gunakan jalur alternatif.',
        type: 'warning',
        priority: 'high',
        status: 'active',
        author: 'Admin Desa',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
        expiryDate: '2024-01-25',
        targetAudience: 'Pengguna Jalan'
      },
      {
        id: '3',
        title: 'Pendaftaran Bantuan Sosial Tahap 2',
        content: 'Pendaftaran bantuan sosial tahap 2 telah dibuka. Warga yang memenuhi syarat dapat mendaftar di kantor desa dengan membawa KTP dan KK.',
        type: 'success',
        priority: 'medium',
        status: 'active',
        author: 'Admin Desa',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-08',
        expiryDate: '2024-02-08',
        targetAudience: 'Warga Kurang Mampu'
      },
      {
        id: '4',
        title: 'Pemadaman Listrik Terjadwal',
        content: 'PLN akan melakukan pemadaman listrik terjadwal pada hari Sabtu, 20 Januari 2024 pukul 08.00-16.00 WIB untuk maintenance jaringan.',
        type: 'urgent',
        priority: 'high',
        status: 'expired',
        author: 'Admin Desa',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-05',
        expiryDate: '2024-01-20',
        targetAudience: 'Seluruh Warga'
      }
    ];
    
    setTimeout(() => {
      setPengumuman(mockData);
      setFilteredPengumuman(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter pengumuman
  useEffect(() => {
    let filtered = pengumuman;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    setFilteredPengumuman(filtered);
  }, [pengumuman, searchTerm, statusFilter, typeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPengumuman) {
      // Update existing pengumuman
      const updatedPengumuman = pengumuman.map(item => 
        item.id === editingPengumuman.id 
          ? {
              ...item,
              ...formData,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : item
      );
      setPengumuman(updatedPengumuman);
      toast({
        title: "Berhasil",
        description: "Pengumuman berhasil diperbarui",
      });
    } else {
      // Create new pengumuman
      const newPengumuman: Pengumuman = {
        id: Date.now().toString(),
        ...formData,
        author: 'Admin Desa',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setPengumuman([newPengumuman, ...pengumuman]);
      toast({
        title: "Berhasil",
        description: "Pengumuman baru berhasil ditambahkan",
      });
    }
    
    resetForm();
  };

  const handleEdit = (item: Pengumuman) => {
    setEditingPengumuman(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      priority: item.priority,
      status: item.status,
      expiryDate: item.expiryDate || '',
      targetAudience: item.targetAudience
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPengumuman(pengumuman.filter(item => item.id !== id));
    setDeletePengumumanId(null);
    toast({
      title: "Berhasil",
      description: "Pengumuman berhasil dihapus",
      variant: "destructive"
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      priority: 'medium',
      status: 'active',
      expiryDate: '',
      targetAudience: ''
    });
    setEditingPengumuman(null);
    setIsDialogOpen(false);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800"><Info className="h-3 w-3 mr-1" />Info</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Peringatan</Badge>;
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Mendesak</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Sukses</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Tidak Aktif</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Kedaluwarsa</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Tinggi</Badge>;
      case 'medium':
        return <Badge variant="secondary">Sedang</Badge>;
      case 'low':
        return <Badge variant="outline">Rendah</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manajemen Pengumuman</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengumuman</h1>
          <p className="text-gray-600 mt-1">Kelola pengumuman dan pemberitahuan untuk warga</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPengumuman ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingPengumuman ? 'Perbarui informasi pengumuman' : 'Buat pengumuman baru untuk warga'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Pengumuman</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Masukkan judul pengumuman"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Isi Pengumuman</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Tulis isi pengumuman lengkap"
                  rows={6}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Peringatan</SelectItem>
                      <SelectItem value="urgent">Mendesak</SelectItem>
                      <SelectItem value="success">Sukses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      <SelectItem value="expired">Kedaluwarsa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Tanggal Kedaluwarsa</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audiens</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="Contoh: Seluruh Warga, Pelaku UMKM, dll"
                  required
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingPengumuman ? 'Perbarui' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari pengumuman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  <SelectItem value="expired">Kedaluwarsa</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Peringatan</SelectItem>
                  <SelectItem value="urgent">Mendesak</SelectItem>
                  <SelectItem value="success">Sukses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pengumuman List */}
      <div className="space-y-4">
        {filteredPengumuman.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada pengumuman ditemukan</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPengumuman.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      {getTypeBadge(item.type)}
                      {getStatusBadge(item.status)}
                      {getPriorityBadge(item.priority)}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {item.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </div>
                      {item.expiryDate && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          Berlaku hingga {new Date(item.expiryDate).toLocaleDateString('id-ID')}
                        </div>
                      )}
                      <Badge variant="outline">{item.targetAudience}</Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeletePengumumanId(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePengumumanId} onOpenChange={() => setDeletePengumumanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengumuman</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletePengumumanId && handleDelete(deletePengumumanId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}