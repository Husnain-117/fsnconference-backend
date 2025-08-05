import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import registrationRoutes from './routes/registrationRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', registrationRoutes);

app.get('/', (req, res) => {
  res.send('Backend for Conference Registration is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
