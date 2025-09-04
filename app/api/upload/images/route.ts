import { NextRequest, NextResponse } from 'next/server';
import { getApiEndpoint } from '@/lib/api-config';

const BACKEND_URL = getApiEndpoint('umkm').replace('/api', '');

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the form data to backend
    const response = await fetch(`${BACKEND_URL}/api/upload/images`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to upload images' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}