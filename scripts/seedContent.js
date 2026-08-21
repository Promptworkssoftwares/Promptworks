import 'dotenv/config';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectDatabase } from '../config/db.js';
import Category from '../models/Category.js';
import Application from '../models/Application.js';
import Service from '../models/Service.js';
import SiteSetting from '../models/SiteSetting.js';
import Media from '../models/Media.js';
import fs from 'fs/promises';

await connectDatabase();
const categoryNames = ['Inteligencia Artificial', 'SaaS', 'Sistemas empresariales', 'POS y ventas', 'Hoteles y reservaciones', 'Seguridad', 'Productividad', 'Comunicación', 'Herramientas para desarrolladores', 'Aplicaciones locales', 'MCP y automatización', 'Soluciones para industrias'];
const categories = {};
for (const [order, name] of categoryNames.entries()) categories[name] = await Category.findOneAndUpdate({ slug: slugify(name, { lower: true, strict: true }) }, { name, slug: slugify(name, { lower: true, strict: true }), order, active: true }, { upsert: true, new: true });
const services = [
  ['Desarrollo de aplicaciones web', 'Aplicaciones personalizadas, dashboards, portales administrativos y sistemas empresariales.'],
  ['Software SaaS', 'Plataformas por suscripción con usuarios, roles, pagos, planes y administración.'],
  ['Integración de Inteligencia Artificial', 'Chatbots, asistentes, análisis, visión artificial y automatizaciones.'],
  ['Servidores MCP', 'Conectamos modelos de AI con APIs, documentos, bases de datos y servicios externos.'],
  ['Software local y en la nube', 'Soluciones locales, privadas o cloud de acuerdo con la operación del negocio.'],
  ['Automatización empresarial', 'Notificaciones, correos, reportes, seguimiento de clientes y flujos operacionales.'],
  ['APIs e integraciones', 'Stripe, Microsoft Graph, Google, email, modelos de AI y plataformas externas.']
];
for (const [order, [title, description]] of services.entries()) await Service.findOneAndUpdate({ title }, { title, description, order, active: true }, { upsert: true });
const apps = [
  ['Hotel OS / Hotel AI App', 'Hoteles y reservaciones', 'Sistema operativo para hoteles con reservaciones, habitaciones, personal y llaves.', 'Cloud', ['Node.js', 'MongoDB', 'AI']],
  ['PromptWorks Mailer', 'Comunicación', 'Herramienta para gestionar campañas y automatizaciones de correo empresarial.', 'Web', ['Node.js', 'Nodemailer']],
  ['Sentinel AI', 'Seguridad', 'Seguridad local con cámaras USB, detección de personas, análisis por AI y alertas.', 'Local', ['Node.js', 'Visión AI', 'WebSockets']],
  ['MDRS – Multi Devices Recording Studio', 'Aplicaciones locales', 'Estudio multicámara para conectar teléfonos y tablets mediante QR y producir escenas.', 'Híbrida', ['Node.js', 'WebRTC', 'Socket.IO']],
  ['StitchGraph', 'Productividad', 'Mapas mentales con AI, colaboración y exportación a múltiples formatos.', 'Cloud', ['JavaScript', 'AI', 'MongoDB']],
  ['Supreme360 Operations', 'Sistemas empresariales', 'Operaciones, clientes, cotizaciones, empleados, servicios y pagos para una empresa de mantenimiento.', 'Cloud', ['Node.js', 'Express', 'MongoDB']],
  ['Seguridad Experto OSHA30', 'Inteligencia Artificial', 'Aprendizaje, exámenes y consulta de documentos de seguridad con AI.', 'Web', ['Node.js', 'AI', 'PDF']],
  ['Servidores MCP', 'MCP y automatización', 'Conectores especializados para documentos, APIs y herramientas empresariales.', 'Local', ['MCP', 'Node.js', 'REST API']]
];
const projectImages = {
  'Hotel OS / Hotel AI App': '/images/hotel-os.webp',
  'Sentinel AI': '/images/sentinel-ai.webp',
  'MDRS – Multi Devices Recording Studio': '/images/mdrs-studio.webp',
  'StitchGraph': '/images/stitchgraph.webp'
};
for (const [order, [name, cat, shortDescription, platform, technologies]] of apps.entries()) {
  const slug = slugify(name, { lower: true, strict: true });
  const update = { name, slug, shortDescription, description: shortDescription, problem: 'Centraliza un proceso real del negocio y reduce trabajo manual.', category: categories[cat]._id, technologies, features: [], platform, status: 'En desarrollo', published: true, order };
  if (projectImages[name]) update.coverImage = projectImages[name];
  await Application.findOneAndUpdate({ slug }, update, { upsert: true, runValidators: true });
}
await SiteSetting.findOneAndUpdate({ key: 'business' }, { value: { name: 'PromptWorks', founder: 'Jorge Ramos', email: '', phone: '' } }, { upsert: true });
await SiteSetting.findOneAndUpdate({ key: 'metrics' }, { value: { applications: 8, categories: 12, technologies: 0, completed: 0 } }, { upsert: true });
await SiteSetting.findOneAndUpdate({ key: 'brand' }, { value: { name: 'PromptWorks', tagline: 'AI SOFTWARE STUDIO', logoUrl: '' } }, { upsert: true });
await SiteSetting.findOneAndUpdate({ key: 'pageContent' }, { value: {
  heroBadge: 'Disponible para nuevos proyectos', heroTitle: 'Construimos el software que tu negocio', heroHighlight: 'necesita ahora.', heroDescription: 'Aplicaciones web, plataformas SaaS, herramientas locales y automatizaciones inteligentes diseñadas alrededor de tu operación real.', heroPrimaryCta: 'Explorar proyectos', heroSecondaryCta: 'Cuéntame tu idea', heroImage: '/images/promptworks-hero.webp',
  aboutEyebrow: 'Ideas convertidas en sistemas', aboutTitle: 'No hacemos plantillas.', aboutHighlight: 'Diseñamos soluciones.', aboutDescription: 'PromptWorks transforma procesos complejos en productos digitales claros, funcionales y preparados para crecer. Desde la arquitectura hasta la interfaz, cada decisión tiene un propósito.',
  servicesEyebrow: 'De concepto a producción', servicesTitle: 'Un estudio. Todo el producto.', servicesDescription: 'Diseño, desarrollo, infraestructura e Inteligencia Artificial trabajando como un solo sistema.',
  portfolioEyebrow: 'Software en acción', portfolioTitle: 'Aplicaciones desarrolladas', portfolioDescription: 'Productos reales, organizados por categoría y administrados desde el panel de PromptWorks.',
  processEyebrow: 'Del problema al producto', processTitle: 'Claridad en cada etapa.', processDescription: 'Un proceso visible, organizado y construido alrededor de los objetivos del negocio.',
  stackEyebrow: 'Tecnología con propósito', stackTitle: 'Un stack moderno.', stackHighlight: 'Sin humo.', stackDescription: 'Seleccionamos herramientas estables y probadas para crear productos rápidos, seguros y fáciles de mantener.',
  contactEyebrow: 'Tu próxima aplicación empieza aquí', contactTitle: '¿Tienes una idea?', contactHighlight: 'Hagámosla real.', contactDescription: 'Describe el reto. Evaluaremos alcance, tecnología y próximos pasos para construir una solución seria.',
  footerHeadline: 'Building intelligent software for ambitious businesses.'
} }, { upsert: true });

for (const asset of ['promptworks-hero.webp', 'hotel-os.webp', 'sentinel-ai.webp', 'mdrs-studio.webp', 'stitchgraph.webp']) {
  const stat = await fs.stat(`public/images/${asset}`);
  await Media.findOneAndUpdate({ url: `/images/${asset}` }, { filename: `bundled-${asset}`, originalName: asset, url: `/images/${asset}`, mimeType: 'image/webp', size: stat.size, altText: asset.replace(/[-.]/g, ' '), category: asset === 'promptworks-hero.webp' ? 'Hero' : 'Proyecto' }, { upsert: true });
}
console.log('Contenido inicial creado sin testimonios ni demos ficticias.');
await mongoose.disconnect();
