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
export const uploadImageToCloudinary = async (originalBuffer: Buffer, croppedBuffer: Buffer): Promise<ImageData> => {
  const original = await uploadToCloudinary(originalBuffer, 'images/original');

  const cropped = await uploadToCloudinary(croppedBuffer, 'images/cropped');

  return { original, cropped };
};
