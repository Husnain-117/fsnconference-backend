import mongoose from 'mongoose';

const SpeakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String,
  type: { type: String, default: 'Invited' },
  company: String,
  bio: String,
  expertise: [String],
  social: {
    linkedin: String,
    twitter: String,
    website: String
  },
  featured: { type: Boolean, default: false },
  talkTitle: String,
  talkDescription: String,
  image: String,
}, { timestamps: true });

export default mongoose.models.Speaker || mongoose.model('Speaker', SpeakerSchema);
