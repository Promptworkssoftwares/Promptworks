import Application from '../models/Application.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import SiteSetting from '../models/SiteSetting.js';
import { fail, ok } from '../utils/api.js';
export async function bootstrap(req, res) {
  const [applications, categories, services, testimonials, settings] = await Promise.all([
    Application.find({ published: true }).populate('category', 'name slug').sort({ order: 1, createdAt: -1 }).lean(),
    Category.find({ active: true }).sort({ order: 1 }).lean(), Service.find({ active: true }).sort({ order: 1 }).lean(),
    Testimonial.find({ published: true }).sort({ order: 1 }).lean(), SiteSetting.find({ key: { $in: ['business', 'metrics', 'brand', 'pageContent'] } }).lean()
  ]);
  return ok(res, { applications, categories, services, testimonials, settings: Object.fromEntries(settings.map(s => [s.key, s.value])) });
}
export async function applicationDetails(req, res) {
  const application = await Application.findOne({ slug: req.params.slug, published: true }).populate('category', 'name slug').lean();
  if (!application) return fail(res, 'Aplicación no encontrada', 404);
  return ok(res, application);
}
