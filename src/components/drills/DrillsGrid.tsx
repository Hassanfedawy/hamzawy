'use client';

import { useEffect } from 'react';
import { DrillCard } from './DrillCard';
import { Button } from '@/components/ui/Button';
import { useDrillContext, useDrillActions } from '@/context/DrillContext';
import { drillsApi } from '@/lib/api';
import { Drill } from '@/lib/types';

const CATEGORIES = [
  'All',
  'Upper Body',
  'Lower Body',
  'Max Speed',
  'Endurance',
  'Plyometrics',
] as const;

interface DrillsGridProps {
  drills?: Drill[];
}

export function DrillsGrid({ drills: initialDrills }: DrillsGridProps) {
  const { state } = useDrillContext();
  const { setCategory, setDrills, setLoading, setError } = useDrillActions();

  // Set initial drills if provided
  useEffect(() => {
    if (initialDrills) {
      setDrills(initialDrills);
    }
  }, [initialDrills, setDrills]);

  // Fetch drills from API if no initial drills provided
  useEffect(() => {
    if (!initialDrills) {
      const fetchDrills = async () => {
        try {
          setLoading(true);
          setError(null);
          const drills = await drillsApi.fetchDrills(state.selectedCategory);
          setDrills(drills);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to fetch drills');
          console.error('Error fetching drills:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchDrills();
    }
  }, [state.selectedCategory, setDrills, setLoading, setError, initialDrills]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Category Filter */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="flex gap-2 px-4 sm:px-0 pb-2 sm:pb-0">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={state.selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setCategory(category)}
              className="text-sm whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground px-4 sm:px-0">
        Showing {state.filteredDrills.length} drill{state.filteredDrills.length === 1 ? '' : 's'}
      </div>

      {/* Loading State */}
      {state.isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading drills...</p>
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <div className="text-center py-12">
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        </div>
      )}

      {/* Drills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {state.filteredDrills.map((drill) => (
          <DrillCard
            key={drill.id}
            name={drill.name}
            description={drill.description}
            category={drill.category}
            difficulty={drill.difficulty}
          />
        ))}
      </div>

      {/* Empty State */}
      {!state.isLoading && !state.error && state.filteredDrills.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No drills found</h3>
          <p className="text-sm text-muted-foreground">
            Try changing your filter or check back later for new drills.
          </p>
        </div>
      )}
    </div>
  );
}
