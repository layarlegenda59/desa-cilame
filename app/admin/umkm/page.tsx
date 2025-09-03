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
  Phone,
  Mail,
  MapPin,
  Filter,
  MoreHorizontal,
  Store,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink,
  Star
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

interface UMKM {
  id: string;
  name: string;
  category: string;
  owner: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  socialMedia?: string;
  establishedYear: string;
  employees: number;
  status: 'active' | 'inactive' | 'pending';
  products: string;
  revenue?: string;
  certification?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UMKMManagement() {
  const [umkm, setUmkm] = useState<UMKM[]>([]);
  const [filteredUmkm, setFilteredUmkm] = useState<UMKM[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUmkm, setEditingUmkm] = useState<UMKM | null>(null);
  const [deleteUmkmId, setDeleteUmkmId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    owner: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    socialMedia: '',
    establishedYear: '',
    employees: 1,
    status: 'active' as const,
    products: '',
    revenue: '',
    certification: ''
  });

  // Mock data
  useEffect(() => {
    const mockData: UMKM[] = [
      {
        id: '1',
        name: 'Warung Makan Bu Sari',
        category: 'Kuliner',
        owner: 'Sari Dewi',
        description: 'Warung makan tradisional dengan menu khas Sunda yang lezat dan terjangkau.',
        address: 'Jl. Raya Cilame No. 45',
        phone: '0812-3456-7890',
        email: 'warungbusari@gmail.com',
        website: '',
        socialMedia: '@warungbusari',
        establishedYear: '2018',
        employees: 5,
        status: 'active',
        products: 'Nasi gudeg, gado-gado, soto ayam, es cendol',
        revenue: '10-25 juta/bulan',
        certification: 'Halal MUI',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Toko Kelontong Berkah',
        category: 'Retail',
        owner: 'Ahmad Fauzi',
        description: 'Toko kelontong lengkap yang menyediakan kebutuhan sehari-hari warga.',
        address: 'Jl. Mawar No. 12',
        phone: '0812-3456-7891',
        email: 'tokoberkah@gmail.com',
        website: '',
        socialMedia: '',
        establishedYear: '2015',
        employees: 3,
        status: 'active',
        products: 'Sembako, minuman, snack, kebutuhan rumah tangga',
        revenue: '15-30 juta/bulan',
        certification: '',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10'
      },
      {
        id: '3',
        name: 'Kerajinan Bambu Cilame',
        category: 'Kerajinan',
        owner: 'Dedi Suryadi',
        description: 'Usaha kerajinan bambu dengan produk berkualitas tinggi dan ramah lingkungan.',
        address: 'Jl. Melati No. 78',
        phone: '0812-3456-7892',
        email: 'bambucilame@gmail.com',
        website: 'www.bambucilame.com',
        socialMedia: '@bambucilame',
        establishedYear: '2020',
        employees: 8,
        status: 'active',
        products: 'Anyaman bambu, furniture bambu, souvenir',
        revenue: '20-40 juta/bulan',
        certification: 'SNI Kerajinan',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-08'
      },
      {
        id: '4',
        name: 'Salon Cantik Indah',
        category: 'Jasa',
        owner: 'Indah Permata',
        description: 'Salon kecantikan dengan layanan lengkap untuk perawatan rambut dan wajah.',
        address: 'Jl. Anggrek No. 23',
        phone: '0812-3456-7893',
        email: 'salonindah@gmail.com',
        website: '',
        socialMedia: '@salonindah',
        establishedYear: '2019',
        employees: 4,
        status: 'active',
        products: 'Potong rambut, creambath, facial, manicure pedicure',
        revenue: '8-15 juta/bulan',
        certification: '',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-05'
      },
      {
        id: '5',
        name: 'Tani Organik Cilame',
        category: 'Pertanian',
        owner: 'Budi Hartono',
        description: 'Usaha pertanian organik yang menghasilkan sayuran segar tanpa pestisida.',
        address: 'Jl. Dahlia No. 56',
        phone: '0812-3456-7894',
        email: 'taniorganik@gmail.com',
        website: '',
        socialMedia: '',
        establishedYear: '2021',
        employees: 6,
        status: 'pending',
        products: 'Sayuran organik, buah-buahan, pupuk kompos',
        revenue: '12-20 juta/bulan',
        certification: 'Organik Indonesia',
        createdAt: '2024-01-03',
        updatedAt: '2024-01-03'
      },
      {
        id: '6',
        name: 'Konveksi Maju Jaya',
        category: 'Tekstil',
        owner: 'Jaya Kusuma',
        description: 'Usaha konveksi yang memproduksi pakaian berkualitas dengan harga terjangkau.',
        address: 'Jl. Kenanga No. 89',
        phone: '0812-3456-7895',
        email: 'konveksimaju@gmail.com',
        website: '',
        socialMedia: '@konveksimaju',
        establishedYear: '2017',
        employees: 12,
        status: 'inactive',
        products: 'Seragam sekolah, kaos, kemeja, celana',
        revenue: '25-50 juta/bulan',
        certification: '',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];
    
    setTimeout(() => {
      setUmkm(mockData);
      setFilteredUmkm(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter UMKM
  useEffect(() => {
    let filtered = umkm;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.products.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredUmkm(filtered);
  }, [umkm, searchTerm, categoryFilter, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUmkm) {
      // Update existing UMKM
      const updatedUmkm = umkm.map(item => 
        item.id === editingUmkm.id 
          ? {
              ...item,
              ...formData,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : item
      );
      setUmkm(updatedUmkm);
      toast({
        title: "Berhasil",
        description: "Data UMKM berhasil diperbarui",
      });
    } else {
      // Create new UMKM
      const newUmkm: UMKM = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setUmkm([newUmkm, ...umkm]);
      toast({
        title: "Berhasil",
        description: "UMKM baru berhasil ditambahkan",
      });
    }
    
    resetForm();
  };

  const handleEdit = (item: UMKM) => {
    setEditingUmkm(item);
    setFormData({
      name: item.name,
      category: item.category,
      owner: item.owner,
      description: item.description,
      address: item.address,
      phone: item.phone,
      email: item.email,
      website: item.website || '',
      socialMedia: item.socialMedia || '',
      establishedYear: item.establishedYear,
      employees: item.employees,
      status: item.status,
      products: item.products,
      revenue: item.revenue || '',
      certification: item.certification || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setUmkm(umkm.filter(item => item.id !== id));
    setDeleteUmkmId(null);
    toast({
      title: "Berhasil",
      description: "Data UMKM berhasil dihapus",
      variant: "destructive"
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      owner: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      socialMedia: '',
      establishedYear: '',
      employees: 1,
      status: 'active',
      products: '',
      revenue: '',
      certification: ''
    });
    setEditingUmkm(null);
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Tidak Aktif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Kuliner':
        return 'bg-orange-100 text-orange-800';
      case 'Retail':
        return 'bg-blue-100 text-blue-800';
      case 'Kerajinan':
        return 'bg-purple-100 text-purple-800';
      case 'Jasa':
        return 'bg-green-100 text-green-800';
      case 'Pertanian':
        return 'bg-emerald-100 text-emerald-800';
      case 'Tekstil':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manajemen UMKM</h1>
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
          <h1 className="text-3xl font-bold text-gray-900">Manajemen UMKM</h1>
          <p className="text-gray-600 mt-1">Kelola data Usaha Mikro Kecil dan Menengah di desa</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah UMKM
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUmkm ? 'Edit UMKM' : 'Tambah UMKM Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingUmkm ? 'Perbarui informasi UMKM' : 'Tambahkan UMKM baru ke dalam database'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Usaha</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Masukkan nama usaha"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="owner">Nama Pemilik</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
                    placeholder="Masukkan nama pemilik"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kuliner">Kuliner</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                      <SelectItem value="Jasa">Jasa</SelectItem>
                      <SelectItem value="Pertanian">Pertanian</SelectItem>
                      <SelectItem value="Tekstil">Tekstil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Tahun Berdiri</Label>
                  <Input
                    id="establishedYear"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({...formData, establishedYear: e.target.value})}
                    placeholder="2020"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employees">Jumlah Karyawan</Label>
                  <Input
                    id="employees"
                    type="number"
                    min="1"
                    value={formData.employees}
                    onChange={(e) => setFormData({...formData, employees: parseInt(e.target.value) || 1})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Usaha</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Deskripsi singkat tentang usaha"
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="products">Produk/Layanan</Label>
                <Textarea
                  id="products"
                  value={formData.products}
                  onChange={(e) => setFormData({...formData, products: e.target.value})}
                  placeholder="Daftar produk atau layanan yang ditawarkan"
                  rows={2}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Alamat lengkap usaha"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Opsional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="www.example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="socialMedia">Media Sosial (Opsional)</Label>
                  <Input
                    id="socialMedia"
                    value={formData.socialMedia}
                    onChange={(e) => setFormData({...formData, socialMedia: e.target.value})}
                    placeholder="@username"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Omzet (Opsional)</Label>
                  <Input
                    id="revenue"
                    value={formData.revenue}
                    onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                    placeholder="10-25 juta/bulan"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certification">Sertifikasi (Opsional)</Label>
                  <Input
                    id="certification"
                    value={formData.certification}
                    onChange={(e) => setFormData({...formData, certification: e.target.value})}
                    placeholder="Halal MUI, SNI, dll"
                  />
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
                      <SelectItem value="pending">Menunggu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingUmkm ? 'Perbarui' : 'Simpan'}
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
              <Store className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total UMKM</p>
                <p className="text-2xl font-bold text-gray-900">{umkm.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {umkm.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {umkm.reduce((total, u) => total + u.employees, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kategori</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(umkm.map(u => u.category)).size}
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
                  placeholder="Cari UMKM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="Kuliner">Kuliner</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                  <SelectItem value="Jasa">Jasa</SelectItem>
                  <SelectItem value="Pertanian">Pertanian</SelectItem>
                  <SelectItem value="Tekstil">Tekstil</SelectItem>
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
                  <SelectItem value="pending">Menunggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UMKM Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUmkm.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada UMKM ditemukan</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredUmkm.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">Pemilik: {item.owner}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      {getStatusBadge(item.status)}
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
                        onClick={() => setDeleteUmkmId(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{item.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{item.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{item.email}</span>
                  </div>
                  {item.website && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">{item.website}</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-3 border-t space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Berdiri: {item.establishedYear}</span>
                    <span>Karyawan: {item.employees}</span>
                  </div>
                  {item.revenue && (
                    <p className="text-xs text-gray-500">Omzet: {item.revenue}</p>
                  )}
                  {item.certification && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-500">{item.certification}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 line-clamp-2 mt-2">
                    Produk: {item.products}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUmkmId} onOpenChange={() => setDeleteUmkmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus UMKM</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data UMKM ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteUmkmId && handleDelete(deleteUmkmId)}
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