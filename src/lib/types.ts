export interface Drill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment?: string[];
  intensity?: 'Low' | 'Medium' | 'High';
}

export interface WorkoutExercise {
  drill: Drill;
  sets?: number;
  repsPerSet?: number;
  timePerSet?: number;
  restAfter?: number;
  workTime?: number;
  restTime?: number;
  duration?: number;
  holdTime?: number;
  repetitions?: number;
}

export interface WorkoutStructure {
  exercises: WorkoutExercise[];
  rounds?: number;
  restBetweenRounds?: number;
  circuits?: number;
  restBetweenCircuits?: number;
}

export interface GeneratedWorkout {
  type: string;
  style?: string;
  difficulty?: string;
  drillCount: number;
  workoutId: string;
  structure: WorkoutStructure;
  drills: Drill[];
}
