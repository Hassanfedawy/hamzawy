"use client"

import { WorkoutGenerationForm } from '@/components/WorkoutGenerationForm';
import { Toaster } from 'react-hot-toast';

export default function GenerateWorkoutPage() {
  return (
    <>
      <Toaster position="top-center" />
      <div className="container max-w-4xl py-10">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Generate Your Workout</h1>
            <p className="text-gray-600 mt-2">
              Select your preferences below to generate a customized workout routine.
            </p>
          </div>
          <WorkoutGenerationForm />
        </div>
      </div>
    </>
  );
}
