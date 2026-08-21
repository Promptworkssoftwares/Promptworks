import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
const storage = multer.diskStorage({ destination: (_req, _file, cb) => cb(null, 'uploads/'), filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname).toLowerCase()}`) });
const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_req, file, cb) => { const valid = allowed.has(file.mimetype); cb(valid ? null : new Error('Tipo de archivo no permitido'), valid); } });
