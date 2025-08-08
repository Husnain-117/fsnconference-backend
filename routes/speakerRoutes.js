import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getSpeakers, addSpeaker, deleteSpeaker } from '../controllers/speakerController.js';

const router = express.Router();

// Configure multer for file storage
// Vercel functions have a read-only filesystem, so fallback to memory storage there
// Configure multer to use memory storage. This is essential for providing a buffer
// that can be uploaded directly to cloud services like Supabase, both locally and on Vercel.
const storage = multer.memoryStorage();

const upload = multer({ storage });

// Route to get all speakers
router.get('/speakers', getSpeakers);

// Route to add a new speaker
// 'photo' is the field name in the form-data
router.post('/speakers', upload.single('photo'), addSpeaker);

// Route to delete a speaker by ID
router.delete('/speakers/:id', deleteSpeaker);

export default router;
