'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone,
  Mail,
  User,
  Filter,
  MoreHorizontal,
  MapPin,
  Calendar,
  Users
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

interface Perangkat {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  status: 'active' | 'inactive' | 'retired';
  photo?: string;
  description: string;
  education: string;
  experience: string;
}

export default function PerangkatManagement() {
  const [perangkat, setPerangkat] = useState<Perangkat[]>([]);
  const [filteredPerangkat, setFilteredPerangkat] = useState<Perangkat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPerangkat, setEditingPerangkat] = useState<Perangkat | null>(null);
  const [deletePerangkatId, setDeletePerangkatId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    address: '',
    startDate: '',
    status: 'active' as const,
    description: '',
    education: '',
    experience: ''
  });

  // Mock data
  useEffect(() => {
    const mockData: Perangkat[] = [
      {
        id: '1',
        name: 'H. Ahmad Suryadi, S.Sos',
        position: 'Kepala Desa',
        department: 'Pemerintahan',
        email: 'kades@desacilame.com',
        phone: '0812-3456-7890',
        address: 'Jl. Raya Cilame No. 123',
        startDate: '2020-01-15',
        status: 'active',
        description: 'Memimpin pemerintahan desa dan bertanggung jawab atas seluruh kegiatan administrasi desa.',
        education: 'S1 Ilmu Sosial',
        experience: '15 tahun di bidang pemerintahan'
      },
      {
        id: '2',
        name: 'Siti Nurhaliza, S.AP',
        position: 'Sekretaris Desa',
        department: 'Sekretariat',
        email: 'sekdes@desacilame.com',
        phone: '0812-3456-7891',
        address: 'Jl. Mawar No. 45',
        startDate: '2019-03-10',
        status: 'active',
        description: 'Mengelola administrasi dan dokumentasi desa serta membantu kepala desa.',
        education: 'S1 Administrasi Publik',
        experience: '12 tahun di bidang administrasi'
      },
      {
        id: '3',
        name: 'Budi Santoso, S.H',
        position: 'Kaur Pemerintahan',
        department: 'Pemerintahan',
        email: 'pemerintahan@desacilame.com',
        phone: '0812-3456-7892',
        address: 'Jl. Melati No. 67',
        startDate: '2018-06-20',
        status: 'active',
        description: 'Menangani urusan pemerintahan, kependudukan, dan pelayanan masyarakat.',
        education: 'S1 Hukum',
        experience: '10 tahun di bidang hukum dan pemerintahan'
      },
      {
        id: '4',
        name: 'Rina Wati, S.Sos',
        position: 'Kaur Kesejahteraan',
        department: 'Kesejahteraan',
        email: 'kesejahteraan@desacilame.com',
        phone: '0812-3456-7893',
        address: 'Jl. Anggrek No. 89',
        startDate: '2019-09-15',
        status: 'active',
        description: 'Mengelola program kesejahteraan sosial dan pemberdayaan masyarakat.',
        education: 'S1 Ilmu Sosial',
        experience: '8 tahun di bidang sosial kemasyarakatan'
      },
      {
        id: '5',
        name: 'Dedi Kurniawan, S.T',
        position: 'Kaur Pembangunan',
        department: 'Pembangunan',
        email: 'perencanaan@desacilame.com',
        phone: '0812-3456-7894',
        address: 'Jl. Dahlia No. 12',
        startDate: '2020-02-01',
        status: 'active',
        description: 'Merencanakan dan mengawasi pembangunan infrastruktur desa.',
        education: 'S1 Teknik Sipil',
        experience: '7 tahun di bidang konstruksi dan perencanaan'
      },
      {
        id: '6',
        name: 'Maya Sari, S.E',
        position: 'Kaur Keuangan',
        department: 'Keuangan',
        email: 'keuangan@desacilame.com',
        phone: '0812-3456-7895',
        address: 'Jl. Kenanga No. 34',
        startDate: '2018-11-10',
        status: 'active',
        description: 'Mengelola keuangan desa dan pelaporan anggaran.',
        education: 'S1 Ekonomi',
        experience: '9 tahun di bidang keuangan dan akuntansi'
      }
    ];
    
    setTimeout(() => {
      setPerangkat(mockData);
      setFilteredPerangkat(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter perangkat
  useEffect(() => {
    let filtered = perangkat;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(item => item.department === departmentFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredPerangkat(filtered);
  }, [perangkat, searchTerm, departmentFilter, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPerangkat) {
      // Update existing perangkat
      const updatedPerangkat = perangkat.map(item => 
        item.id === editingPerangkat.id 
          ? { ...item, ...formData }
          : item
      );
      setPerangkat(updatedPerangkat);
      toast({
        title: "Berhasil",
        description: "Data perangkat berhasil diperbarui",
      });
    } else {
      // Create new perangkat
      const newPerangkat: Perangkat = {
        id: Date.now().toString(),
        ...formData
      };
      setPerangkat([newPerangkat, ...perangkat]);
      toast({
        title: "Berhasil",
        description: "Perangkat baru berhasil ditambahkan",
      });
    }
    
    resetForm();
  };

  const handleEdit = (item: Perangkat) => {
    setEditingPerangkat(item);
    setFormData({
      name: item.name,
      position: item.position,
      department: item.department,
      email: item.email,
      phone: item.phone,
      address: item.address,
      startDate: item.startDate,
      status: item.status,
      description: item.description,
      education: item.education,
      experience: item.experience
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPerangkat(perangkat.filter(item => item.id !== id));
    setDeletePerangkatId(null);
    toast({
      title: "Berhasil",
      description: "Data perangkat berhasil dihapus",
      variant: "destructive"
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      address: '',
      startDate: '',
      status: 'active',
      description: '',
      education: '',
      experience: ''
    });
    setEditingPerangkat(null);
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Tidak Aktif</Badge>;
      case 'retired':
        return <Badge className="bg-gray-100 text-gray-800">Pensiun</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Pemerintahan':
        return 'bg-blue-100 text-blue-800';
      case 'Sekretariat':
        return 'bg-purple-100 text-purple-800';
      case 'Kesejahteraan':
        return 'bg-green-100 text-green-800';
      case 'Pembangunan':
        return 'bg-orange-100 text-orange-800';
      case 'Keuangan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manajemen Perangkat Desa</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Perangkat Desa</h1>
          <p className="text-gray-600 mt-1">Kelola data perangkat dan struktur organisasi desa</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Perangkat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPerangkat ? 'Edit Perangkat Desa' : 'Tambah Perangkat Desa'}
              </DialogTitle>
              <DialogDescription>
                {editingPerangkat ? 'Perbarui informasi perangkat desa' : 'Tambahkan perangkat desa baru'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Jabatan</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="Contoh: Kepala Desa, Sekretaris Desa"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Bidang</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bidang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pemerintahan">Pemerintahan</SelectItem>
                      <SelectItem value="Sekretariat">Sekretariat</SelectItem>
                      <SelectItem value="Kesejahteraan">Kesejahteraan</SelectItem>
                      <SelectItem value="Pembangunan">Pembangunan</SelectItem>
                      <SelectItem value="Keuangan">Keuangan</SelectItem>
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
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      <SelectItem value="retired">Pensiun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@desacilame.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="0812-3456-7890"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai Bertugas</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Pendidikan</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    placeholder="Contoh: S1 Administrasi Publik"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Alamat lengkap"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Pengalaman</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="Pengalaman kerja dan keahlian"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Tugas</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Deskripsi tugas dan tanggung jawab"
                  rows={3}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingPerangkat ? 'Perbarui' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Perangkat</p>
                <p className="text-2xl font-bold text-gray-900">{perangkat.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {perangkat.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tidak Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {perangkat.filter(p => p.status === 'inactive').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bidang</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(perangkat.map(p => p.department)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari perangkat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Bidang</SelectItem>
                  <SelectItem value="Pemerintahan">Pemerintahan</SelectItem>
                  <SelectItem value="Sekretariat">Sekretariat</SelectItem>
                  <SelectItem value="Kesejahteraan">Kesejahteraan</SelectItem>
                  <SelectItem value="Pembangunan">Pembangunan</SelectItem>
                  <SelectItem value="Keuangan">Keuangan</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  <SelectItem value="retired">Pensiun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Perangkat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPerangkat.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada perangkat ditemukan</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPerangkat.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={item.photo} />
                      <AvatarFallback>
                        {item.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.position}</p>
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
                        onClick={() => setDeletePerangkatId(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getDepartmentColor(item.department)}>
                      {item.department}
                    </Badge>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{item.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{item.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Mulai: {new Date(item.startDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  
                  {item.education && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500">Pendidikan: {item.education}</p>
                      {item.experience && (
                        <p className="text-xs text-gray-500 mt-1">Pengalaman: {item.experience}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletePerangkatId} onOpenChange={() => setDeletePerangkatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Perangkat Desa</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data perangkat ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletePerangkatId && handleDelete(deletePerangkatId)}
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