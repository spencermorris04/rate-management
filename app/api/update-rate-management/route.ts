// app/api/update-rate-management/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const username = 'Qq3W6WS9X8C9';
  const password = 'Qq3W6WS9X8C9';

  try {
    const data = await request.json();
    console.log('Received data:', data); // Log received data

    const response = await fetch('https://spencermorris.pythonanywhere.com/api/update_rate_management', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status); // Log response status

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText); // Log error response
      throw new Error(`Failed to update data: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();
    console.log('Update result:', result); // Log update result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
