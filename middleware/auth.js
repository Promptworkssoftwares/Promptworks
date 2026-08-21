import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { fail } from '../utils/api.js';
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.pw_token;
    if (!token) return fail(res, 'Autenticación requerida', 401);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user?.active) return fail(res, 'Sesión no válida', 401);
    req.user = user; next();
  } catch { return fail(res, 'Sesión vencida o no válida', 401); }
}
export function requireOwner(req, res, next) { if (req.user?.role !== 'owner') return fail(res, 'Permiso de owner requerido', 403); next(); }
