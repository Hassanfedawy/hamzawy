import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Drill } from '@/lib/db/models/Drill';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { category, count = 5 } = await req.json();
    
    const query = category && category !== 'All'
      ? { category }
      : {};
    
    // Fetch random drills based on category
    const drills = await Drill.aggregate([
      { $match: query },
      { $sample: { size: Number(count) } }
    ]);
    
    if (!drills.length) {
      return NextResponse.json(
        { error: 'No drills found for the specified category' },
        { status: 404 }
      );
    }
    
    // Transform _id to id in response
    const transformedDrills = drills.map(drill => ({
      ...drill,
      id: drill._id,
      _id: undefined,
      __v: undefined
    }));
    
    return NextResponse.json(transformedDrills);
  } catch (error) {
    console.error('Error generating workout:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout' },
      { status: 500 }
    );
  }
}
