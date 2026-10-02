import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'technician' | 'admin';
  carePoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ['student', 'technician', 'admin'],
      default: 'student',
    },
    carePoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
