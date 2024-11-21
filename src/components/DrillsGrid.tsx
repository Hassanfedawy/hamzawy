import React, { useState } from 'react';
import { Drill } from '@/lib/types';
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface DrillsGridProps {
  drills: Drill[];
  onDrillsUpdate: () => void;
}

export const DrillsGrid: React.FC<DrillsGridProps> = ({ drills, onDrillsUpdate }) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (drillId: string) => {
    try {
      setIsDeleting(drillId);
      const response = await fetch(`/api/drills/${drillId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete drill');
      }

      toast.success('Drill deleted successfully');
      onDrillsUpdate(); // Refresh the drills list
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete drill');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {drills.map((drill) => (
        <div
          key={drill.id}
          className="bg-white rounded-lg shadow-md p-4 relative hover:shadow-lg transition-shadow"
        >
          <div className="absolute top-2 right-2">
            <button
              onClick={() => handleDelete(drill.id)}
              disabled={isDeleting === drill.id}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1 rounded-full hover:bg-red-50 transition-colors"
              title="Delete drill"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{drill.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{drill.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {drill.category}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {drill.difficulty}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
