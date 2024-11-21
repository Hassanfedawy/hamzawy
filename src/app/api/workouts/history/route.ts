import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { WorkoutHistory } from '@/lib/db/models/WorkoutHistory';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build query
    const query: any = {};
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    
    // Get total count for pagination
    const total = await WorkoutHistory.countDocuments(query);
    
    // Fetch workouts with pagination
    const workouts = await WorkoutHistory.find(query)
      .populate('drills', '-__v') // Populate drill details
      .sort({ completedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Transform response
    const transformedWorkouts = workouts.map(workout => ({
      ...workout,
      id: workout._id,
      _id: undefined,
      drills: workout.drills.map((drill: any) => ({
        ...drill,
        id: drill._id,
        _id: undefined
      }))
    }));
    
    return NextResponse.json({
      workouts: transformedWorkouts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching workout history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout history' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { workoutId, duration, rating, notes } = body;
    
    if (!workoutId) {
      return NextResponse.json({
        error: 'Workout ID is required'
      }, { status: 400 });
    }
    
    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json({
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }
    
    // Update workout history
    const workout = await WorkoutHistory.findByIdAndUpdate(
      workoutId,
      {
        $set: {
          ...(duration !== undefined && { duration }),
          ...(rating !== undefined && { rating }),
          ...(notes !== undefined && { notes })
        }
      },
      { new: true }
    ).populate('drills', '-__v');
    
    if (!workout) {
      return NextResponse.json({
        error: 'Workout not found'
      }, { status: 404 });
    }
    
    // Transform response
    const transformedWorkout = {
      ...workout.toObject(),
      id: workout._id,
      _id: undefined,
      drills: workout.drills.map((drill: any) => ({
        ...drill.toObject(),
        id: drill._id,
        _id: undefined
      }))
    };
    
    return NextResponse.json(transformedWorkout);
  } catch (error) {
    console.error('Error updating workout history:', error);
    return NextResponse.json(
      { error: 'Failed to update workout history' },
      { status: 500 }
    );
  }
}
