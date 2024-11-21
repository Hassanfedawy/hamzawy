import mongoose, { Schema, Document } from 'mongoose';

export interface IDrill extends Document {
  name: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: Date;
  updatedAt: Date;
}

const DrillSchema = new Schema<IDrill>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for the drill'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for the drill'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify the category'],
      enum: {
        values: ['Upper Body', 'Lower Body', 'Max Speed', 'Endurance', 'Plyometrics'],
        message: '{VALUE} is not a valid category',
      },
    },
    difficulty: {
      type: String,
      required: [true, 'Please specify the difficulty level'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes
DrillSchema.index({ name: 'text', description: 'text' });
DrillSchema.index({ category: 1 });
DrillSchema.index({ difficulty: 1 });
DrillSchema.index({ createdAt: -1 });

export const Drill = mongoose.models.Drill || mongoose.model<IDrill>('Drill', DrillSchema);
