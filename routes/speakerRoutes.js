import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getSpeakers, addSpeaker, deleteSpeaker, getSpeakerImage } from '../controllers/speakerController.js';

const router = express.Router();

// Configure multer for file storage
// Vercel functions have a read-only filesystem, so fallback to memory storage there
const storage = process.env.VERCEL
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: (req, file, cb) => {
        // The directory where files will be stored
        const dir = 'public/uploads/speakers';
        // Create the directory if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Sanitize filename and ensure uniqueness
        const safeFileName = file.originalname.toLowerCase().replace(/[^a-z0-9.]/g, '-');
        cb(null, `${Date.now()}-${safeFileName}`);
    }
});

const upload = multer({ storage });

// Route to get all speakers
router.get('/speakers', getSpeakers);

// Route to add a new speaker
// 'photo' is the field name in the form-data
router.post('/speakers', upload.single('photo'), addSpeaker);

// Route to delete a speaker by ID
router.delete('/:id', deleteSpeaker);

// Route to get a single speaker's image
router.get('/:id/image', getSpeakerImage);

export default router;
