import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Comment } from '@/lib/models';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const comment = new Comment({
      movieEpisode: body.movieEpisode,
      name: body.name,
      comment: body.comment,
    });

    const newComment = await comment.save();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding comment', error }, { status: 400 });
  }
}
