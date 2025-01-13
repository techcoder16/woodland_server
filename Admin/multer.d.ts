// types/multer.d.ts

import multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]; // Allow both object and array
    }
  }
}

export {}; // This is necessary to mark this file as a module
