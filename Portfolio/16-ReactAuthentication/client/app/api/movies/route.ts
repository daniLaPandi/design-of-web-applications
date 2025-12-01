import { NextResponse } from 'next/server';
import { moviesData } from '@/lib/moviesData';

export async function GET() {
  return NextResponse.json(moviesData);
}
