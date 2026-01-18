import { Schema, model, Types } from 'mongoose';
import { ImageDocument } from '../types';

const ImageSchema = new Schema<ImageDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    image: {
      original: {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
        width: Number,
        height: Number,
      },
      cropped: {
        publicId: { type: String, required: true },
        url: { type: String, required: true },
        width: Number,
        height: Number,
      },
    },
  },
  { timestamps: true },
);

export const ImageModel = model<ImageDocument>('Image', ImageSchema);
