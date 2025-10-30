import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json();
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/analyze_wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallet }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Backend error: ${error}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze wallet' },
      { status: 500 }
    );
  }
}
