import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileText, 
  Users, 
  Store, 
  MessageSquare, 
  Heart,
  UserPlus,
  FileCheck,
  BarChart3
} from 'lucide-react';

export default function QuickAccessGrid() {
  const { t } = useLanguage();

  const quickAccessItems = [
    {
      title: t('quick.online_letter'),
      description: t('quick.online_letter_desc'),
      icon: FileText,
      href: '/layanan/surat-online',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: t('quick.village_umkm'),
      description: t('quick.village_umkm_desc'),
      icon: Store,
      href: '/umkm',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: t('quick.citizen_report'),
      description: t('quick.citizen_report_desc'),
      icon: MessageSquare,
      href: '/laporan',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: t('quick.social_aid'),
      description: t('quick.social_aid_desc'),
      icon: Heart,
      href: '/bansos',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: t('quick.job_market'),
      description: t('quick.job_market_desc'),
      icon: Users,
      href: '/pasar-kerja',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: t('quick.population'),
      description: t('quick.population_desc'),
      icon: UserPlus,
      href: '/penduduk',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: t('quick.transparency'),
      description: t('quick.transparency_desc'),
      icon: FileCheck,
      href: '/transparansi',
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      title: 'Statistik Penduduk Cilame',
      description: 'Lihat data statistik penduduk desa',
      icon: BarChart3,
      href: '/transparansi/statistik-penduduk',
      color: 'bg-cyan-500 hover:bg-cyan-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('quick.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('quick.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {quickAccessItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-gray-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className={`${item.color} w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 transition-colors`}>
                    <item.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-tight">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}