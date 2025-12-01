import { NextResponse } from 'next/server';
import { moviesData } from '@/lib/moviesData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ episode: string }> }
) {
  const { episode } = await params;
  const movie = moviesData.find(m => m.episode === episode);

  if (movie) {
    return NextResponse.json(movie);
  }

  return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
}
