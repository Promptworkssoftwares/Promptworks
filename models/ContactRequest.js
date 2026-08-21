import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true }, company: String, email: { type: String, required: true, lowercase: true }, phone: String,
  projectType: { type: String, required: true }, budget: String, description: { type: String, required: true }, attachment: String, consent: { type: Boolean, required: true },
  status: { type: String, enum: ['Nueva', 'Contactada', 'En evaluación', 'Cerrada', 'Descartada'], default: 'Nueva' }, notes: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('ContactRequest', schema);
