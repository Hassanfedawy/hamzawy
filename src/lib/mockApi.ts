import { Drill } from '@/context/DrillContext';
import { mockDrills } from './mockData';
import { WorkoutGenerateParams } from './api';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * Mock implementation of drill upload
   */
  uploadDrill: async (drill: Omit<Drill, 'id'>): Promise<Drill> => {
    await delay(1000); // Simulate network delay
    
    const newDrill: Drill = {
      ...drill,
      id: Math.random().toString(36).substring(7),
    };
    
    mockDrills.push(newDrill);
    return newDrill;
  },

  /**
   * Mock implementation of drill fetching
   */
  fetchDrills: async (category?: string): Promise<Drill[]> => {
    await delay(800); // Simulate network delay
    
    if (!category || category === 'All') {
      return mockDrills;
    }
    
    return mockDrills.filter(drill => drill.category === category);
  },

  /**
   * Mock implementation of workout generation
   */
  generateWorkout: async ({ category, count }: WorkoutGenerateParams): Promise<Drill[]> => {
    await delay(1200); // Simulate network delay
    
    const availableDrills = category === 'All'
      ? mockDrills
      : mockDrills.filter(drill => drill.category === category);

    if (availableDrills.length === 0) {
      throw new Error('No drills available for the selected category');
    }

    const shuffled = [...availableDrills].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },
};
