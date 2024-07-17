// app/api/get-preferences/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`https://spencermorris.pythonanywhere.com/get_preferences?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Buffer.from('Qq3W6WS9X8C9:Qq3W6WS9X8C9').toString('base64'),
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
    }
  }