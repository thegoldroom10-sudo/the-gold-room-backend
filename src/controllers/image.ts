import { Request, Response } from 'express';
import { ImageModel } from '../models/Image';
import { uploadImageToCloudinary } from '../utils/imageUpload';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { title, tags } = req.body;
    const userId = req.user.id;
    const files = req.files as {
      original?: Express.Multer.File[];
      cropped?: Express.Multer.File[];
    };

    if (!files?.original?.[0] || !files?.cropped?.[0]) {
      return res.status(400).json({
        message: 'Both original and cropped images are required',
      });
    }

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim().toLowerCase()) : [];

    const imageData = await uploadImageToCloudinary(files.original[0].buffer, files.cropped[0].buffer);

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
        userId: 1,
        'image.original.url': 1,
        'image.cropped.url': 1,
        _id: 0,
      });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch images' });
  }
};
