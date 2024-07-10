// app/api/competitor-pricing/route.ts
import { NextResponse } from 'next/server';

interface CompetitorPricingItem {
    Area: number;
    Climate: string;
    Covered: number;
    Drive_Up: string;
    Elevator: number;
    Floor: number;
    Online_Price: number;
    Our_Facility: string;
    Outdoor_Access: number;
    Parking: string | null;
    Promotion_Price: number;
    Regular_Price: number;
    Size: string;
    Size_1: number;
    Size_2: number;
    Store_Name: string;
    Unit: string;
    group_key: string;
}

function sanitizeJSON(jsonString: string): string {
  // Replace NaN, Infinity, and -Infinity with null
  return jsonString.replace(/:\s*(NaN|-?Infinity)\b/g, ': null');
}

export async function GET(): Promise<NextResponse> {
  const username = 'Qq3W6WS9X8C9';
  const password = 'Qq3W6WS9X8C9';

  try {
    const response = await fetch('https://spencermorris.pythonanywhere.com/api/competitor-pricing', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const textData = await response.text();
    const sanitizedData = sanitizeJSON(textData);
    const data: CompetitorPricingItem[] = JSON.parse(sanitizedData);

    // Add a timestamp to the response for debugging
    const timestamp = new Date().toISOString();

    return NextResponse.json(
      { data, timestamp },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
