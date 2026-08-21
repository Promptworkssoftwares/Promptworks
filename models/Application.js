import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true }, shortDescription: { type: String, required: true, maxlength: 280 },
  description: { type: String, required: true }, problem: { type: String, default: '' }, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  technologies: [{ type: String, trim: true }], features: [{ type: String, trim: true }], platform: { type: String, enum: ['Web', 'Local', 'Cloud', 'Mobile', 'Híbrida'], default: 'Web' },
  status: { type: String, enum: ['Demo', 'En desarrollo', 'Privada', 'Disponible'], default: 'En desarrollo' }, coverImage: { type: String, default: '' }, gallery: [String],
  demoUrl: { type: String, default: '' }, videoUrl: { type: String, default: '' }, published: { type: Boolean, default: false }, featured: { type: Boolean, default: false }, order: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model('Application', schema);
