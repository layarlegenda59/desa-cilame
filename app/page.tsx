'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Users, 
  Store, 
  MessageSquare, 
  Heart,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Phone,
  Mail,
  Facebook,
  Instagram
} from 'lucide-react';
import AnnouncementTicker from '@/components/AnnouncementTicker';
import QuickAccessGrid from '@/components/QuickAccessGrid';
import NewsSection from '@/components/NewsSection';
import StatsSection from '@/components/StatsSection';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();
  
  const heroSlides = [
    {
      image: 'https://uwlwfjsdteygsvswsbsd.supabase.co/storage/v1/object/sign/material/aang-irawan-IMDTuQftWK0-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOTU3OGQ5MS1jOTNkLTQyYTItYmFjMy1kMjM1ZTUyY2VhNmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9hYW5nLWlyYXdhbi1JTURUdVFmdFdLMC11bnNwbGFzaC5qcGciLCJpYXQiOjE3NTUwNTE2OTgsImV4cCI6MTc4NjU4NzY5OH0.tWtB1Gs5ZGfisbPoJ7xkhQL8wucEHnISWe6342w-kHw',
      title: t('hero.welcome'),
      subtitle: t('hero.subtitle')
    },
    {
      image: '/kerjasama.jpg',
      title: t('hero.transparency'),
      subtitle: t('hero.transparency_subtitle')
    },
    {
      image: '/market.jpg',
      title: t('hero.umkm'),
      subtitle: t('hero.umkm_subtitle')
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <>
      {/* Announcement Ticker */}
      <AnnouncementTicker />

      {/* Hero Banner */}
      <section className="relative hero-section overflow-hidden container-responsive">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="hero-image"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1366px) 100vw, 100vw"
              quality={85}
            />
            {index === 0 ? (
              <>
                <Image
                  src="/mountin.jpg"
                  alt="Selamat Datang di Cilame"
                  fill
                  className="hero-image"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1366px) 100vw, 100vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
              </>
            )}
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="max-w-4xl px-4">
                {index === 0 ? (
                  <div className="mb-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight text-white drop-shadow-2xl">
                      <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                        Selamat Datang
                      </span>
                    </h1>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-green-300 drop-shadow-xl mb-2">
                      di Desa Cilame
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full shadow-lg"></div>
                  </div>
                ) : (
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                )}
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/surat-online">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                      <FileText className="mr-2 h-5 w-5" />
                      {t('hero.online_services')}
                    </Button>
                  </Link>
                  <Link href="/kontak">
                    <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      {t('hero.contact_us')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Access Grid */}
      <QuickAccessGrid />

      {/* Statistics Section */}
      <StatsSection />

      {/* Latest News */}
      <NewsSection />

      {/* Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('services.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: t('services.information_portal'),
                description: t('services.information_desc'),
                icon: FileText,
                color: 'bg-blue-500'
              },
              {
                title: t('services.job_market'),
                description: t('services.job_market_desc'),
                icon: Users,
                color: 'bg-green-500'
              },
              {
                title: t('services.umkm_directory'),
                description: t('services.umkm_desc'),
                icon: Store,
                color: 'bg-purple-500'
              },
              {
                title: t('services.financial_transparency'),
                description: t('services.financial_desc'),
                icon: TrendingUp,
                color: 'bg-orange-500'
              }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          {/* Service Hours Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('contact.service_hours_title')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Service Days & Hours */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-100 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {t('contact.service_days_title')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-green-100">{t('contact.monday_thursday')}</span>
                    <span className="font-medium text-white">08.00 – 15.00 WIB</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-green-100">{t('contact.friday')}</span>
                    <span className="font-medium text-white">08.00 – 11.30 WIB</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-green-100">{t('contact.weekend_holiday')}</span>
                    <span className="font-medium text-red-200">{t('contact.closed')}</span>
                  </div>
                </div>
              </div>

              {/* Break Hours */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-100 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {t('contact.break_hours_title')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-green-100">{t('contact.monday_thursday')}</span>
                    <span className="font-medium text-white">12.00 – 13.00 WIB</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-8 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-yellow-100 mb-4 flex items-center">
                💡 {t('contact.notes_title')}:
              </h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-yellow-200 mr-2">1.</span>
                  <span className="text-yellow-100">{t('contact.note_1')}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-200 mr-2">2.</span>
                  <span className="text-yellow-100">{t('contact.note_2')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t('contact.title')}
              </h2>
              <p className="text-green-100 mb-8">
                {t('contact.subtitle')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-green-200" />
                  <span>Jalan Galudra No. 37, Desa Cilame, Kecamatan Ngamprah - 40552</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-green-200" />
                  <span>info@desacilame.com</span>
                </div>

              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">{t('contact.quick_message')}</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder={t('contact.full_name')}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white"
                />
                <input
                  type="email"
                  placeholder={t('contact.email')}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white"
                />
                <textarea
                  placeholder={t('contact.message')}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 text-white resize-none"
                ></textarea>
                <Button className="w-full bg-white text-green-600 hover:bg-gray-100">
                  {t('contact.send_message')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Desa Cilame</h3>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/informasi" className="hover:text-white">{t('services.information_portal')}</Link></li>
                <li><Link href="/pasar-kerja" className="hover:text-white">{t('services.job_market')}</Link></li>
                <li><Link href="/umkm" className="hover:text-white">UMKM</Link></li>
                <li><Link href="/transparansi" className="hover:text-white">{t('services.financial_transparency')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.help')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/panduan" className="hover:text-white">{t('footer.guide')}</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/kontak" className="hover:text-white">{t('nav.contact')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.follow_us')}</h3>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Phone className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </>
  );
}