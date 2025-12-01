import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Vote } from '@/lib/models';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ episode: string }> }
) {
  try {
    await dbConnect();
    const { episode } = await params;

    let vote = await Vote.findOne({ movieEpisode: episode });
    if (!vote) {
      vote = new Vote({ movieEpisode: episode, likes: 0, dislikes: 0 });
      await vote.save();
    }

    return NextResponse.json(vote);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching votes', error }, { status: 500 });
  }
}
