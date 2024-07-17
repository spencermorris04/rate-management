// app/api/update-target-occupancy/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { periodLength } = await request.json();

  try {
    const response = await fetch('https://spencermorris.pythonanywhere.com/update_period_length', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('Qq3W6WS9X8C9:Qq3W6WS9X8C9').toString('base64'),
      },
      body: JSON.stringify({ period_length: periodLength }),
    });

    if (!response.ok) {
      throw new Error('Failed to update period length');
    }

    return NextResponse.json({ message: 'Period length updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update period length' }, { status: 500 });
  }
}