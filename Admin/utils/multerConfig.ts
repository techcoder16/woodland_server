import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express';

// Define the storage configuration using multer.diskStorage
const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: Function): void {
    // Use an absolute path for the uploads directory
    const uploadDir = path.resolve(__dirname, '../uploads/');
    console.log(uploadDir)
    cb(null, uploadDir); // Specify the directory to store files
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function): void {
    // Create a unique filename using the current timestamp and original file name
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
  },
  fileFilter: function (req: Request, file: Express.Multer.File, cb: Function) {
    // Optional: Filter files based on their MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type!'), false);
    }
  },
});

export { upload };
