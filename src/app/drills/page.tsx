"use client"

import { useEffect, useState } from 'react';
import { DrillsGrid } from '@/components/DrillsGrid';
import { Drill } from '@/lib/types';
import { Toaster } from 'react-hot-toast';

export default function DrillsPage() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrills = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/drills');
      if (!response.ok) {
        throw new Error('Failed to fetch drills');
      }
      const data = await response.json();
      // Transform _id to id if necessary
      const transformedDrills = data.map((drill: any) => ({
        ...drill,
        id: drill._id || drill.id,
      }));
      setDrills(transformedDrills);
    } catch (error) {
      console.error('Error fetching drills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrills();
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <div className="container py-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Drills</h1>
            <p className="text-gray-600 mt-2">
              Manage your exercise drills collection
            </p>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <DrillsGrid drills={drills} onDrillsUpdate={fetchDrills} />
          )}
        </div>
      </div>
    </>
  );
}
