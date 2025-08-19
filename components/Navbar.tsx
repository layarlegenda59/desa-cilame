'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Home,
  Users,
  Info,
  Briefcase,
  PieChart,
  MessageSquare,
  ChevronDown,
  FileText,
  Calendar,
  Download,
  Building,
  History,
  Target,
  Sprout,
  Newspaper,
  Bell,
  Clock,
  Store,
  BarChart3,
  ClipboardList,
  MapPin,
  Flag,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveAccordion, setMobileActiveAccordion] = useState<string | null>(null);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      id: 'beranda',
      label: t('nav.home'),
      href: '/',
      icon: Home
    },
    {
      id: 'profil',
      label: t('nav.village_profile'),
      icon: Users,
      submenu: [
        { label: t('nav.about_village'), href: '/profil/tentang', icon: Info },
        { label: t('nav.village_history'), href: '/profil/sejarah', icon: History },
        { label: t('nav.vision_mission'), href: '/profil/visi-misi', icon: Target },
        { label: t('nav.organization_structure'), href: '/profil/struktur', icon: Building },
        { label: t('nav.village_potential'), href: '/profil/potensi', icon: Sprout }
      ]
    },
    {
      id: 'informasi',
      label: t('nav.information'),
      icon: Info,
      submenu: [
        { label: t('nav.village_news'), href: '/informasi/berita', icon: Newspaper },
        { label: t('nav.announcements'), href: '/informasi/pengumuman', icon: Bell },
        { label: t('nav.service_schedule'), href: '/informasi/jadwal', icon: Clock },
        { label: t('nav.public_documents'), href: '/informasi/dokumen', icon: Download }
      ]
    },
    {
      id: 'layanan',
      label: t('nav.services_economy'),
      icon: Briefcase,
      submenu: [
        { label: t('nav.local_job_market'), href: '/pasar-kerja', icon: Users },
        { label: t('nav.village_umkm'), href: '/umkm', icon: Store }
      ]
    },
    {
      id: 'transparansi',
      label: t('nav.transparency'),
      icon: PieChart,
      submenu: [
        { label: t('nav.village_budget'), href: '/transparansi/apbdes', icon: BarChart3 },
        { label: t('nav.activity_reports'), href: '/transparansi/laporan', icon: ClipboardList },
        { label: 'Statistik Penduduk Cilame', href: '/transparansi/statistik-penduduk', icon: Users }
      ]
    },
    {
      id: 'kontak',
      label: t('nav.contact_complaints'),
      icon: MessageSquare,
      submenu: [
        { label: t('nav.contact_form'), href: '/kontak', icon: Mail },
        { label: t('nav.citizen_reports'), href: '/laporan', icon: Flag },
        { label: t('nav.location_map'), href: '/lokasi', icon: MapPin }
      ]
    }
  ];

  const handleDropdownToggle = (menuId: string) => {
    setActiveDropdown(activeDropdown === menuId ? null : menuId);
  };

  const handleMobileAccordionToggle = (menuId: string) => {
    setMobileActiveAccordion(mobileActiveAccordion === menuId ? null : menuId);
  };

  const handleLanguageChange = (newLanguage: 'id' | 'su') => {
    setLanguage(newLanguage);
    setLanguageDropdownOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-teal-700 text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>(022) 6867-8901</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>info@desacilame.id</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>{t('contact.office_hours')}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 shadow-lg backdrop-blur-md' 
          : 'bg-gradient-to-r from-teal-600 to-emerald-600'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="p-2 rounded-lg shadow-md relative w-12 h-12">
                <Image
                  src="https://uwlwfjsdteygsvswsbsd.supabase.co/storage/v1/object/sign/material/GKL2_logo-kabupaten-bandung-barat%20-%20Koleksilogo.com.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOTU3OGQ5MS1jOTNkLTQyYTItYmFjMy1kMjM1ZTUyY2VhNmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9HS0wyX2xvZ28ta2FidXBhdGVuLWJhbmR1bmctYmFyYXQgLSBLb2xla3NpbG9nby5jb20ucG5nIiwiaWF0IjoxNzU1MDQ4NTUwLCJleHAiOjE3ODY1ODQ1NTB9.e-Qn90XAN1ew-AcFSHCSL3mKvHoWtkd4qqgyu1n00bs"
                  alt="Logo Kabupaten Bandung Barat"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white leading-tight">Desa Cilame</h1>
                <p className="text-xs text-teal-100">Portal Digital Desa</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1 flex-1 justify-center">
              {menuItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className="flex items-center space-x-1 text-white hover:text-teal-100 px-2 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-white/10 whitespace-nowrap text-sm"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 flex-shrink-0 ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.id && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                          {item.submenu.map((subItem, index) => (
                            <Link
                              key={index}
                              href={subItem.href}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <subItem.icon className="h-4 w-4 text-teal-600 flex-shrink-0" />
                              <span className="text-sm font-medium">{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-1 text-white hover:text-teal-100 px-2 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-white/10 whitespace-nowrap text-sm"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden xl:flex items-center space-x-3 flex-shrink-0">
              {/* CTA Button */}
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl whitespace-nowrap text-sm">
                <FileText className="h-4 w-4 mr-2" />
                {t('nav.online_letter_request')}
              </Button>

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="flex items-center space-x-1 text-white hover:text-teal-100 px-3 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-white/10 text-sm"
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === 'id' ? 'ID' : 'SU'}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${
                    languageDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {languageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    <button
                      onClick={() => handleLanguageChange('id')}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        language === 'id' 
                          ? 'bg-teal-50 text-teal-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Indonesia
                    </button>
                    <button
                      onClick={() => handleLanguageChange('su')}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        language === 'su' 
                          ? 'bg-teal-50 text-teal-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Sunda
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="xl:hidden bg-white rounded-lg shadow-xl mx-4 mb-4 overflow-hidden">
              <div className="py-4">
                {/* Mobile Menu Items */}
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <div key={item.id}>
                      {item.submenu ? (
                        <div>
                          <button
                            onClick={() => handleMobileAccordionToggle(item.id)}
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-teal-50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className="h-5 w-5 text-teal-600" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                              mobileActiveAccordion === item.id ? 'rotate-180' : ''
                            }`} />
                          </button>
                          
                          {/* Mobile Accordion Content */}
                          {mobileActiveAccordion === item.id && (
                            <div className="bg-gray-50 border-t border-gray-100">
                              {item.submenu.map((subItem, index) => (
                                <Link
                                  key={index}
                                  href={subItem.href}
                                  className="flex items-center space-x-3 px-8 py-3 text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setMobileActiveAccordion(null);
                                  }}
                                >
                                  <subItem.icon className="h-4 w-4 text-teal-600" />
                                  <span className="text-sm">{subItem.label}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="h-5 w-5 text-teal-600" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile CTA & Language */}
                <div className="px-4 pt-4 border-t border-gray-100 space-y-3">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                    <FileText className="h-4 w-4 mr-2" />
                    {t('nav.online_letter_request')}
                  </Button>
                  
                  {/* Mobile Language Toggle */}
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleLanguageChange('id')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        language === 'id' 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Indonesia
                    </button>
                    <button
                      onClick={() => handleLanguageChange('su')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        language === 'su' 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Sunda
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Overlay for dropdowns */}
      {(activeDropdown || languageDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setActiveDropdown(null);
            setLanguageDropdownOpen(false);
          }}
        />
      )}
    </>
  );
}