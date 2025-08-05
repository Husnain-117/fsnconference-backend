import express from 'express';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact
router.post('/contact', submitContact);

export default router;
