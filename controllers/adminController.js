import slugify from 'slugify';
import Application from '../models/Application.js';
import Category from '../models/Category.js';
import ContactRequest from '../models/ContactRequest.js';
import Service from '../models/Service.js';
import SiteSetting from '../models/SiteSetting.js';
import Testimonial from '../models/Testimonial.js';
import Media from '../models/Media.js';
import fs from 'fs/promises';
import path from 'path';
import { fail, ok } from '../utils/api.js';

const models = { applications: Application, categories: Category, services: Service, testimonials: Testimonial };
function modelFor(resource) { return models[resource]; }
function normalize(resource, body) {
  const data = { ...body }; delete data._id; delete data.createdAt; delete data.updatedAt; delete data.__v;
  if (['applications', 'categories'].includes(resource)) data.slug = slugify(data.slug || data.name || '', { lower: true, strict: true });
  if (resource === 'applications') {
    for (const key of ['technologies', 'features', 'gallery']) if (typeof data[key] === 'string') data[key] = data[key].split(/[,\n]/).map(v => v.trim()).filter(Boolean);
    for (const key of ['published', 'featured']) data[key] = [true, 'true', 'on', 1, '1'].includes(data[key]);
  }
  for (const key of ['active', 'published']) if (key in data) data[key] = [true, 'true', 'on', 1, '1'].includes(data[key]);
  return data;
}
export async function dashboard(req, res) {
  const [applications, contacts, newContacts, testimonials, media] = await Promise.all([Application.countDocuments(), ContactRequest.countDocuments(), ContactRequest.countDocuments({ status: 'Nueva' }), Testimonial.countDocuments(), Media.countDocuments()]);
  return ok(res, { applications, contacts, newContacts, testimonials, media });
}
export async function listResource(req, res) {
  const Model = modelFor(req.params.resource); if (!Model) return fail(res, 'Recurso no válido', 404);
  const query = {}; if (req.query.q) query.$or = ['name', 'title', 'shortDescription'].map(field => ({ [field]: new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }));
  let modelQuery = Model.find(query).sort({ order: 1, createdAt: -1 });
  if (req.params.resource === 'applications') modelQuery = modelQuery.populate('category', 'name slug');
  const docs = await modelQuery.lean();
  return ok(res, docs);
}
export async function createResource(req, res) { const Model = modelFor(req.params.resource); if (!Model) return fail(res, 'Recurso no válido', 404); const doc = await Model.create(normalize(req.params.resource, req.body)); return ok(res, doc, 'Registro creado', 201); }
export async function updateResource(req, res) { const Model = modelFor(req.params.resource); if (!Model) return fail(res, 'Recurso no válido', 404); const doc = await Model.findByIdAndUpdate(req.params.id, normalize(req.params.resource, req.body), { new: true, runValidators: true }); if (!doc) return fail(res, 'Registro no encontrado', 404); return ok(res, doc, 'Registro actualizado'); }
export async function deleteResource(req, res) { const Model = modelFor(req.params.resource); if (!Model) return fail(res, 'Recurso no válido', 404); const doc = await Model.findByIdAndDelete(req.params.id); if (!doc) return fail(res, 'Registro no encontrado', 404); return ok(res, null, 'Registro eliminado'); }
export async function getSettings(req, res) { const docs = await SiteSetting.find().lean(); return ok(res, Object.fromEntries(docs.map(s => [s.key, s.value]))); }
export async function saveSettings(req, res) { for (const [key, value] of Object.entries(req.body)) await SiteSetting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true }); return ok(res, null, 'Configuración guardada'); }
export async function listContacts(req, res) { const docs = await ContactRequest.find().sort({ createdAt: -1 }).lean(); return ok(res, docs); }
export async function updateContact(req, res) { const doc = await ContactRequest.findByIdAndUpdate(req.params.id, { status: req.body.status, notes: req.body.notes || '' }, { new: true, runValidators: true }); if (!doc) return fail(res, 'Solicitud no encontrada', 404); return ok(res, doc, 'Solicitud actualizada'); }

export async function listMedia(req, res) {
  const docs = await Media.find().sort({ createdAt: -1 }).lean();
  return ok(res, docs);
}

export async function uploadMedia(req, res) {
  if (!req.file) return fail(res, 'Selecciona un archivo', 422);
  const doc = await Media.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
    altText: String(req.body.altText || '').trim(),
    category: req.body.category || 'General',
    uploadedBy: req.user._id
  });
  return ok(res, doc, 'Recurso agregado a la biblioteca', 201);
}

export async function updateMedia(req, res) {
  const doc = await Media.findByIdAndUpdate(req.params.id, { altText: String(req.body.altText || '').trim(), category: req.body.category || 'General' }, { new: true, runValidators: true });
  if (!doc) return fail(res, 'Recurso no encontrado', 404);
  return ok(res, doc, 'Recurso actualizado');
}

export async function deleteMedia(req, res) {
  const doc = await Media.findById(req.params.id);
  if (!doc) return fail(res, 'Recurso no encontrado', 404);
  const uploadsRoot = path.resolve('uploads');
  const filePath = path.resolve(uploadsRoot, path.basename(doc.filename));
  if (filePath.startsWith(`${uploadsRoot}${path.sep}`)) await fs.unlink(filePath).catch(error => { if (error.code !== 'ENOENT') throw error; });
  await doc.deleteOne();
  return ok(res, null, 'Recurso eliminado');
}
