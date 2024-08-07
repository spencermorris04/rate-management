// /api/get-competitor-pricing/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400; // Revalidate once per day

interface CompetitorPricing {
  'Our Facility': string;
  'Store Name': string;
  'Unit': string;
  'Drive Up': string | null;
  'Regular Price': number;
  'Online Price': number;
  'group_key': string;
  'Area': number;
  'Climate': string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const username = 'Qq3W6WS9X8C9';
  const password = 'Qq3W6WS9X8C9';

  try {
    // Parse the request body to get the group_keys and facility_id
    const { group_keys, facility_id } = await request.json();

    if (!Array.isArray(group_keys) || typeof facility_id !== 'string') {
      return new NextResponse(JSON.stringify({ error: 'Invalid input format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch competitor pricing data
    const response = await fetch('https://spencermorris.pythonanywhere.com/api/competitor-pricing', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch competitor pricing data');
    }

    const competitorPricing: CompetitorPricing[] = await response.json();

    // Filter and map the data
    const filteredData = competitorPricing
      .filter(item => {
        // First, check if the facility matches
        if (item['Our Facility'] !== facility_id) {
          return false;
        }

        // Then, check for an exact match of the group_key
        return group_keys.some(groupKey => {
          const [itemSize, ...itemRest] = item.group_key.split('|').map((s: string) => s.trim());
          const [groupSize, ...groupRest] = groupKey.split('|').map((s: string) => s.trim());

          // Compare sizes (allowing for some floating point imprecision)
          const sizeMatch = Math.abs(parseFloat(itemSize) - parseFloat(groupSize)) < 0.01;

          // Compare the rest of the group_key (climate control status, etc.)
          const restMatch = itemRest.join('|') === groupRest.join('|');

          return sizeMatch && restMatch;
        });
      })
      .map(({ 'Store Name': storeName, Unit, 'Drive Up': driveUp, 'Regular Price': regularPrice, 'Online Price': onlinePrice, group_key }) => ({
        storeName,
        unit: Unit,
        driveUp,
        regularPrice,
        onlinePrice,
        group_key
      }));

    if (filteredData.length === 0) {
      console.log('No matches found. Facility ID:', facility_id, 'Group Keys:', group_keys);
    } else {
      console.log('Matches found:', filteredData.length);
    }

    return NextResponse.json(filteredData, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in get-competitor-pricing:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch or process data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}