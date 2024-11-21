'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useDrillContext, useDrillActions } from '@/context/DrillContext';
import { drillsApi } from '@/lib/api';

export function WorkoutGenerator() {
  const { state } = useDrillContext();
  const { setGeneratedWorkouts, setLoading, setError } = useDrillActions();
  const [drillCount, setDrillCount] = useState(5);

  const generateWorkout = async () => {
    try {
      setLoading(true);
      setError(null);

      const workouts = await drillsApi.generateWorkout({
        category: state.selectedCategory,
        count: drillCount,
      });

      setGeneratedWorkouts(workouts);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate workout');
      console.error('Error generating workout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <label htmlFor="drillCount" className="block text-sm font-medium">
            Number of Drills
          </label>
          <input
            type="number"
            id="drillCount"
            value={drillCount}
            onChange={(e) => setDrillCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="block w-full rounded-md border border-input bg-background px-3 py-2"
            min="1"
            max="10"
          />
        </div>
        <Button
          onClick={generateWorkout}
          disabled={state.isLoading}
          className="w-full sm:w-auto"
        >
          {state.isLoading ? 'Generating...' : 'Generate Workout'}
        </Button>
      </div>

      {state.error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {state.generatedWorkouts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Generated Workout</h3>
          <div className="divide-y divide-border rounded-lg border">
            {state.generatedWorkouts.map((drill, index) => (
              <div key={drill.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">
                      {index + 1}. {drill.name}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {drill.description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-1">
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                      {drill.category}
                    </span>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary">
                      {drill.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
