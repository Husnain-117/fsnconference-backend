import Speaker from '../models/SpeakerModel.js';
import { uploadToSupabase } from '../config/supabase.js';

// NOTE: We previously attempted to read/write speakers to a JSON file on disk. This approach fails
// on Vercel’s serverless environment because the filesystem is read-only and ephemeral. All CRUD
// operations are now implemented directly against MongoDB via the Speaker mongoose model.

const getSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find().sort({ createdAt: -1 });
    res.json(speakers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching speakers.' });
  }
};

const addSpeaker = async (req, res) => {
  try {
    console.log('=== ADD SPEAKER DEBUG ===');
    console.log('Environment VERCEL:', process.env.VERCEL);
    console.log('Request file:', req.file ? 'File present' : 'No file');
    if (req.file) {
      console.log('File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename || 'undefined',
        buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
      });
    }
    
    const {
      name,
      title,
      type,
      company,
      bio,
      expertise,
      social,
      featured,
      talkTitle,
      talkDescription
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Speaker name is required.' });
    }

    // Upload image to Supabase Storage if present
    let imageUrl = '';
    if (req.file) {
      try {
        imageUrl = await uploadToSupabase(req.file.buffer, req.file.originalname);
        console.log('Uploaded image to Supabase:', imageUrl);
      } catch (uploadErr) {
        console.error('Supabase upload failed:', uploadErr);
        return res.status(500).json({ message: 'Image upload failed.' });
      }
    }

    // Build document
    const newSpeaker = new Speaker({
      name,
      title: title || '',
      type: type || 'Invited',
      company: company || '',
      bio: bio || '',
      expertise: expertise ? (Array.isArray(expertise) ? expertise : expertise.split(',').map(e => e.trim())) : [],
      social: social ? (typeof social === 'string' ? JSON.parse(social) : social) : {},
      featured: featured === 'true' || featured === true,
      talkTitle: talkTitle || '',
      talkDescription: talkDescription || '',
      image: imageUrl
    });

    const savedSpeaker = await newSpeaker.save();
    return res.status(201).json(savedSpeaker);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error adding speaker.' });
  }
};


const deleteSpeaker = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Speaker.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Speaker not found.' });
    }
    return res.status(200).json({ message: 'Speaker deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting speaker.' });
  }
};


export { getSpeakers, addSpeaker, deleteSpeaker };
