'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: 'id' | 'su') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {language === 'id' ? 'Indonesia' : 'Sunda'}
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>
      
      {isOpen && (
        <>
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
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}