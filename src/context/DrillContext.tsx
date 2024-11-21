'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useCallback,
} from 'react';

// Types
export interface Drill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
}

interface DrillState {
  drills: Drill[];
  filteredDrills: Drill[];
  selectedCategory: string;
  generatedWorkouts: Drill[];
  isLoading: boolean;
  error: string | null;
}

type DrillAction =
  | { type: 'SET_DRILLS'; payload: Drill[] }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_GENERATED_WORKOUTS'; payload: Drill[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_DRILL'; payload: Drill }
  | { type: 'CLEAR_GENERATED_WORKOUTS' };

// Initial state
const initialState: DrillState = {
  drills: [],
  filteredDrills: [],
  selectedCategory: 'All',
  generatedWorkouts: [],
  isLoading: false,
  error: null,
};

// Reducer
function drillReducer(state: DrillState, action: DrillAction): DrillState {
  switch (action.type) {
    case 'SET_DRILLS':
      return {
        ...state,
        drills: action.payload,
        filteredDrills: state.selectedCategory === 'All'
          ? action.payload
          : action.payload.filter(drill => drill.category === state.selectedCategory),
      };
    
    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
        filteredDrills: action.payload === 'All'
          ? state.drills
          : state.drills.filter(drill => drill.category === action.payload),
      };
    
    case 'SET_GENERATED_WORKOUTS':
      return {
        ...state,
        generatedWorkouts: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'ADD_DRILL':
      const newDrills = [...state.drills, action.payload];
      return {
        ...state,
        drills: newDrills,
        filteredDrills: state.selectedCategory === 'All'
          ? newDrills
          : newDrills.filter(drill => drill.category === state.selectedCategory),
      };
    
    case 'CLEAR_GENERATED_WORKOUTS':
      return {
        ...state,
        generatedWorkouts: [],
      };
    
    default:
      return state;
  }
}

// Context
const DrillContext = createContext<{
  state: DrillState;
  dispatch: Dispatch<DrillAction>;
} | null>(null);

// Provider Component
export function DrillProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(drillReducer, initialState);

  return (
    <DrillContext.Provider value={{ state, dispatch }}>
      {children}
    </DrillContext.Provider>
  );
}

// Custom hook for using the drill context
export function useDrillContext() {
  const context = useContext(DrillContext);
  if (!context) {
    throw new Error('useDrillContext must be used within a DrillProvider');
  }
  return context;
}

// Utility functions
export function useDrillActions() {
  const { dispatch } = useDrillContext();

  const setDrills = useCallback((drills: Drill[]) => {
    dispatch({ type: 'SET_DRILLS', payload: drills });
  }, [dispatch]);

  const setCategory = useCallback((category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }, [dispatch]);

  const setGeneratedWorkouts = useCallback((workouts: Drill[]) => {
    dispatch({ type: 'SET_GENERATED_WORKOUTS', payload: workouts });
  }, [dispatch]);

  const addDrill = useCallback((drill: Drill) => {
    dispatch({ type: 'ADD_DRILL', payload: drill });
  }, [dispatch]);

  const clearGeneratedWorkouts = useCallback(() => {
    dispatch({ type: 'CLEAR_GENERATED_WORKOUTS' });
  }, [dispatch]);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, [dispatch]);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  return {
    setDrills,
    setCategory,
    setGeneratedWorkouts,
    addDrill,
    clearGeneratedWorkouts,
    setLoading,
    setError,
  };
}
