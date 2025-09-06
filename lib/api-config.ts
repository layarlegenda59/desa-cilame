// API Configuration for Multi-Database Backend

// Function to get base URL dynamically
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current domain
    const url = new URL(window.location.origin);
    return `${url.protocol}//${url.hostname}`;
  }
  // Server-side: use environment variable or localhost
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost';
}

// Base URLs for different database servers
export const API_ENDPOINTS = {
  main: process.env.NEXT_PUBLIC_MAIN_API_URL || `${getBaseUrl()}:5000/api`,
  umkm: process.env.NEXT_PUBLIC_UMKM_API_URL || `${getBaseUrl()}:5001/api`,
  admin: process.env.NEXT_PUBLIC_ADMIN_API_URL || `${getBaseUrl()}:5002/api`,
  location: process.env.NEXT_PUBLIC_LOCATION_API_URL || `${getBaseUrl()}:5003/api`
};

// Health check endpoints
export const HEALTH_ENDPOINTS = {
  main: process.env.NEXT_PUBLIC_MAIN_API_URL?.replace('/api', '') || `${getBaseUrl()}:5000`,
  umkm: process.env.NEXT_PUBLIC_UMKM_API_URL?.replace('/api', '') || `${getBaseUrl()}:5001`,
  admin: process.env.NEXT_PUBLIC_ADMIN_API_URL?.replace('/api', '') || `${getBaseUrl()}:5002`,
  location: process.env.NEXT_PUBLIC_LOCATION_API_URL?.replace('/api', '') || `${getBaseUrl()}:5003`
};

// Database server mapping based on data domain
export const DATABASE_MAPPING = {
  // Main database (users, news, authentication)
  users: 'main',
  news: 'main',
  auth: 'main',
  login: 'main',
  
  // UMKM database
  umkm: 'umkm',
  'umkm-categories': 'umkm',
  
  // Admin database (village officials, services, regulations)
  'village-officials': 'admin',
  perangkat: 'admin',
  services: 'admin',
  regulations: 'admin',
  reports: 'admin',
  
  // Location database (villages, hamlets, tourism)
  villages: 'location',
  hamlets: 'location',
  tourism: 'location',
  geography: 'location'
};

// Helper function to get the correct API endpoint based on data type
export function getApiEndpoint(dataType: keyof typeof DATABASE_MAPPING): string {
  const database = DATABASE_MAPPING[dataType];
  if (!database) {
    console.warn(`Unknown data type: ${dataType}, defaulting to main database`);
    return API_ENDPOINTS.main;
  }
  return API_ENDPOINTS[database as keyof typeof API_ENDPOINTS];
}

// Helper function to get health check endpoint
export function getHealthEndpoint(database: keyof typeof HEALTH_ENDPOINTS): string {
  return `${HEALTH_ENDPOINTS[database]}/health`;
}

// Helper function to check if all databases are healthy
export async function checkDatabasesHealth(): Promise<{
  [key: string]: { status: string; port?: number; error?: string }
}> {
  const results: { [key: string]: { status: string; port?: number; error?: string } } = {};
  
  for (const [database, endpoint] of Object.entries(HEALTH_ENDPOINTS)) {
    try {
      const response = await fetch(`${endpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        results[database] = {
          status: data.status || 'healthy',
          port: data.port
        };
      } else {
        results[database] = {
          status: 'unhealthy',
          error: `HTTP ${response.status}`
        };
      }
    } catch (error) {
      results[database] = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  return results;
}

// Helper function to make API requests with automatic endpoint selection
export async function apiRequest(
  dataType: keyof typeof DATABASE_MAPPING,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const baseUrl = getApiEndpoint(dataType);
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  return fetch(url, mergedOptions);
}

// Legacy support - for backward compatibility with existing code
export const BACKEND_URL = process.env.BACKEND_URL || API_ENDPOINTS.main.replace('/api/v1', '');

// Export types for TypeScript
export type DatabaseType = keyof typeof API_ENDPOINTS;
export type DataType = keyof typeof DATABASE_MAPPING;