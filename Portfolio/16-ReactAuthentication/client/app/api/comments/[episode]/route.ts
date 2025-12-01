import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Comment } from '@/lib/models';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ episode: string }> }
) {
  try {
    await dbConnect();
    const { episode } = await params;

    const comments = await Comment.find({ movieEpisode: episode }).sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching comments', error }, { status: 500 });
  }
}
