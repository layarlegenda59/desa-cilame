'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import Image from 'next/image';
import { getApiEndpoint } from '@/lib/api-config';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('adminToken');
    if (token && token !== 'null' && token !== 'undefined') {
      setIsRedirecting(true);
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Form submitted with data:', formData);

    try {
      // Call backend login API
      const response = await fetch(`${getApiEndpoint('auth')}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.username.includes('@') ? formData.username : `${formData.username}@desacilame.com`,
          password: formData.password
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        // Store token in localStorage and cookies
        localStorage.setItem('adminToken', data.data.access_token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.user));
        
        // Set cookie for middleware authentication
        document.cookie = `adminToken=${data.data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        
        console.log('Login successful, redirecting to dashboard...');
        
        // Show success message and set redirecting state
        setError('');
        setIsRedirecting(true);
        
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          // Force redirect using window.location for more reliable redirect
          window.location.href = '/admin/dashboard';
        }, 500);
      } else {
        setError(data.message || 'Username atau password salah');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login. Pastikan server backend berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Desa Cilame - Sistem Manajemen
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {isRedirecting && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  Login berhasil! Mengarahkan ke dashboard...
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Masukkan username"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading || isRedirecting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isRedirecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengarahkan ke dashboard...
                  </>
                ) : isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Demo Credentials: admin / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}