import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json();
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/analyze_wallet?t=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ wallet }),
      cache: 'no-store'
    });

    // Read the response body once
    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse backend response as JSON:', responseText);
      return NextResponse.json(
        { 
          error: 'Invalid response from backend',
          details: 'The backend returned an invalid JSON response'
        },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error('Backend error:', response.status, responseData);
      return NextResponse.json(
        {
          error: responseData?.error || 'Backend error',
          details: responseData?.details || responseData?.message || 'Unknown error occurred'
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error in analyze_wallet API route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}
