import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

// Create a pool for better performance
const pool = mysql.createPool(dbConfig);

const functionsRouter = express.Router();

// GET /features - Keeping compatibility
functionsRouter.get('/features', (req, res) => {
  const features = [
    { title: "The Star Beacon", text: "12 towers defining the world's first Mercedes-Benz branded city." },
    { title: "Sensual Purity", text: "Design language evolved from automotive excellence to cityscape." },
    { title: "Grand Promenade", text: "12 distinct lifestyle experiences curated for discovery." },
    { title: "Nad Al Sheba", text: "Affluent district renowned for equestrian excellence." }
  ];
  res.json(features);
});

// POST /lead - Saving to database
functionsRouter.post('/lead', async (req, res) => {
  const { name, email, phone, unit, message } = req.body;
  
  try {
    const query = `
      INSERT INTO leads (name, email, phone, unit, message, is_read) 
      VALUES (?, ?, ?, ?, ?, 0)
    `;
    
    await pool.execute(query, [name, email, phone, unit, message]);
    
    console.log('New lead saved to database:', { name, email });
    res.status(200).json({ success: true, message: 'Lead received and saved successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: 'Error saving to database' });
  }
});

app.use('/.netlify/functions', functionsRouter);

// Static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Connected to database: ${dbConfig.database}`);
});
