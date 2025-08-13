'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AnnouncementTicker() {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const { t } = useLanguage();
  
  const announcements = [
    t('announcement.social_aid'),
    t('announcement.online_service'),
    t('announcement.market'),
    t('announcement.budget_report')
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-amber-400 text-amber-900 py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 mr-4 flex-shrink-0">
            <AlertCircle className="h-5 w-5" />
            <span className="font-semibold">PENGUMUMAN:</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-pulse">
              {announcements[currentAnnouncement]}
            </div>
          </div>
          <div className="flex items-center ml-4 text-sm">
            <Volume2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">{t('announcement.latest')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}