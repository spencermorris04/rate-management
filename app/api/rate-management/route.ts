// app/api/rate-management/route.ts
import { NextResponse } from 'next/server';

interface RateManagementItem {
    facility_name: string;
    group_name: string;
    total_units: number;
    occupied_units: number;
    occupancy_rate: number;
    historical_move_ins_last_60_days_group: number;
    move_ins_last_60_days_group: number;
    historical_move_ins_next_60_days_group: number;
    projected_move_ins_group: number;
    facility_projected_move_ins_scaled: number;
    blended_move_in_projection: number;
    blended_move_out_projection: number;
    projected_net_rentals: number;
    competitor_count: number;
    competitor_percentage_cheaper: number;
    mean_competitor_price: number;
    competitor_impact: number;
    projected_occupancy_impact: number;
    leasing_velocity_impact: number;
    long_term_customer_average: number | null;
    average_web_rate: number;
    average_standard_rate: number;
    recent_period_average_move_in_rent: number | null;
    suggested_web_rate: number | null;
  }

function sanitizeJSON(jsonString: string): string {
  // Replace NaN, Infinity, and -Infinity with null
  return jsonString.replace(/:\s*(NaN|-?Infinity)\b/g, ': null');
}

export async function GET(): Promise<NextResponse> {
  const username = 'Qq3W6WS9X8C9';
  const password = 'Qq3W6WS9X8C9';

  try {
    const response = await fetch('https://spencermorris.pythonanywhere.com/api/rate-management', {
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
    const data: RateManagementItem[] = JSON.parse(sanitizedData);

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