import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  tagId: string;
  name: string;
  healthStatus: 'healthy' | 'degraded' | 'broken';
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    tagId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    healthStatus: {
      type: String,
      enum: ['healthy', 'degraded', 'broken'],
      default: 'healthy',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAsset>('Asset', assetSchema);
