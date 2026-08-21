import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  altText: { type: String, default: '', maxlength: 180 },
  category: { type: String, enum: ['Logo', 'Hero', 'Proyecto', 'Galería', 'General'], default: 'General' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Media', schema);
