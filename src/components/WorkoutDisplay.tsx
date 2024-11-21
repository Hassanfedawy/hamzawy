import React from 'react';
import { GeneratedWorkout } from '@/lib/types';

interface WorkoutDisplayProps {
  workout: GeneratedWorkout | null;
}

export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workout }) => {
  if (!workout) return null;

  const getExerciseDetails = (exercise: any) => {
    if (workout.style?.toLowerCase() === 'hiit') {
      return `${exercise.workTime}s work / ${exercise.restTime}s rest`;
    } else if (workout.style?.toLowerCase() === 'flexibility') {
      return `${exercise.holdTime}s hold × ${exercise.repetitions} reps`;
    } else if (exercise.sets && exercise.repsPerSet) {
      return `${exercise.sets} sets × ${exercise.repsPerSet} reps`;
    } else if (exercise.timePerSet) {
      return `${exercise.timePerSet}s per set × ${exercise.sets} sets`;
    }
    return `${exercise.sets} sets`;
  };

  const getWorkoutStructure = () => {
    if (workout.style?.toLowerCase() === 'circuit') {
      return `${workout.structure.rounds} rounds with ${workout.structure.restBetweenRounds}s rest between rounds`;
    } else if (workout.style?.toLowerCase() === 'hiit') {
      return `${workout.structure.rounds} rounds with ${workout.structure.restBetweenRounds}s rest between rounds`;
    } else if (workout.structure.circuits) {
      return `${workout.structure.circuits} circuits with ${workout.structure.restBetweenCircuits}s rest between circuits`;
    }
    return '';
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Generated Workout</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {workout.type}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            {workout.style}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {workout.difficulty}
          </span>
        </div>
        {getWorkoutStructure() && (
          <p className="text-gray-600 mb-4">{getWorkoutStructure()}</p>
        )}
      </div>

      <div className="space-y-4">
        {workout.structure.exercises.map((exercise, index) => (
          <div
            key={exercise.drill.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {index + 1}. {exercise.drill.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {exercise.drill.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {getExerciseDetails(exercise)}
                  </span>
                  {exercise.restAfter && (
                    <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm">
                      {exercise.restAfter}s rest
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
