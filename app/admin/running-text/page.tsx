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
  EyeOff,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  Type,
  Save,
  X,
  Play,
  Pause,
  Settings
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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface RunningText {
  id: string;
  content: string;
  status: 'active' | 'inactive' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: string;
  endDate?: string;
  speed: number; // 1-10 (slow to fast)
  backgroundColor: string;
  textColor: string;
  fontSize: number; // 12-24px
  category: 'announcement' | 'news' | 'event' | 'emergency' | 'general';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  views: number;
}

export default function RunningTextAdmin() {
  const [runningTexts, setRunningTexts] = useState<RunningText[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RunningText | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Partial<RunningText>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  // Helper function to save data to localStorage
  const saveToLocalStorage = (data: RunningText[]) => {
    try {
      localStorage.setItem('runningTexts', JSON.stringify(data));
      // Dispatch custom event untuk memberitahu komponen lain tentang perubahan
      window.dispatchEvent(new CustomEvent('runningTextsUpdated'));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Sample data
  const sampleRunningTexts: RunningText[] = [
    {
      id: '1',
      content: '🔔 Pendaftaran Bantuan Sosial PKH Tahap II dibuka hingga 31 Januari 2025',
      status: 'active',
      priority: 'high',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      speed: 5,
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      fontSize: 16,
      category: 'announcement',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      createdBy: 'Admin',
      views: 1250
    },
    {
      id: '2',
      content: '📋 Pelayanan Surat Keterangan Online kini tersedia 24/7',
      status: 'active',
      priority: 'medium',
      speed: 4,
      backgroundColor: '#10b981',
      textColor: '#ffffff',
      fontSize: 16,
      category: 'news',
      createdAt: '2025-01-02T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
      createdBy: 'Admin',
      views: 890
    },
    {
      id: '3',
      content: '🏪 Pasar Rakyat Desa Cilame buka setiap Selasa dan Jumat',
      status: 'active',
      priority: 'low',
      speed: 3,
      backgroundColor: '#f59e0b',
      textColor: '#ffffff',
      fontSize: 16,
      category: 'general',
      createdAt: '2025-01-03T00:00:00Z',
      updatedAt: '2025-01-03T00:00:00Z',
      createdBy: 'Admin',
      views: 567
    },
    {
      id: '4',
      content: '💰 Laporan APBDes Triwulan IV telah dipublikasikan',
      status: 'inactive',
      priority: 'medium',
      speed: 4,
      backgroundColor: '#8b5cf6',
      textColor: '#ffffff',
      fontSize: 16,
      category: 'announcement',
      createdAt: '2025-01-04T00:00:00Z',
      updatedAt: '2025-01-04T00:00:00Z',
      createdBy: 'Admin',
      views: 234
    },
    {
      id: '5',
      content: '🚨 SIAGA BANJIR: Warga diminta waspada cuaca ekstrem minggu ini',
      status: 'scheduled',
      priority: 'urgent',
      startDate: '2025-01-15',
      endDate: '2025-01-22',
      speed: 7,
      backgroundColor: '#ef4444',
      textColor: '#ffffff',
      fontSize: 18,
      category: 'emergency',
      createdAt: '2025-01-05T00:00:00Z',
      updatedAt: '2025-01-05T00:00:00Z',
      createdBy: 'Admin',
      views: 0
    }
  ];

  useEffect(() => {
    // Load data from localStorage or use sample data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const savedData = localStorage.getItem('runningTexts');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setRunningTexts(parsedData);
        } catch (error) {
          console.error('Error parsing saved data:', error);
          setRunningTexts(sampleRunningTexts);
        }
      } else {
        setRunningTexts(sampleRunningTexts);
        // Save initial data to localStorage
        localStorage.setItem('runningTexts', JSON.stringify(sampleRunningTexts));
      }
      
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filter functions
  const filteredRunningTexts = runningTexts.filter(item => {
    const matchesSearch = item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // CRUD Operations
  const handleAdd = () => {
    setFormData({
      speed: 5,
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      fontSize: 16,
      status: 'active',
      priority: 'medium',
      category: 'general'
    });
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item: RunningText) => {
    setSelectedItem(item);
    setFormData(item);
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: RunningText) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handlePreview = (item: RunningText) => {
    setSelectedItem(item);
    setIsPreviewDialogOpen(true);
  };

  const toggleStatus = async (item: RunningText) => {
    const newStatus: 'active' | 'inactive' = item.status === 'active' ? 'inactive' : 'active';
    
    setToggleLoading(item.id);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedData = runningTexts.map(rt => 
        rt.id === item.id ? { ...rt, status: newStatus, updatedAt: new Date().toISOString() } : rt
      );
      
      setRunningTexts(updatedData);
      saveToLocalStorage(updatedData);
      
      toast({ 
        title: 'Berhasil', 
        description: `Running text ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}` 
      });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Terjadi kesalahan saat mengubah status',
        variant: 'destructive'
      });
    } finally {
      setToggleLoading(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.content || formData.content.trim().length === 0) {
      errors.content = 'Konten running text wajib diisi';
    } else if (formData.content.length > 200) {
      errors.content = 'Konten tidak boleh lebih dari 200 karakter';
    }
    
    if (!formData.category) errors.category = 'Kategori wajib dipilih';
    if (!formData.priority) errors.priority = 'Prioritas wajib dipilih';
    if (!formData.status) errors.status = 'Status wajib dipilih';
    
    if (formData.status === 'scheduled') {
      if (!formData.startDate) errors.startDate = 'Tanggal mulai wajib diisi untuk status terjadwal';
      if (!formData.endDate) errors.endDate = 'Tanggal berakhir wajib diisi untuk status terjadwal';
      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        errors.endDate = 'Tanggal berakhir harus setelah tanggal mulai';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaveLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newItem: RunningText = {
        ...formData as RunningText,
        id: selectedItem?.id || Date.now().toString(),
        createdAt: selectedItem?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Admin',
        views: selectedItem?.views || 0
      };
      
      let updatedData: RunningText[];
      if (selectedItem) {
        updatedData = runningTexts.map(item => item.id === selectedItem.id ? newItem : item);
        setRunningTexts(updatedData);
        saveToLocalStorage(updatedData);
        toast({ title: 'Berhasil', description: 'Running text berhasil diperbarui' });
      } else {
        updatedData = [...runningTexts, newItem];
        setRunningTexts(updatedData);
        saveToLocalStorage(updatedData);
        toast({ title: 'Berhasil', description: 'Running text berhasil ditambahkan' });
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
      setSaveLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    
    setDeleteLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData = runningTexts.filter(item => item.id !== selectedItem.id);
      setRunningTexts(updatedData);
      saveToLocalStorage(updatedData);
      toast({ title: 'Berhasil', description: 'Running text berhasil dihapus' });
      
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Terjadi kesalahan saat menghapus data',
        variant: 'destructive'
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      announcement: '📢',
      news: '📰',
      event: '📅',
      emergency: '🚨',
      general: '📝'
    };
    return icons[category as keyof typeof icons] || '📝';
  };

  const categories = ['announcement', 'news', 'event', 'emergency', 'general'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['active', 'inactive', 'scheduled'];

  if (isLoading && runningTexts.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Running Text</h1>
          <p className="text-gray-600 mt-1">Kelola konten running text yang ditampilkan di website</p>
        </div>
        
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Running Text
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {runningTexts.filter(rt => rt.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Pause className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tidak Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {runningTexts.filter(rt => rt.status === 'inactive').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terjadwal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {runningTexts.filter(rt => rt.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {runningTexts.reduce((sum, rt) => sum + rt.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari running text..."
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
                <SelectItem value="scheduled">Terjadwal</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="announcement">Pengumuman</SelectItem>
                <SelectItem value="news">Berita</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="emergency">Darurat</SelectItem>
                <SelectItem value="general">Umum</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prioritas</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="urgent">Mendesak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Running Text List */}
      <div className="space-y-4">
        {filteredRunningTexts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Type className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada running text ditemukan</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRunningTexts.map((runningText) => (
            <Card key={runningText.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getCategoryIcon(runningText.category)}</span>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusBadge(runningText.status)}>
                          {runningText.status === 'active' ? 'Aktif' : 
                           runningText.status === 'inactive' ? 'Tidak Aktif' : 'Terjadwal'}
                        </Badge>
                        <Badge className={getPriorityBadge(runningText.priority)}>
                          {runningText.priority === 'low' ? 'Rendah' :
                           runningText.priority === 'medium' ? 'Sedang' :
                           runningText.priority === 'high' ? 'Tinggi' : 'Mendesak'}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Preview of running text */}
                    <div 
                      className="p-3 rounded-lg mb-3 overflow-hidden"
                      style={{ 
                        backgroundColor: runningText.backgroundColor,
                        color: runningText.textColor,
                        fontSize: `${runningText.fontSize}px`
                      }}
                    >
                      <div className="animate-pulse whitespace-nowrap">
                        {runningText.content}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Dibuat: {new Date(runningText.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{runningText.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Kecepatan: {runningText.speed}/10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        <span>Font: {runningText.fontSize}px</span>
                      </div>
                    </div>
                    
                    {runningText.status === 'scheduled' && runningText.startDate && runningText.endDate && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          Dijadwalkan: {new Date(runningText.startDate).toLocaleDateString('id-ID')} - {new Date(runningText.endDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(runningText)}
                      disabled={toggleLoading === runningText.id}
                    >
                      {toggleLoading === runningText.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                      ) : runningText.status === 'active' ? (
                        <><EyeOff className="h-4 w-4 mr-1" /> Nonaktifkan</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-1" /> Aktifkan</>
                      )}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(runningText)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(runningText)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(runningText)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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
              {selectedItem ? 'Edit' : 'Tambah'} Running Text
            </DialogTitle>
            <DialogDescription>
              {selectedItem ? 'Perbarui' : 'Tambahkan'} konten running text baru
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Konten Running Text *</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className={formErrors.content ? 'border-red-500' : ''}
                rows={3}
                maxLength={200}
                placeholder="Masukkan konten running text..."
              />
              <div className="flex justify-between text-sm text-gray-500">
                {formErrors.content && <span className="text-red-500">{formErrors.content}</span>}
                <span className="ml-auto">{(formData.content || '').length}/200</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select value={formData.category || ''} onValueChange={(value) => setFormData({...formData, category: value as 'announcement' | 'news' | 'event' | 'emergency' | 'general'})}>
                  <SelectTrigger className={formErrors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">📢 Pengumuman</SelectItem>
                    <SelectItem value="news">📰 Berita</SelectItem>
                    <SelectItem value="event">📅 Event</SelectItem>
                    <SelectItem value="emergency">🚨 Darurat</SelectItem>
                    <SelectItem value="general">📝 Umum</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritas *</Label>
                <Select value={formData.priority || ''} onValueChange={(value) => setFormData({...formData, priority: value as 'low' | 'medium' | 'high' | 'urgent'})}>
                  <SelectTrigger className={formErrors.priority ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="urgent">Mendesak</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.priority && <p className="text-sm text-red-500">{formErrors.priority}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status || ''} onValueChange={(value) => setFormData({...formData, status: value as 'active' | 'inactive' | 'scheduled'})}>
                <SelectTrigger className={formErrors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  <SelectItem value="scheduled">Terjadwal</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.status && <p className="text-sm text-red-500">{formErrors.status}</p>}
            </div>
            
            {formData.status === 'scheduled' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className={formErrors.startDate ? 'border-red-500' : ''}
                  />
                  {formErrors.startDate && <p className="text-sm text-red-500">{formErrors.startDate}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Berakhir *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className={formErrors.endDate ? 'border-red-500' : ''}
                  />
                  {formErrors.endDate && <p className="text-sm text-red-500">{formErrors.endDate}</p>}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kecepatan Animasi: {formData.speed || 5}</Label>
                <Slider
                  value={[formData.speed || 5]}
                  onValueChange={(value) => setFormData({...formData, speed: value[0]})}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Lambat</span>
                  <span>Cepat</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Ukuran Font: {formData.fontSize || 16}px</Label>
                <Slider
                  value={[formData.fontSize || 16]}
                  onValueChange={(value) => setFormData({...formData, fontSize: value[0]})}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>12px</span>
                  <span>24px</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Warna Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formData.backgroundColor || '#3b82f6'}
                    onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.backgroundColor || '#3b82f6'}
                    onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Warna Teks</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={formData.textColor || '#ffffff'}
                    onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={formData.textColor || '#ffffff'}
                    onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            {/* Preview */}
            {formData.content && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div 
                  className="p-3 rounded-lg overflow-hidden border"
                  style={{ 
                    backgroundColor: formData.backgroundColor || '#3b82f6',
                    color: formData.textColor || '#ffffff',
                    fontSize: `${formData.fontSize || 16}px`
                  }}
                >
                  <div className="animate-pulse whitespace-nowrap">
                    {formData.content}
                  </div>
                </div>
              </div>
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
            <Button onClick={handleSave} disabled={saveLoading}>
              {saveLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {selectedItem ? 'Perbarui' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview Running Text</DialogTitle>
            <DialogDescription>
              Pratinjau tampilan running text di website
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div 
                className="p-4 rounded-lg overflow-hidden"
                style={{ 
                  backgroundColor: selectedItem.backgroundColor,
                  color: selectedItem.textColor,
                  fontSize: `${selectedItem.fontSize}px`
                }}
              >
                <div 
                  className="whitespace-nowrap animate-pulse"
                  style={{
                    animationDuration: `${11 - selectedItem.speed}s`
                  }}
                >
                  {selectedItem.content}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Kategori:</strong> {getCategoryIcon(selectedItem.category)} {selectedItem.category}</p>
                  <p><strong>Prioritas:</strong> {selectedItem.priority}</p>
                  <p><strong>Status:</strong> {selectedItem.status}</p>
                </div>
                <div>
                  <p><strong>Kecepatan:</strong> {selectedItem.speed}/10</p>
                  <p><strong>Font Size:</strong> {selectedItem.fontSize}px</p>
                  <p><strong>Views:</strong> {selectedItem.views.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus running text ini? 
              Tindakan ini tidak dapat dibatalkan.
              <br /><br />
              <strong>Konten:</strong> {selectedItem?.content}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
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