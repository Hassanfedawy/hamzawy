import axios, { AxiosError } from 'axios';
import { Drill } from '@/context/DrillContext';
import { mockApi } from './mockApi';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface WorkoutGenerateParams {
  category: string;
  count: number;
}

// Error handler
const handleError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      message: axiosError.response?.data?.message || 'An unexpected error occurred',
      status: axiosError.response?.status,
      code: axiosError.code,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  };
};

// Determine if we should use mock API
const useMockApi = process.env.NEXT_PUBLIC_API_URL === undefined;

// API functions
export const drillsApi = {
  /**
   * Upload a new drill
   */
  uploadDrill: async (drill: Omit<Drill, 'id'>): Promise<Drill> => {
    try {
      if (useMockApi) {
        return await mockApi.uploadDrill(drill);
      }

      const response = await api.post<Drill>('/drills', drill);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Fetch all drills with optional category filter
   */
  fetchDrills: async (category?: string): Promise<Drill[]> => {
    try {
      if (useMockApi) {
        return await mockApi.fetchDrills(category);
      }

      const response = await api.get<Drill[]>('/drills', {
        params: category && category !== 'All' ? { category } : undefined,
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Generate a workout based on parameters
   */
  generateWorkout: async ({ category, count }: WorkoutGenerateParams): Promise<Drill[]> => {
    try {
      if (useMockApi) {
        return await mockApi.generateWorkout({ category, count });
      }

      const response = await api.post<Drill[]>('/workouts/generate', {
        category,
        count,
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Response interceptor for common error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401, 403, 500)
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    } else if (error.response?.status === 403) {
      // Handle forbidden access
      console.error('Forbidden access');
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);
