// app/api/update-target-occupancy/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { targetOccupancy } = await request.json();

  try {
    const response = await fetch('https://spencermorris.pythonanywhere.com/update_target_occupancy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('Qq3W6WS9X8C9:Qq3W6WS9X8C9').toString('base64'),
      },
      body: JSON.stringify({ target_occupancy: targetOccupancy }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update target occupancy');
    }

    return NextResponse.json({ message: 'Target occupancy updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update target occupancy' }, { status: 500 });
  }
}