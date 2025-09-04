'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RunningText {
  id: string;
  content: string;
  status: 'active' | 'inactive' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: string;
  endDate?: string;
  speed: number;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  category: 'announcement' | 'news' | 'event' | 'emergency' | 'general';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  views: number;
}

export default function AnnouncementTicker() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [runningTexts, setRunningTexts] = useState<RunningText[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  
  // Fallback announcements jika tidak ada running text aktif
  const fallbackAnnouncements = [
    t('announcement.social_aid'),
    t('announcement.online_service'),
    t('announcement.market'),
    t('announcement.budget_report')
  ];

  // Load running texts from localStorage
  useEffect(() => {
    const loadRunningTexts = () => {
      try {
        const storedData = localStorage.getItem('runningTexts');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const now = new Date();
          
          // Filter running text yang aktif atau terjadwal dan masih dalam periode
          const activeTexts = parsedData.filter((text: RunningText) => {
            if (text.status === 'active') {
              return true;
            }
            
            // Untuk status 'scheduled', periksa apakah sudah waktunya untuk ditampilkan
            if (text.status === 'scheduled' && text.startDate && text.endDate) {
              const startDate = new Date(text.startDate);
              const endDate = new Date(text.endDate);
              return now >= startDate && now <= endDate;
            }
            
            return false;
          });
          
          setRunningTexts(activeTexts);
          setIsVisible(activeTexts.length > 0);
        } else {
          // Jika tidak ada data, gunakan fallback dan tampilkan ticker
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error loading running texts:', error);
        // Jika error, gunakan fallback dan tampilkan ticker
        setIsVisible(true);
      }
    };

    loadRunningTexts();

    // Listen untuk perubahan localStorage (antar tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'runningTexts') {
        loadRunningTexts();
      }
    };

    // Listen untuk perubahan localStorage (dalam tab yang sama)
    const handleCustomStorageChange = () => {
      loadRunningTexts();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('runningTextsUpdated', handleCustomStorageChange);
    
    // Periksa jadwal running text setiap menit
    const scheduleInterval = setInterval(() => {
      loadRunningTexts();
    }, 60000); // 60 detik
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('runningTextsUpdated', handleCustomStorageChange);
      clearInterval(scheduleInterval);
    };
  }, []);

  // Tentukan announcements yang akan ditampilkan
  const announcements = runningTexts.length > 0 
    ? runningTexts.map(text => text.content)
    : fallbackAnnouncements;

  // Get current running text for styling
  const currentRunningText = runningTexts.length > 0 ? runningTexts[currentAnnouncement] : null;

  useEffect(() => {
    if (announcements.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, currentRunningText ? (11 - currentRunningText.speed) * 1000 : 4000);
    
    return () => clearInterval(interval);
  }, [announcements.length, currentRunningText]);

  // Jika tidak ada running text aktif dan tidak ada fallback, jangan tampilkan ticker
  if (!isVisible && runningTexts.length === 0) {
    return null;
  }

  return (
    <div 
      className="py-3 overflow-hidden"
      style={{
        backgroundColor: currentRunningText ? currentRunningText.backgroundColor : '#fbbf24',
        color: currentRunningText ? currentRunningText.textColor : '#92400e'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 mr-4 flex-shrink-0">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">PENGUMUMAN:</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div 
              className="whitespace-nowrap"
              style={{
                fontSize: currentRunningText ? `${currentRunningText.fontSize}px` : '16px',
                animation: `scroll-left ${currentRunningText ? (11 - currentRunningText.speed) : 4}s linear infinite`
              }}
            >
              {announcements[currentAnnouncement]}
            </div>
          </div>
          <div className="flex items-center ml-4 text-sm">
            <Volume2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t('announcement.latest')}</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}