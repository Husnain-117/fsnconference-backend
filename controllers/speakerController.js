import Speaker from '../models/SpeakerModel.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// NOTE: We previously attempted to read/write speakers to a JSON file on disk. This approach fails
// on Vercel’s serverless environment because the filesystem is read-only and ephemeral. All CRUD
// operations are now implemented directly against MongoDB via the Speaker mongoose model.

const getSpeakers = async (req, res) => {
  try {
    // Exclude the 'image' field to make the initial payload small and fast
    const speakers = await Speaker.find().select('-image').sort({ createdAt: -1 });
    res.json(speakers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching speakers.' });
  }
};

// New controller to serve a single speaker's image
const getSpeakerImage = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id).select('image');
    if (!speaker || !speaker.image) {
      return res.status(404).send('Image not found');
    }

    // The image is a Base64 data URI. Decode it and send it as a proper image response.
    const parts = speaker.image.split(';base64,');
    const mimeType = parts[0].split(':')[1];
    const imageBuffer = Buffer.from(parts[1], 'base64');

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': imageBuffer.length
    });
    res.end(imageBuffer);

  } catch (err) {
    console.error('Error fetching speaker image:', err);
    res.status(500).send('Error fetching image');
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

    // Handle image filename for both disk and memory storage
    let imageUrl = '';
    if (req.file) {
      if (process.env.VERCEL) {
        // On Vercel, convert the image buffer to a Base64 data URI for storage
        const base64 = req.file.buffer.toString('base64');
        imageUrl = `data:${req.file.mimetype};base64,${base64}`;
        console.log('Generated Base64 image URI for Vercel.');
      } else {
        // Local development (disk storage)
        imageUrl = `/uploads/speakers/${req.file.filename}`;
        console.log('Generated imageUrl for local:', imageUrl);
      }
    } else {
      console.log('No file uploaded, imageUrl will be empty');
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


module.exports = { getSpeakers, addSpeaker, getSpeakerImage, deleteSpeaker };
