import { Card, CardContent } from '@/components/ui/card';
import { Users, Home, Store, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';

// Custom hook for counting animation
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const currentCount = Math.floor(progress * (end - startValue) + startValue);
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
}

export default function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('stats.total_population'),
      value: '34,700',
      numericValue: 34700,
      subtitle: t('stats.population_subtitle'),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: t('stats.family_heads'),
      value: '2,156',
      numericValue: 2156,
      subtitle: t('stats.family_subtitle'),
      icon: Home,
      color: 'text-green-600'
    },
    {
      title: t('stats.active_umkm'),
      value: '342',
      numericValue: 342,
      subtitle: t('stats.umkm_subtitle'),
      icon: Store,
      color: 'text-purple-600'
    },
    {
      title: t('stats.growth'),
      value: '12.5%',
      numericValue: 12.5,
      isPercentage: true,
      subtitle: t('stats.growth_subtitle'),
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('stats.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('stats.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const { count, setIsVisible } = useCountUp(stat.numericValue);
            
            useEffect(() => {
              const timer = setTimeout(() => setIsVisible(true), index * 200);
              return () => clearTimeout(timer);
            }, [setIsVisible, index]);
            
            const formatValue = (value: number) => {
              if (stat.isPercentage) {
                return `${value.toFixed(1)}%`;
              }
              return value.toLocaleString();
            };
            
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatValue(count)}
                  </h3>
                  <p className="font-semibold text-gray-700 mb-1">{stat.title}</p>
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}