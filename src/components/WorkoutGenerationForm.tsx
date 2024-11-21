"use client"
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { GeneratedWorkout } from '@/lib/types';
import { WorkoutDisplay } from './WorkoutDisplay';

const WORKOUT_TYPES = ['Upper Body', 'Lower Body', 'Max Speed', 'Endurance', 'Plyometrics'] as const;
const WORKOUT_STYLES = ['Circuit', 'HIIT', 'Strength', 'Endurance', 'Flexibility'] as const;
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const WorkoutGenerationForm: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<GeneratedWorkout | null>(null);
  const [formData, setFormData] = useState({
    type: WORKOUT_TYPES[0],
    count: 5,
    workoutStyle: WORKOUT_STYLES[0],
    difficulty: DIFFICULTIES[1],
    timePerExercise: 45,
    restBetweenSets: 30,
    setsPerExercise: 3
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedWorkout(null);

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate workout');
      }

      const workout = await response.json();
      setGeneratedWorkout(workout);
      toast.success('Workout generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate workout');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workout Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Workout Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {WORKOUT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Workout Style */}
          <div>
            <label htmlFor="workoutStyle" className="block text-sm font-medium text-gray-700 mb-2">
              Workout Style
            </label>
            <select
              id="workoutStyle"
              name="workoutStyle"
              value={formData.workoutStyle}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {WORKOUT_STYLES.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {DIFFICULTIES.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>

          {/* Exercise Count */}
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Exercises
            </label>
            <input
              type="number"
              id="count"
              name="count"
              min="3"
              max="12"
              value={formData.count}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Time Settings */}
          <div>
            <label htmlFor="timePerExercise" className="block text-sm font-medium text-gray-700 mb-2">
              Time per Exercise (seconds)
            </label>
            <input
              type="number"
              id="timePerExercise"
              name="timePerExercise"
              min="15"
              max="120"
              value={formData.timePerExercise}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Rest Time */}
          <div>
            <label htmlFor="restBetweenSets" className="block text-sm font-medium text-gray-700 mb-2">
              Rest Between Sets (seconds)
            </label>
            <input
              type="number"
              id="restBetweenSets"
              name="restBetweenSets"
              min="10"
              max="120"
              value={formData.restBetweenSets}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Workout'}
          </button>
        </div>
      </form>

      {/* Display generated workout */}
      <WorkoutDisplay workout={generatedWorkout} />
    </div>
  );
};
