import cloudinary from 'cloudinary';
import ErrorHandler from '../utils/errorHandler.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next(new ErrorHandler('No file uploaded', 400));
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.v2.uploader.upload(dataURI, {
      folder: 'petshop',
    });
    res.status(200).json({
      success: true,
      image: { public_id: result.public_id, url: result.secure_url },
    });
  } catch (error) { next(error); }
};