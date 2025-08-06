import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import registrationRoutes from './routes/registrationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';

dotenv.config();

import mongoose from 'mongoose';

const app = express();

// MongoDB Atlas connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI not set. Please add it to environment variables.');
}
mongoose.connect(mongoURI, { dbName: 'fsnconference' })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Fallback: ensure CORS headers even on errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  next();
});
app.use(bodyParser.json());

// Serve static files from the 'public' directory, making images accessible
app.use(express.static('public'));

app.use('/api', registrationRoutes);
app.use('/api', contactRoutes);
app.use('/api', speakerRoutes);

app.get('/', (req, res) => {
  res.send('FSN Conference backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
