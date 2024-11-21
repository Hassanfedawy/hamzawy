import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { WorkoutTemplate } from '@/lib/db/models/WorkoutTemplate';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const sortBy = searchParams.get('sortBy') || 'usageCount';
    const order = searchParams.get('order') || 'desc';
    
    // Build query
    const query: any = { isPublic: true };
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    
    // Build sort object
    const sort: { [key: string]: 'asc' | 'desc' } = {
      [sortBy]: order as 'asc' | 'desc'
    };
    
    // Get total count for pagination
    const total = await WorkoutTemplate.countDocuments(query);
    
    // Fetch templates with pagination
    const templates = await WorkoutTemplate.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Transform response
    const transformedTemplates = templates.map(template => ({
      ...template,
      id: template._id,
      _id: undefined
    }));
    
    return NextResponse.json({
      templates: transformedTemplates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching workout templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout templates' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'type', 'difficulty', 'drillCount', 'targetDuration'];
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
    
    // Create template
    const template = await WorkoutTemplate.create(body);
    
    // Transform response
    const transformedTemplate = {
      ...template.toObject(),
      id: template._id,
      _id: undefined
    };
    
    return NextResponse.json(transformedTemplate, { status: 201 });
  } catch (error: any) {
    console.error('Error creating workout template:', error);
    
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
    
    // Handle duplicate name error
    if (error.code === 11000) {
      return NextResponse.json({
        error: 'Validation Error',
        errors: {
          name: ['Template name must be unique']
        }
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create workout template' },
      { status: 500 }
    );
  }
}
