import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: { type: String, required: true }, company: String, role: String, comment: { type: String, required: true }, photo: String, published: { type: Boolean, default: false }, order: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.model('Testimonial', schema);
