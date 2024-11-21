import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Drill } from '@/lib/db/models/Drill';
import { WorkoutTemplate } from '@/lib/db/models/WorkoutTemplate';
import { WorkoutHistory } from '@/lib/db/models/WorkoutHistory';

// Valid workout types and difficulties
const WORKOUT_TYPES = ['Upper Body', 'Lower Body', 'Max Speed', 'Endurance', 'Plyometrics'] as const;
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;
const WORKOUT_STYLES = ['Circuit', 'HIIT', 'Strength', 'Endurance', 'Flexibility'] as const;

type WorkoutType = typeof WORKOUT_TYPES[number];
type Difficulty = typeof DIFFICULTIES[number];
type WorkoutStyle = typeof WORKOUT_STYLES[number];

// Type guards
function isValidWorkoutType(type: string): boolean {
  return WORKOUT_TYPES.includes(type as WorkoutType);
}

function isValidDifficulty(difficulty: string): boolean {
  return DIFFICULTIES.includes(difficulty as Difficulty);
}

function isValidWorkoutStyle(style: string): boolean {
  return WORKOUT_STYLES.includes(style as WorkoutStyle);
}

interface WorkoutGenerationOptions {
  type: WorkoutType;
  count: number;
  difficulty?: Difficulty;
  templateId?: string;
  excludeDrills?: string[];
  preferredEquipment?: string[];
  intensity?: 'Low' | 'Medium' | 'High';
  workoutStyle?: WorkoutStyle;
  restBetweenSets?: number; // in seconds
  setsPerExercise?: number;
  timePerExercise?: number; // in seconds
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    const options: WorkoutGenerationOptions = body;

    // Validate basic requirements
    if (!options.type || !isValidWorkoutType(options.type)) {
      return NextResponse.json({
        error: 'Validation Error',
        errors: {
          type: [`Type must be one of: ${WORKOUT_TYPES.join(', ')}`]
        }
      }, { status: 400 });
    }

    if (!options.count || typeof options.count !== 'number' || options.count < 1) {
      return NextResponse.json({
        error: 'Validation Error',
        errors: {
          count: ['Count must be a positive number']
        }
      }, { status: 400 });
    }

    // Validate workout style if provided
    if (options.workoutStyle && !isValidWorkoutStyle(options.workoutStyle)) {
      return NextResponse.json({
        error: 'Validation Error',
        errors: {
          workoutStyle: [`Style must be one of: ${WORKOUT_STYLES.join(', ')}`]
        }
      }, { status: 400 });
    }

    // If templateId is provided, use template settings
    if (options.templateId) {
      const template = await WorkoutTemplate.findById(options.templateId);
      if (!template) {
        return NextResponse.json({
          error: 'Template not found'
        }, { status: 404 });
      }

      // Merge template settings with options
      options.type = template.type;
      options.count = template.drillCount;
      options.difficulty = template.difficulty as Difficulty;
      if (template.filters) {
        options.preferredEquipment = template.filters.equipment;
        options.intensity = template.filters.intensity;
      }

      // Increment template usage count
      await WorkoutTemplate.findByIdAndUpdate(
        options.templateId,
        { $inc: { usageCount: 1 } }
      );
    }

    // Build the query based on workout type
    const query: any = { difficulty: options.difficulty };
    if (options.type === 'Upper Body') {
      query.category = { $in: ['Push', 'Pull', 'Upper Body'] };
    } else if (options.type === 'Lower Body') {
      query.category = { $in: ['Legs', 'Lower Body'] };
    } else if (options.type === 'Max Speed') {
      query.category = { $in: ['Speed', 'Agility'] };
    } else if (options.type === 'Endurance') {
      query.intensity = 'High';
    } else if (options.type === 'Plyometrics') {
      query.category = { $in: ['Plyometrics', 'Jump Training'] };
    }

    // Get matching drills
    const drills = await Drill.aggregate([
      { $match: query },
      { $sample: { size: options.count } }
    ]);

    if (!drills.length) {
      return NextResponse.json(
        { error: 'No matching drills found for the specified criteria' },
        { status: 404 }
      );
    }

    // Structure the workout based on style
    let structure: any = {
      exercises: drills.map((drill: any) => ({
        drill,
        sets: options.setsPerExercise || 3,
        timePerSet: options.timePerExercise || 45,
        restAfter: options.restBetweenSets || 30
      }))
    };

    switch (options.workoutStyle?.toLowerCase()) {
      case 'circuit':
        structure.rounds = 3;
        structure.restBetweenRounds = 60;
        break;
      case 'hiit':
        structure.exercises = structure.exercises.map((ex: any) => ({
          ...ex,
          workTime: 30,
          restTime: 15
        }));
        structure.rounds = 4;
        structure.restBetweenRounds = 90;
        break;
      case 'strength':
        structure.exercises = structure.exercises.map((ex: any) => ({
          ...ex,
          sets: 4,
          repsPerSet: 8,
          restAfter: 90
        }));
        break;
      case 'endurance':
        structure.exercises = structure.exercises.map((ex: any) => ({
          ...ex,
          sets: 3,
          repsPerSet: 15,
          restAfter: 45
        }));
        structure.circuits = 2;
        structure.restBetweenCircuits = 120;
        break;
      case 'flexibility':
        structure.exercises = structure.exercises.map((ex: any) => ({
          ...ex,
          holdTime: 30,
          repetitions: 3,
          restAfter: 20
        }));
        break;
    }

    const workout = {
      type: options.type,
      style: options.workoutStyle,
      difficulty: options.difficulty,
      drillCount: drills.length,
      workoutId: Math.random().toString(36).substr(2, 9),
      structure,
      drills
    };

    // Create workout history entry
    const workoutHistory = await WorkoutHistory.create({
      type: options.type,
      drills: drills.map(d => d._id),
      difficulty: options.difficulty || 'Intermediate',
      duration: 0, // Will be updated when workout is completed
      rating: 0, // Will be updated when workout is rated
      style: options.workoutStyle
    });

    return NextResponse.json({
      ...workout,
      workoutId: workoutHistory._id
    });
  } catch (error) {
    console.error('Error generating workout:', error);
    return NextResponse.json(
      { error: 'Failed to generate workout' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch available workout types and templates
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const includeTemplates = searchParams.get('includeTemplates') === 'true';
    
    // Get count of drills for each workout type and difficulty
    const workoutTypes = await Promise.all(
      WORKOUT_TYPES.map(async (type) => {
        const drillsByDifficulty = await Promise.all(
          DIFFICULTIES.map(async (difficulty) => ({
            difficulty,
            count: await Drill.countDocuments({ category: type, difficulty })
          }))
        );

        return {
          type,
          totalDrills: drillsByDifficulty.reduce((sum, { count }) => sum + count, 0),
          byDifficulty: drillsByDifficulty
        };
      })
    );

    const response: any = {
      workoutTypes,
      total: workoutTypes.reduce((sum, { totalDrills }) => sum + totalDrills, 0)
    };

    // Include templates if requested
    if (includeTemplates) {
      const templates = await WorkoutTemplate.find(
        { isPublic: true },
        { __v: 0 }
      )
      .sort({ usageCount: -1 })
      .limit(10);

      response.popularTemplates = templates.map(template => ({
        ...template.toObject(),
        id: template._id,
        _id: undefined
      }));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching workout types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout types' },
      { status: 500 }
    );
  }
}
