import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Vote } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const votes = await Vote.find();
    return NextResponse.json(votes);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching votes', error }, { status: 500 });
  }
}
