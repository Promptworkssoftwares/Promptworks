import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { fail, ok } from '../utils/api.js';
export async function login(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!email || !password) return fail(res, 'Correo y contraseña son requeridos', 422);
  const user = await User.findOne({ email, active: true }).select('+passwordHash');
  if (!user || !(await user.verifyPassword(password))) return fail(res, 'Credenciales incorrectas', 401);
  user.lastLoginAt = new Date(); await user.save();
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.cookie('pw_token', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 8 * 60 * 60 * 1000 });
  return ok(res, { user: { id: user.id, name: user.name, email: user.email, role: user.role } }, 'Sesión iniciada');
}
export function logout(req, res) { res.clearCookie('pw_token'); return ok(res, null, 'Sesión cerrada'); }
export function me(req, res) { return ok(res, { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }); }
