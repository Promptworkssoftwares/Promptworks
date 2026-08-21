import mongoose from 'mongoose';
const schema = new mongoose.Schema({ title: { type: String, required: true }, description: { type: String, required: true }, icon: { type: String, default: 'code' }, order: { type: Number, default: 0 }, active: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.model('Service', schema);
