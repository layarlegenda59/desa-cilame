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
  Eye, 
  Calendar,
  User,
  Filter,
  MoreHorizontal
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

interface Berita {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export default function BeritaManagement() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [filteredBerita, setFilteredBerita] = useState<Berita[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<Berita | null>(null);
  const [deleteBeritaId, setDeleteBeritaId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    excerpt: string;
    category: string;
    status: 'draft' | 'published' | 'archived';
  }>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    status: 'draft'
  });

  // Mock data
  useEffect(() => {
    const mockData: Berita[] = [
      {
        id: '1',
        title: 'Pembangunan Jalan Desa Cilame Tahap 2',
        content: 'Pembangunan jalan desa tahap 2 telah dimulai dengan anggaran dari dana desa...',
        excerpt: 'Pembangunan jalan desa tahap 2 telah dimulai dengan anggaran dari dana desa',
        author: 'Admin Desa',
        status: 'published',
        category: 'Pembangunan',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        views: 245
      },
      {
        id: '2',
        title: 'Program Bantuan Sosial untuk Warga Kurang Mampu',
        content: 'Program bantuan sosial berupa sembako dan uang tunai akan disalurkan...',
        excerpt: 'Program bantuan sosial berupa sembako dan uang tunai akan disalurkan',
        author: 'Admin Desa',
        status: 'published',
        category: 'Sosial',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
        views: 189
      },
      {
        id: '3',
        title: 'Pelatihan UMKM Digital Marketing',
        content: 'Pelatihan digital marketing untuk pelaku UMKM akan diadakan...',
        excerpt: 'Pelatihan digital marketing untuk pelaku UMKM akan diadakan',
        author: 'Admin Desa',
        status: 'draft',
        category: 'Ekonomi',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-08',
        views: 67
      }
    ];
    
    setTimeout(() => {
      setBerita(mockData);
      setFilteredBerita(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter berita
  useEffect(() => {
    let filtered = berita;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredBerita(filtered);
  }, [berita, searchTerm, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBerita) {
      // Update existing berita
      const updatedBerita = berita.map(item => 
        item.id === editingBerita.id 
          ? {
              ...item,
              ...formData,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : item
      );
      setBerita(updatedBerita);
      toast({
        title: "Berhasil",
        description: "Berita berhasil diperbarui",
      });
    } else {
      // Create new berita
      const newBerita: Berita = {
        id: Date.now().toString(),
        ...formData,
        author: 'Admin Desa',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0
      };
      setBerita([newBerita, ...berita]);
      toast({
        title: "Berhasil",
        description: "Berita baru berhasil ditambahkan",
      });
    }
    
    resetForm();
  };

  const handleEdit = (item: Berita) => {
    setEditingBerita(item);
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      category: item.category,
      status: item.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBerita(berita.filter(item => item.id !== id));
    setDeleteBeritaId(null);
    toast({
      title: "Berhasil",
      description: "Berita berhasil dihapus",
      variant: "destructive"
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      status: 'draft'
    });
    setEditingBerita(null);
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Dipublikasi</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Diarsipkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manajemen Berita</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Berita</h1>
          <p className="text-gray-600 mt-1">Kelola semua berita dan artikel desa</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBerita ? 'Edit Berita' : 'Tambah Berita Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingBerita ? 'Perbarui informasi berita' : 'Buat berita baru untuk dipublikasikan'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Berita</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Masukkan judul berita"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Ringkasan singkat berita"
                  rows={2}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Konten</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Tulis konten berita lengkap"
                  rows={6}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pembangunan">Pembangunan</SelectItem>
                      <SelectItem value="Sosial">Sosial</SelectItem>
                      <SelectItem value="Ekonomi">Ekonomi</SelectItem>
                      <SelectItem value="Pendidikan">Pendidikan</SelectItem>
                      <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                      <SelectItem value="Umum">Umum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Dipublikasi</SelectItem>
                      <SelectItem value="archived">Diarsipkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingBerita ? 'Perbarui' : 'Simpan'}
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
                  placeholder="Cari berita..."
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
                  <SelectItem value="published">Dipublikasi</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Diarsipkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Berita List */}
      <div className="space-y-4">
        {filteredBerita.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada berita ditemukan</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredBerita.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {item.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.views} views
                      </div>
                      <Badge variant="outline">{item.category}</Badge>
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
                        onClick={() => setDeleteBeritaId(item.id)}
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
      <AlertDialog open={!!deleteBeritaId} onOpenChange={() => setDeleteBeritaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Berita</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteBeritaId && handleDelete(deleteBeritaId)}
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