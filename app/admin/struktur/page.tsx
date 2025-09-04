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
  Users,
  Building,
  FileText,
  Save,
  X
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PerangkatDesa {
  id: string;
  name: string;
  position: string;
  department: string;
  responsibilities: string[];
  contact: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'retired';
  startDate: string;
  endDate?: string;
  education?: string;
  experience?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LembagaDesa {
  id: string;
  name: string;
  chairman: string;
  members: number;
  function: string;
  responsibilities: string[];
  contact?: string;
  status: 'active' | 'inactive';
  establishedDate: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function StrukturOrganisasiAdmin() {
  const [perangkatDesa, setPerangkatDesa] = useState<PerangkatDesa[]>([]);
  const [lembagaDesa, setLembagaDesa] = useState<LembagaDesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('perangkat');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PerangkatDesa | LembagaDesa | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Partial<PerangkatDesa | LembagaDesa>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  // Sample data - in real app, this would come from API
  const samplePerangkatDesa: PerangkatDesa[] = [
    {
      id: '1',
      name: 'AAS MOHAMAD ASOR, S.H., M.H., NL.P.',
      position: 'Kepala Desa',
      department: 'Kepala Desa',
      responsibilities: ['Memimpin pemerintahan desa', 'Koordinasi program pembangunan', 'Pelayanan masyarakat'],
      contact: 'kepala@desacilame.com',
      phone: '081234567890',
      email: 'kepala@desacilame.com',
      status: 'active',
      startDate: '2020-01-01',
      education: 'S1 Hukum, S2 Hukum',
      experience: '15 tahun di bidang pemerintahan'
    },
    {
      id: '2',
      name: 'DENI AHMAD BERLIAN',
      position: 'Sekretaris Desa',
      department: 'Sekretariat',
      responsibilities: ['Administrasi umum', 'Koordinasi program', 'Dokumentasi kegiatan'],
      contact: 'sekdes@desacilame.com',
      phone: '081234567891',
      email: 'sekdes@desacilame.com',
      status: 'active',
      startDate: '2020-02-01'
    },
    {
      id: '3',
      name: 'KOKO KOSWARA',
      position: 'Kepala Urusan Umum & Tata Usaha',
      department: 'Umum & Tata Usaha',
      responsibilities: ['Pelayanan masyarakat', 'Administrasi surat', 'Kearsipan', 'Tata usaha'],
      contact: 'umum@desacilame.com',
      phone: '081234567892',
      email: 'umum@desacilame.com',
      status: 'active',
      startDate: '2020-03-01'
    }
  ];

  const sampleLembagaDesa: LembagaDesa[] = [
    {
      id: '1',
      name: 'BPD (Badan Permusyawaratan Desa)',
      chairman: 'Bapak H. Yusuf Hidayat',
      members: 9,
      function: 'Fungsi legislatif dan pengawasan',
      responsibilities: [
        'Membahas dan menyepakati Rancangan Peraturan Desa',
        'Menampung dan menyalurkan aspirasi masyarakat',
        'Melakukan pengawasan kinerja Kepala Desa'
      ],
      contact: 'bpd@desacilame.com',
      status: 'active',
      establishedDate: '2020-01-01'
    },
    {
      id: '2',
      name: 'LPMD (Lembaga Pemberdayaan Masyarakat Desa)',
      chairman: 'Ibu Dr. Hj. Neneng Suryani',
      members: 7,
      function: 'Pemberdayaan masyarakat',
      responsibilities: [
        'Penyusunan rencana pembangunan partisipatif',
        'Pelaksanaan pemberdayaan masyarakat',
        'Pengembangan kapasitas masyarakat'
      ],
      contact: 'lpmd@desacilame.com',
      status: 'active',
      establishedDate: '2020-01-01'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPerangkatDesa(samplePerangkatDesa);
      setLembagaDesa(sampleLembagaDesa);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filter functions
  const filteredPerangkatDesa = perangkatDesa.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || item.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const filteredLembagaDesa = lembagaDesa.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.chairman.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CRUD Operations
  const handleAdd = () => {
    setFormData({});
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item: PerangkatDesa | LembagaDesa) => {
    setSelectedItem(item);
    setFormData(item);
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: PerangkatDesa | LembagaDesa) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (activeTab === 'perangkat') {
      const perangkatData = formData as Partial<PerangkatDesa>;
      if (!perangkatData.name) errors.name = 'Nama wajib diisi';
      if (!perangkatData.position) errors.position = 'Jabatan wajib diisi';
      if (!perangkatData.department) errors.department = 'Bidang wajib diisi';
      if (!perangkatData.contact) errors.contact = 'Kontak wajib diisi';
      if (!perangkatData.startDate) errors.startDate = 'Tanggal mulai wajib diisi';
    } else {
      const lembagaData = formData as Partial<LembagaDesa>;
      if (!lembagaData.name) errors.name = 'Nama lembaga wajib diisi';
      if (!lembagaData.chairman) errors.chairman = 'Ketua wajib diisi';
      if (!lembagaData.function) errors.function = 'Fungsi wajib diisi';
      if (!lembagaData.establishedDate) errors.establishedDate = 'Tanggal berdiri wajib diisi';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeTab === 'perangkat') {
        const perangkatData = formData as Partial<PerangkatDesa>;
        const newItem: PerangkatDesa = {
          ...perangkatData as PerangkatDesa,
          id: selectedItem?.id || Date.now().toString(),
          responsibilities: typeof perangkatData.responsibilities === 'string' 
            ? (perangkatData.responsibilities as string).split(',').map(r => r.trim())
            : perangkatData.responsibilities || [],
          status: (perangkatData.status as 'active' | 'inactive' | 'retired') || 'active',
          createdAt: selectedItem?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (selectedItem) {
          setPerangkatDesa(prev => prev.map(item => item.id === selectedItem.id ? newItem : item));
          toast({ title: 'Berhasil', description: 'Data perangkat desa berhasil diperbarui' });
        } else {
          setPerangkatDesa(prev => [...prev, newItem]);
          toast({ title: 'Berhasil', description: 'Data perangkat desa berhasil ditambahkan' });
        }
      } else {
        const lembagaData = formData as Partial<LembagaDesa>;
        const newItem: LembagaDesa = {
          ...lembagaData as LembagaDesa,
          id: selectedItem?.id || Date.now().toString(),
          responsibilities: typeof lembagaData.responsibilities === 'string' 
            ? (lembagaData.responsibilities as string).split(',').map(r => r.trim())
            : lembagaData.responsibilities || [],
          status: (lembagaData.status as 'active' | 'inactive') || 'active',
          members: Number(lembagaData.members) || 0,
          createdAt: selectedItem?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        if (selectedItem) {
          setLembagaDesa(prev => prev.map(item => item.id === selectedItem.id ? newItem : item));
          toast({ title: 'Berhasil', description: 'Data lembaga desa berhasil diperbarui' });
        } else {
          setLembagaDesa(prev => [...prev, newItem]);
          toast({ title: 'Berhasil', description: 'Data lembaga desa berhasil ditambahkan' });
        }
      }
      
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      setFormData({});
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Terjadi kesalahan saat menyimpan data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (activeTab === 'perangkat') {
        setPerangkatDesa(prev => prev.filter(item => item.id !== selectedItem.id));
        toast({ title: 'Berhasil', description: 'Data perangkat desa berhasil dihapus' });
      } else {
        setLembagaDesa(prev => prev.filter(item => item.id !== selectedItem.id));
        toast({ title: 'Berhasil', description: 'Data lembaga desa berhasil dihapus' });
      }
      
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Terjadi kesalahan saat menghapus data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      retired: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const departments = Array.from(new Set(perangkatDesa.map(p => p.department)));

  if (isLoading && perangkatDesa.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Struktur Organisasi</h1>
          <p className="text-gray-600 mt-1">Kelola data perangkat desa dan lembaga desa</p>
        </div>
        
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah {activeTab === 'perangkat' ? 'Perangkat' : 'Lembaga'}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="perangkat">Perangkat Desa</TabsTrigger>
          <TabsTrigger value="lembaga">Lembaga Desa</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={`Cari ${activeTab === 'perangkat' ? 'perangkat' : 'lembaga'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  {activeTab === 'perangkat' && <SelectItem value="retired">Pensiun</SelectItem>}
                </SelectContent>
              </Select>
              
              {activeTab === 'perangkat' && (
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter Bidang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bidang</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Perangkat Desa Tab */}
        <TabsContent value="perangkat" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerangkatDesa.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Tidak ada perangkat desa ditemukan</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredPerangkatDesa.map((perangkat) => (
                <Card key={perangkat.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={perangkat.avatar} />
                          <AvatarFallback>
                            {perangkat.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {perangkat.name}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">{perangkat.position}</p>
                          <p className="text-xs text-gray-500">{perangkat.department}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(perangkat)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(perangkat)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2">
                      <Badge className={getStatusBadge(perangkat.status)}>
                        {perangkat.status === 'active' ? 'Aktif' : 
                         perangkat.status === 'inactive' ? 'Tidak Aktif' : 'Pensiun'}
                      </Badge>
                      
                      <div className="space-y-1">
                        {perangkat.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{perangkat.phone}</span>
                          </div>
                        )}
                        {perangkat.email && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{perangkat.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>Mulai: {new Date(perangkat.startDate).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      
                      {perangkat.responsibilities.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Tanggung Jawab:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {perangkat.responsibilities.slice(0, 2).map((resp, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                            {perangkat.responsibilities.length > 2 && (
                              <li className="text-gray-400">+{perangkat.responsibilities.length - 2} lainnya</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Lembaga Desa Tab */}
        <TabsContent value="lembaga" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLembagaDesa.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Tidak ada lembaga desa ditemukan</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredLembagaDesa.map((lembaga) => (
                <Card key={lembaga.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {lembaga.name}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">{lembaga.chairman}</p>
                          <p className="text-xs text-gray-500">{lembaga.function}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(lembaga)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(lembaga)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusBadge(lembaga.status)}>
                          {lembaga.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Users className="h-3 w-3" />
                          <span>{lembaga.members} anggota</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {lembaga.contact && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{lembaga.contact}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>Berdiri: {new Date(lembaga.establishedDate).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      
                      {lembaga.responsibilities.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Tanggung Jawab:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {lembaga.responsibilities.slice(0, 2).map((resp, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                            {lembaga.responsibilities.length > 2 && (
                              <li className="text-gray-400">+{lembaga.responsibilities.length - 2} lainnya</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedItem(null);
          setFormData({});
          setFormErrors({});
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Edit' : 'Tambah'} {activeTab === 'perangkat' ? 'Perangkat Desa' : 'Lembaga Desa'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Perbarui' : 'Tambahkan'} data {activeTab === 'perangkat' ? 'perangkat desa' : 'lembaga desa'} baru
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {activeTab === 'perangkat' ? (
              // Perangkat Desa Form
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, name: e.target.value})}
                      className={formErrors.name ? 'border-red-500' : ''}
                    />
                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Jabatan *</Label>
                    <Input
                      id="position"
                      value={(formData as Partial<PerangkatDesa>).position || ''}
                      onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, position: e.target.value})}
                      className={formErrors.position ? 'border-red-500' : ''}
                    />
                    {formErrors.position && <p className="text-sm text-red-500">{formErrors.position}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Bidang *</Label>
                    <Input
                      id="department"
                      value={(formData as Partial<PerangkatDesa>).department || ''}
                      onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, department: e.target.value})}
                      className={formErrors.department ? 'border-red-500' : ''}
                    />
                    {formErrors.department && <p className="text-sm text-red-500">{formErrors.department}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={(formData as Partial<PerangkatDesa>).status || 'active'} onValueChange={(value) => setFormData({...formData as Partial<PerangkatDesa>, status: value as 'active' | 'inactive' | 'retired'})}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor="phone">Telepon</Label>
                    <Input
                      id="phone"
                      value={(formData as Partial<PerangkatDesa>).phone || ''}
                      onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={(formData as Partial<PerangkatDesa>).email || ''}
                      onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact">Kontak Utama *</Label>
                  <Input
                    id="contact"
                    value={(formData as Partial<PerangkatDesa>).contact || ''}
                    onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, contact: e.target.value})}
                    className={formErrors.contact ? 'border-red-500' : ''}
                  />
                  {formErrors.contact && <p className="text-sm text-red-500">{formErrors.contact}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Tanggal Mulai *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={(formData as Partial<PerangkatDesa>).startDate || ''}
                      onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, startDate: e.target.value})}
                      className={formErrors.startDate ? 'border-red-500' : ''}
                    />
                    {formErrors.startDate && <p className="text-sm text-red-500">{formErrors.startDate}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Tanggal Berakhir</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={(formData as Partial<PerangkatDesa>).endDate || ''}
                      onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, endDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Pendidikan</Label>
                  <Input
                    id="education"
                    value={(formData as Partial<PerangkatDesa>).education || ''}
                    onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, education: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Pengalaman</Label>
                  <Textarea
                    id="experience"
                    value={(formData as Partial<PerangkatDesa>).experience || ''}
                    onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, experience: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Tanggung Jawab (pisahkan dengan koma)</Label>
                  <Textarea
                    id="responsibilities"
                    value={Array.isArray(formData.responsibilities) ? formData.responsibilities.join(', ') : formData.responsibilities || ''}
                    onChange={(e) => setFormData({...formData as Partial<PerangkatDesa>, responsibilities: e.target.value.split(',').map(item => item.trim())})}
                    rows={3}
                    placeholder="Contoh: Administrasi umum, Koordinasi program, Dokumentasi kegiatan"
                  />
                </div>
              </>
            ) : (
              // Lembaga Desa Form
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lembaga *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData as Partial<LembagaDesa>, name: e.target.value})}
                    className={formErrors.name ? 'border-red-500' : ''}
                  />
                  {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chairman">Ketua *</Label>
                    <Input
                      id="chairman"
                      value={(formData as Partial<LembagaDesa>).chairman || ''}
                      onChange={(e) => setFormData({...formData as Partial<LembagaDesa>, chairman: e.target.value})}
                      className={formErrors.chairman ? 'border-red-500' : ''}
                    />
                    {formErrors.chairman && <p className="text-sm text-red-500">{formErrors.chairman}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="members">Jumlah Anggota</Label>
                    <Input
                      id="members"
                      type="number"
                      value={(formData as Partial<LembagaDesa>).members || ''}
                      onChange={(e) => setFormData({...formData as Partial<LembagaDesa>, members: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="function">Fungsi *</Label>
                  <Input
                    id="function"
                    value={(formData as Partial<LembagaDesa>).function || ''}
                    onChange={(e) => setFormData({...formData as Partial<LembagaDesa>, function: e.target.value})}
                    className={formErrors.function ? 'border-red-500' : ''}
                  />
                  {formErrors.function && <p className="text-sm text-red-500">{formErrors.function}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="establishedDate">Tanggal Berdiri *</Label>
                    <Input
                      id="establishedDate"
                      type="date"
                      value={(formData as Partial<LembagaDesa>).establishedDate || ''}
                      onChange={(e) => setFormData({...formData as Partial<LembagaDesa>, establishedDate: e.target.value})}
                      className={formErrors.establishedDate ? 'border-red-500' : ''}
                    />
                    {formErrors.establishedDate && <p className="text-sm text-red-500">{formErrors.establishedDate}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={(formData as Partial<LembagaDesa>).status || 'active'} onValueChange={(value) => setFormData({...formData as Partial<LembagaDesa>, status: value as 'active' | 'inactive'})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact">Kontak</Label>
                  <Input
                    id="contact"
                    value={(formData as Partial<LembagaDesa>).contact || ''}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={(formData as Partial<LembagaDesa>).description || ''}
                    onChange={(e) => setFormData({...formData as Partial<LembagaDesa>, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Tanggung Jawab (pisahkan dengan koma)</Label>
                  <Textarea
                    id="responsibilities"
                    value={Array.isArray(formData.responsibilities) ? formData.responsibilities.join(', ') : formData.responsibilities || ''}
                    onChange={(e) => setFormData({...formData, responsibilities: e.target.value.split(',').map(item => item.trim())})}
                    rows={3}
                    placeholder="Contoh: Penyusunan rencana, Pelaksanaan program, Evaluasi kegiatan"
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedItem(null);
                setFormData({});
                setFormErrors({});
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {selectedItem ? 'Perbarui' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {activeTab === 'perangkat' ? 'perangkat desa' : 'lembaga desa'} "{selectedItem?.name}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : null}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}