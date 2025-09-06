'use client';

import DatabaseHealthCheck from '@/components/DatabaseHealthCheck';

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DatabaseHealthCheck />
    </div>
  );
}