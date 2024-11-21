'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useDrillActions } from '@/context/DrillContext';
import { drillsApi } from '@/lib/api';

const CATEGORIES = [
  'Upper Body',
  'Lower Body',
  'Max Speed',
  'Endurance',
  'Plyometrics',
] as const;

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

interface FormData {
  name: string;
  description: string;
  category: string;
  difficulty: string;
}

export function DrillUploadForm() {
  const { addDrill, setError } = useDrillActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    difficulty: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.category || !formData.difficulty) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const newDrill = await drillsApi.uploadDrill(formData);
      addDrill(newDrill);

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        difficulty: '',
      });

      // Show success message (you might want to add a success state to the context)
      alert('Drill uploaded successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload drill');
      console.error('Error uploading drill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Name Input */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium block">
          Drill Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="block w-full rounded-md border border-input bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
          placeholder="Enter drill name"
        />
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium block">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="block w-full rounded-md border border-input bg-background px-3 py-2 h-32 resize-y focus:ring-2 focus:ring-primary"
          placeholder="Enter drill description"
        />
      </div>

      {/* Category and Difficulty Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium block">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty" className="text-sm font-medium block">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 focus:ring-2 focus:ring-primary"
          >
            <option value="">Select difficulty</option>
            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? 'Uploading...' : 'Upload Drill'}
      </Button>
    </form>
  );
}
