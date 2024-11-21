import mongoose from 'mongoose';

const workoutHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Upper Body', 'Lower Body', 'Max Speed', 'Endurance', 'Plyometrics']
  },
  drills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drill',
    required: true
  }],
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  notes: String
}, {
  timestamps: true
});

// Index for efficient querying
workoutHistorySchema.index({ type: 1, completedAt: -1 });
workoutHistorySchema.index({ difficulty: 1 });

export const WorkoutHistory = mongoose.models.WorkoutHistory || 
  mongoose.model('WorkoutHistory', workoutHistorySchema);
