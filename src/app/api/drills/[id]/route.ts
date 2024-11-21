import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Drill } from '@/lib/db/models/Drill';
import mongoose from 'mongoose';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid drill ID format' },
        { status: 400 }
      );
    }

    const drill = await Drill.findByIdAndDelete(params.id);

    if (!drill) {
      return NextResponse.json(
        { error: 'Drill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Drill deleted successfully',
      id: params.id,
      deletedDrill: {
        ...drill.toObject(),
        id: drill._id,
        _id: undefined
      }
    });
  } catch (error) {
    console.error('Error deleting drill:', error);
    return NextResponse.json(
      { error: 'Failed to delete drill' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid drill ID format' },
        { status: 400 }
      );
    }

    const drill = await Drill.findById(params.id);

    if (!drill) {
      return NextResponse.json(
        { error: 'Drill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(drill);
  } catch (error) {
    console.error('Error fetching drill:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drill' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid drill ID format' },
        { status: 400 }
      );
    }

    const body = await req.json();

    const drill = await Drill.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!drill) {
      return NextResponse.json(
        { error: 'Drill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(drill);
  } catch (error: any) {
    console.error('Error updating drill:', error);

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
      { error: 'Failed to update drill' },
      { status: 500 }
    );
  }
}
