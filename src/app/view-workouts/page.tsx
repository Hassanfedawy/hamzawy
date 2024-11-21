import { DrillsGrid } from '@/components/drills/DrillsGrid';
import { Drill } from '@/lib/types';

// Mock drills with correct types
const mockDrills: Drill[] = [
  {
    id: '1',
    name: 'Push-up Variations',
    description: 'A series of push-up variations targeting different muscle groups in the upper body. Includes standard, diamond, and wide-grip push-ups.',
    category: 'Upper Body',
    difficulty: 'Intermediate',
    equipment: ['None'],
    intensity: 'Medium'
  },
  {
    id: '2',
    name: 'Sprint Intervals',
    description: 'High-intensity sprint intervals designed to improve maximum speed and acceleration. Includes proper warm-up and cool-down protocols.',
    category: 'Max Speed',
    difficulty: 'Advanced',
    equipment: ['Track', 'Cones'],
    intensity: 'High'
  },
  {
    id: '3',
    name: 'Box Jumps',
    description: 'Progressive box jump training to develop explosive power in the lower body. Includes proper landing technique and safety guidelines.',
    category: 'Plyometrics',
    difficulty: 'Intermediate',
    equipment: ['Plyo Box'],
    intensity: 'Medium'
  },
  {
    id: '4',
    name: 'Endurance Run',
    description: 'Long-distance running workout focusing on building cardiovascular endurance and maintaining consistent pace.',
    category: 'Endurance',
    difficulty: 'Beginner',
    intensity: 'Low'
  },
  {
    id: '5',
    name: 'Squat Complex',
    description: 'Comprehensive lower body workout combining different squat variations to build strength and endurance.',
    category: 'Lower Body',
    difficulty: 'Advanced',
    equipment: ['Barbell', 'Rack'],
    intensity: 'High'
  },
];

export default function ViewWorkoutsPage() {
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browse Drills</h1>
          <p className="text-muted-foreground">
            Explore our collection of drills and filter by category to find the perfect workout.
          </p>
        </div>
        <DrillsGrid drills={mockDrills} />
      </div>
    </div>
  );
}
