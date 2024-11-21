import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Drill } from '@/lib/db/models/Drill';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'category';
    const order = searchParams.get('order') || 'asc';
    
    // Build query
    const query = category && category !== 'All' 
      ? { category }
      : {};
    
    // Build sort object
    const sort: { [key: string]: 'asc' | 'desc' } = {
      [sortBy]: order as 'asc' | 'desc'
    };
    
    const drills = await Drill.find(query)
      .sort(sort)
      .select('-__v')
      .lean();
    
    // Transform _id to id in response
    const transformedDrills = drills.map(drill => ({
      ...drill,
      id: drill._id,
      _id: undefined
    }));
    
    return NextResponse.json(transformedDrills);
  } catch (error) {
    console.error('Error fetching drills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drills' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'category', 'difficulty'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Validation Error',
        errors: missingFields.reduce((acc, field) => ({
          ...acc,
          [field]: [`${field} is required`]
        }), {})
      }, { status: 400 });
    }

    const drill = await Drill.create(body);
    
    return NextResponse.json(drill, { status: 201 });
  } catch (error: any) {
    console.error('Error creating drill:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors: { [key: string]: string[] } = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = [error.errors[key].message];
      });
      return NextResponse.json(
        { error: 'Validation Error', errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create drill' },
      { status: 500 }
    );
  }
}
