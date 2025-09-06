'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { checkDatabasesHealth } from '@/lib/api-config';

interface DatabaseStatus {
  status: string;
  port?: number;
  error?: string;
}

interface HealthResults {
  [key: string]: DatabaseStatus;
}

export default function DatabaseHealthCheck() {
  const [healthResults, setHealthResults] = useState<HealthResults>({});
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const results = await checkDatabasesHealth();
      setHealthResults(results);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive">Unhealthy</Badge>;
      default:
        return <Badge variant="secondary">Error</Badge>;
    }
  };

  const databases = [
    { key: 'main', name: 'Main Database', description: 'Users, News, Authentication', port: 5000 },
    { key: 'umkm', name: 'UMKM Database', description: 'Local Business Directory', port: 5001 },
    { key: 'admin', name: 'Admin Database', description: 'Village Officials, Services', port: 5002 },
    { key: 'location', name: 'Location Database', description: 'Villages, Tourism, Geography', port: 5003 }
  ];

  const healthyCount = Object.values(healthResults).filter(r => r.status === 'healthy').length;
  const totalCount = databases.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Database Health Monitor</h1>
          <Button 
            onClick={checkHealth} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="text-sm text-gray-600">
            Last checked: {lastCheck ? lastCheck.toLocaleTimeString() : 'Never'}
          </div>
          <Badge variant={healthyCount === totalCount ? 'default' : 'destructive'} className="bg-blue-100 text-blue-800">
            {healthyCount}/{totalCount} Healthy
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {databases.map((db) => {
          const result = healthResults[db.key];
          const status = result?.status || 'unknown';
          
          return (
            <Card key={db.key} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{db.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    {getStatusBadge(status)}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{db.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Port:</span>
                    <span className="font-mono">{result?.port || db.port}</span>
                  </div>
                  {result?.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overall Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>System Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Database Connectivity:</span>
              <Badge variant={healthyCount === totalCount ? 'default' : 'destructive'}>
                {healthyCount === totalCount ? 'All Systems Operational' : 'Issues Detected'}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>• Frontend is running on port 3003</p>
              <p>• Backend services are distributed across ports 5000-5003</p>
              <p>• Each database handles specific data domains</p>
            </div>

            {healthyCount < totalCount && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting Steps:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>1. Check if all services are running: <code className="bg-yellow-100 px-1 rounded">pm2 status</code></li>
                  <li>2. Restart failed services: <code className="bg-yellow-100 px-1 rounded">pm2 restart all</code></li>
                  <li>3. Check service logs: <code className="bg-yellow-100 px-1 rounded">pm2 logs</code></li>
                  <li>4. Verify port accessibility from the server</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}