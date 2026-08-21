import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: { type: String, required: true, unique: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true }, order: { type: Number, default: 0 }, active: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.model('Category', schema);
