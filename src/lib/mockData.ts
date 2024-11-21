import { Drill } from '@/context/DrillContext';

export const mockDrills: Drill[] = [
  {
    id: '1',
    name: 'Push-up Variations',
    description: 'A series of push-up variations targeting different muscle groups in the upper body.',
    category: 'Upper Body',
    difficulty: 'Medium',
  },
  {
    id: '2',
    name: 'Sprint Intervals',
    description: 'High-intensity sprint intervals designed to improve maximum speed and acceleration.',
    category: 'Max Speed',
    difficulty: 'Hard',
  },
  {
    id: '3',
    name: 'Squat Jumps',
    description: 'Explosive lower body exercise combining squats with vertical jumps.',
    category: 'Lower Body',
    difficulty: 'Medium',
  },
  {
    id: '4',
    name: 'Endurance Run',
    description: 'Long-distance running at a steady pace to build cardiovascular endurance.',
    category: 'Endurance',
    difficulty: 'Medium',
  },
  {
    id: '5',
    name: 'Box Jumps',
    description: 'Plyometric exercise involving jumping onto and off a raised platform.',
    category: 'Plyometrics',
    difficulty: 'Hard',
  },
];
