import { Request, Response } from 'express';
import { ImageModel } from '../models/Image';
import { uploadImageToCloudinary } from '../utils/imageUpload';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { title, tags } = req.body;
    const userId = req.user.id; // from auth middleware
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const parsedTags =
      typeof tags === 'string'
        ? tags
            .split(',') // split by comma
            .map(tag => tag.trim().toLowerCase()) // remove spaces and lowercase
        : [];

    const imageData = await uploadImageToCloudinary(req.file.buffer);

    const image = await ImageModel.create({
      userId,
      title,
      tags: parsedTags,
      image: imageData,
    });

    res.status(201).json(image);
  } catch (error) {
    console.log(`error: ${error}`);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};

export const getImages = async (req: Request, res: Response) => {
  try {
    const { tag, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (tag) filter.tags = tag;

    const images = await ImageModel.find(filter)
      //   .populate('userId', 'name') // optional
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .select({
        userId: 1, // include userId
        'image.cropped.url': 1, // include only cropped image URL
        _id: 0,
      });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch images' });
  }
};
