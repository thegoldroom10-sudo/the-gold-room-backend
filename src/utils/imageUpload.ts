import { cloudinaryInstance } from '../config';
import streamifier from 'streamifier';
import { CloudinaryResult, ImageData } from '../types';

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  transformation?: object[],
): Promise<CloudinaryResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryInstance.uploader.upload_stream(
      {
        folder,
        transformation,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Full upload function for original + cropped
export const uploadImageToCloudinary = async (buffer: Buffer): Promise<ImageData> => {
  const original = await uploadToCloudinary(buffer, 'images/original');
  const cropped = await uploadToCloudinary(buffer, 'images/cropped', [
    { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
  ]);

  return { original, cropped };
};
