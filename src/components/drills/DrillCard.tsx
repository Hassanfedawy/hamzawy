'use client';

import { cn } from '@/lib/utils';

interface DrillCardProps {
  name: string;
  description: string;
  category: string;
  difficulty: string;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-red-100 text-red-800',
};

const categoryColors = {
  'Upper Body': 'bg-blue-100 text-blue-800',
  'Lower Body': 'bg-purple-100 text-purple-800',
  'Max Speed': 'bg-orange-100 text-orange-800',
  Endurance: 'bg-teal-100 text-teal-800',
  Plyometrics: 'bg-pink-100 text-pink-800',
};

export function DrillCard({ name, description, category, difficulty }: DrillCardProps) {
  return (
    <div className="group relative rounded-lg border p-4 sm:p-6 hover:border-foreground/50 transition-colors h-full flex flex-col">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold line-clamp-2">{name}</h3>
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
              categoryColors[category as keyof typeof categoryColors]
            )}
          >
            {category}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
              difficultyColors[difficulty as keyof typeof difficultyColors]
            )}
          >
            {difficulty}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{description}</p>
      </div>
    </div>
  );
}
