'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Megaphone, 
  Building, 
  Store, 
  Settings, 
  LogOut, 
  Menu,
  Bell,
  Search,
  User,
  Type
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Berita',
    href: '/admin/berita',
    icon: FileText
  },
  {
    title: 'Pengumuman',
    href: '/admin/pengumuman',
    icon: Megaphone
  },
  {
    title: 'Perangkat Desa',
    href: '/admin/perangkat',
    icon: Users
  },
  {
    title: 'UMKM',
    href: '/admin/umkm',
    icon: Store
  },
  {
    title: 'Struktur Organisasi',
    href: '/admin/struktur',
    icon: Building
  },
  {
    title: 'Running Text',
    href: '/admin/running-text',
    icon: Type
  },
  {
    title: 'Pengaturan',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (token && token !== 'null' && token !== 'undefined') {
      setIsAuthenticated(true);
    } else if (pathname !== '/admin') {
      router.push('/admin');
    }
    setIsLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Clear cookies
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Redirect to login
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated && pathname !== '/admin') {
    return null;
  }

  // Show login page
  if (pathname === '/admin') {
    return children;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo dan Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-blue-100">Sistem Manajemen</p>
          </div>
        </div>
        <div className="bg-blue-500/20 rounded-lg p-3 mt-3">
          <p className="text-sm font-medium text-white">Desa Cilame</p>
          <p className="text-xs text-blue-100">Kecamatan Ngamprah</p>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">Menu Utama</p>
        </div>
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="font-medium">{item.title}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User Section */}
      <div className="p-4 border-t bg-gray-50/50">
        <div className="mb-3 px-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-gray-200">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">A</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Administrator</p>
              <p className="text-xs text-gray-500 truncate">admin@desakilame.id</p>
            </div>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Keluar</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:top-20 lg:bottom-0 lg:left-4 lg:flex lg:w-72 lg:flex-col lg:z-40">
        <div className="flex flex-col flex-grow bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-blue-100 -mt-1">Desa Cilame</p>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-500/20">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarFallback className="bg-white text-blue-600 font-semibold">A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80 lg:pt-20">
        {/* Desktop Header */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:px-6 lg:py-4 lg:bg-white lg:border lg:border-gray-200 lg:shadow-sm lg:rounded-lg lg:mx-4 lg:mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari data, menu, atau halaman..."
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </Button>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2">
                  <Avatar className="h-8 w-8 border-2 border-gray-200">
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">A</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <span className="text-sm font-medium text-gray-900">Administrator</span>
                    <p className="text-xs text-gray-500">admin@desakilame.id</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">Administrator</p>
                  <p className="text-xs text-gray-500">admin@desakilame.id</p>
                </div>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profil Saya
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="px-4 pb-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}