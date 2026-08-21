import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/db.js';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) { console.error('JWT_SECRET debe tener al menos 32 caracteres.'); process.exit(1); }
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], fontSrc: ["'self'", 'https://fonts.gstatic.com'], imgSrc: ["'self'", 'data:', 'https:'], scriptSrc: ["'self'"], mediaSrc: ["'self'", 'https:'] } } }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${process.env.PORT || 3000}`, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d', immutable: true }));
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.get('/health', (_req, res) => res.json({ success: true, message: 'PromptWorks activo' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.get('/apps/:slug', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'app.html')));
app.get('/admin', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html')));
app.use('/api', notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
connectDatabase().then(() => app.listen(port, () => console.log(`PromptWorks disponible en http://localhost:${port}`))).catch(error => { console.error(`No se pudo iniciar: ${error.message}`); process.exit(1); });
