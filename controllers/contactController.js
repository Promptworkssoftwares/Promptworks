import ContactRequest from '../models/ContactRequest.js';
import { notifyContact } from '../services/emailService.js';
import { fail, ok, sanitizeText } from '../utils/api.js';
export async function createContact(req, res) {
  const required = ['name', 'email', 'projectType', 'description'];
  if (required.some(key => !String(req.body[key] || '').trim())) return fail(res, 'Completa todos los campos requeridos', 422);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) return fail(res, 'Correo electrónico no válido', 422);
  if (!['true', true, 'on'].includes(req.body.consent)) return fail(res, 'Debes aceptar el consentimiento', 422);
  const request = await ContactRequest.create({
    name: sanitizeText(req.body.name, 100), company: sanitizeText(req.body.company, 120), email: req.body.email.trim().toLowerCase(), phone: sanitizeText(req.body.phone, 30),
    projectType: sanitizeText(req.body.projectType, 80), budget: sanitizeText(req.body.budget, 80), description: sanitizeText(req.body.description, 5000),
    attachment: req.file ? `/uploads/${req.file.filename}` : '', consent: true
  });
  notifyContact(request).catch(error => console.error('No se pudo enviar la notificación:', error.message));
  return ok(res, { id: request.id }, 'Tu solicitud fue enviada correctamente', 201);
}
