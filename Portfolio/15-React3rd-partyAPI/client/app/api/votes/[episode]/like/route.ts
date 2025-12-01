import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Vote } from '@/lib/models';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ episode: string }> }
) {
  try {
    await dbConnect();
    const { episode } = await params;

    let vote = await Vote.findOne({ movieEpisode: episode });
    if (!vote) {
      vote = new Vote({ movieEpisode: episode, likes: 1, dislikes: 0 });
    } else {
      vote.likes += 1;
    }

    const updatedVote = await vote.save();
    return NextResponse.json(updatedVote);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating vote', error }, { status: 400 });
  }
}
