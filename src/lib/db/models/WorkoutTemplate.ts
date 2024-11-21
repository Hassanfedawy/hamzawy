import mongoose from 'mongoose';

const workoutTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Upper Body', 'Lower Body', 'Max Speed', 'Endurance', 'Plyometrics']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  drillCount: {
    type: Number,
    required: true,
    min: 1
  },
  targetDuration: {
    type: Number, // in minutes
    required: true
  },
  filters: {
    difficulty: {
      type: [String],
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    equipment: [String],
    intensity: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
workoutTemplateSchema.index({ type: 1, difficulty: 1 });
workoutTemplateSchema.index({ name: 1 }, { unique: true });
workoutTemplateSchema.index({ isPublic: 1, usageCount: -1 });

export const WorkoutTemplate = mongoose.models.WorkoutTemplate || 
  mongoose.model('WorkoutTemplate', workoutTemplateSchema);
