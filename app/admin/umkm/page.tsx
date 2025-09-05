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
import { ImageUpload } from '@/components/ui/image-upload';

interface UMKM {
  id: string;
  name?: string;
  business_name?: string; // Backend field
  category: string;
  owner?: string;
  owner_name?: string; // Backend field
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  socialMedia?: string;
  social_media?: { // Backend field
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  establishedYear?: string;
  established_year?: string | number; // Backend field
  employees?: number;
  employee_count?: number; // Backend field
  status: 'active' | 'inactive' | 'pending';
  products: string;
  revenue?: string;
  annual_revenue?: string; // Backend field
  certification?: string;
  images?: string[] | string; // Can be JSON string or array
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // Backend field
  updated_at?: string; // Backend field
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
    status: 'active' as 'active' | 'inactive' | 'pending',
    products: '',
    revenue: '',
    certification: '',
    images: [] as string[],
    existingImages: [] as string[]
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Handle file upload
  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
    // Files will be uploaded automatically by ImageUpload component
    // We'll listen for the upload completion event
  };

  // Listen for uploaded image URLs
  useEffect(() => {
    const handleFilesUploaded = (event: CustomEvent) => {
      const uploadedUrls = event.detail;
      setFormData(prev => ({
        ...prev,
        images: uploadedUrls // Use actual uploaded URLs
      }));
    };

    window.addEventListener('filesUploaded', handleFilesUploaded as EventListener);
    
    return () => {
      window.removeEventListener('filesUploaded', handleFilesUploaded as EventListener);
    };
  }, []);

  const handleRemoveExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  // Helper function to map category names to IDs
  const getCategoryId = (categoryName: string): number => {
    const categoryMap: { [key: string]: number } = {
      'Kuliner': 1,
      'Kerajinan': 2,
      'Retail': 3,
      'Jasa': 4,
      'Pertanian': 5,
      'Tekstil': 6,
      'Meubelair': 7
    };
    return categoryMap[categoryName] || 1;
  };

  // Load UMKM data from API
  const fetchUmkm = async () => {
    try {
      setIsLoading(true);
      // Import API_ENDPOINTS
      const { API_ENDPOINTS } = await import('@/lib/api-config');
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_ENDPOINTS.umkm}/umkm`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch UMKM data');
      }
      const result = await response.json();
      const umkmData = result.data || [];
      setUmkm(umkmData);
      setFilteredUmkm(umkmData);
    } catch (error) {
      console.error('Error fetching UMKM:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Error",
          description: "Request timeout - periksa koneksi backend",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data UMKM",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUmkm();
  }, []);

  // Filter UMKM
  useEffect(() => {
    let filtered = umkm;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.products?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Prepare form data for API - map frontend fields to backend schema
      // Gabungkan existing images dengan images baru
      const allImages = [...(formData.existingImages || []), ...(formData.images || [])];
      
       const submitData = {
         business_name: formData.name,
         description: formData.description,
         owner_name: formData.owner,
         phone: formData.phone,
         email: formData.email,
         address: formData.address,
         category: formData.category, // Send category name directly
         website: formData.website,
         established_year: formData.establishedYear,
         employee_count: formData.employees,
         annual_revenue: formData.revenue,
         certification: formData.certification,
         status: formData.status || 'pending',
         products: formData.products || '',
         images: JSON.stringify(allImages),
         social_media: JSON.stringify({
           instagram: formData.socialMedia || '',
           facebook: '',
           whatsapp: ''
         })
       };
      
      // Import API_ENDPOINTS
      const { API_ENDPOINTS } = await import('@/lib/api-config');
      
      if (editingUmkm) {
        // Update existing UMKM
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_ENDPOINTS.umkm}/umkm/${editingUmkm.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to update UMKM');
        }
        
        toast({
          title: "Berhasil",
          description: "Data UMKM berhasil diperbarui",
        });
      } else {
        // Create new UMKM
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_ENDPOINTS.umkm}/umkm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Failed to create UMKM');
        }
        
        toast({
          title: "Berhasil",
          description: "UMKM baru berhasil ditambahkan",
        });
      }
      
      // Refresh data
      await fetchUmkm();
      resetForm();
    } catch (error) {
      console.error('Error saving UMKM:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Error",
          description: "Request timeout - periksa koneksi backend",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal menyimpan data UMKM",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: UMKM) => {
    setEditingUmkm(item);
    
    // Parse images if it's a JSON string
    let parsedImages: string[] = [];
    if (item.images) {
      if (typeof item.images === 'string') {
        try {
          parsedImages = JSON.parse(item.images);
        } catch (e) {
          console.error('Error parsing images:', e);
          parsedImages = [];
        }
      } else if (Array.isArray(item.images)) {
        parsedImages = item.images;
      }
    }
    
    // Convert relative URLs to full URLs for existing images
    const fullUrlImages = parsedImages.map(img => {
      if (img.startsWith('/uploads/')) {
        return `http://localhost:5001${img}`;
      }
      return img;
    });
    
    setFormData({
      name: item.business_name || item.name || '',
      category: item.category || '',
      owner: item.owner_name || item.owner || '',
      description: item.description || '',
      address: item.address || '',
      phone: item.phone || '',
      email: item.email || '',
      website: item.website || '',
      socialMedia: item.social_media?.instagram || item.socialMedia || '',
      establishedYear: item.established_year?.toString() || item.establishedYear || '',
      employees: item.employee_count || item.employees || 1,
      status: (item.status || 'active') as 'active' | 'inactive' | 'pending',
      products: item.products || '',
      revenue: item.annual_revenue || item.revenue || '',
      certification: item.certification || '',
      images: [],
      existingImages: fullUrlImages
    });
    setUploadedFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Import API_ENDPOINTS
      const { API_ENDPOINTS } = await import('@/lib/api-config');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_ENDPOINTS.umkm}/umkm/${id}`, {
        method: 'DELETE',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to delete UMKM');
      }
      
      toast({
        title: "Berhasil",
        description: "Data UMKM berhasil dihapus",
        variant: "destructive"
      });
      
      // Refresh data
      await fetchUmkm();
    } catch (error) {
      console.error('Error deleting UMKM:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Error",
          description: "Request timeout - periksa koneksi backend",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal menghapus data UMKM",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setDeleteUmkmId(null);
    }
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
      certification: '',
      images: [],
      existingImages: []
    });
    setUploadedFiles([]);
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
                      <SelectItem value="Meubelair">Meubelair</SelectItem>
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
              
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Gambar UMKM</Label>
                <ImageUpload
                    onFilesChange={handleFilesChange}
                    maxFiles={5}
                    maxSize={5}
                    acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                    existingImages={formData.existingImages || []}
                    onRemoveExistingImage={handleRemoveExistingImage}
                    className="w-full"
                  />
                <p className="text-xs text-gray-500">
                  Upload gambar produk, tempat usaha, atau aktivitas UMKM untuk menarik lebih banyak pelanggan
                </p>
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
                  {umkm.reduce((total, u) => total + (u.employees || u.employee_count || 0), 0)}
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
                  <SelectItem value="Meubelair">Meubelair</SelectItem>
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
                    <h3 className="font-semibold text-gray-900 mb-1">{item.business_name || item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">Pemilik: {item.owner_name || item.owner}</p>
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