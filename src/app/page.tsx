'use client';

import { useState } from 'react';
import { DrillsGrid } from '@/components/drills/DrillsGrid';
import { DrillUploadForm } from '@/components/forms/DrillUploadForm';
import { WorkoutGenerator } from '@/components/workout/WorkoutGenerator';
import { Tabs } from '@/components/ui/Tabs';

const tabs = [
  { id: 'drills', label: 'Browse Drills' },
  { id: 'upload', label: 'Upload Drill' },
  { id: 'workout', label: 'Generate Workout' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('drills');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Hamzawy Fitness
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              Your personal fitness drill management platform
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Tabs Navigation */}
        <div className="mb-8">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'drills' && (
            <div className="animate-fadeIn">
              <DrillsGrid />
            </div>
          )}
          
          {activeTab === 'upload' && (
            <div className="animate-fadeIn">
              <DrillUploadForm />
            </div>
          )}
          
          {activeTab === 'workout' && (
            <div className="animate-fadeIn">
              <WorkoutGenerator />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
