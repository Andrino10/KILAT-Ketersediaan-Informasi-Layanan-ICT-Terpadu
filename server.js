import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { chatRouter } from './server/routes/chat.js';
import { kbRouter } from './server/routes/knowledgebase.js';
import { initDatabase } from './server/database/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files (after build)
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/kb', kbRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Helpdesk ICT - Pertamina EP',
    timestamp: new Date().toISOString()
  });
});

// Config endpoint (safe public config for frontend)
app.get('/api/config', (req, res) => {
  res.json({
    whatsappNumber: process.env.WHATSAPP_NUMBER || '6281234567890',
    divisions: [
      { id: 'printer', name: 'Printer', icon: '🖨️', description: 'Masalah printer, cetak dokumen' },
      { id: 'cctv', name: 'CCTV', icon: '📹', description: 'Kamera pengawas, DVR/NVR' },
      { id: 'telepon', name: 'Telepon', icon: '☎️', description: 'Telepon kantor, extension' },
      { id: 'radio', name: 'Radio Komunikasi', icon: '📻', description: 'Radio HT, repeater' },
      { id: 'windows', name: 'Windows', icon: '💻', description: 'Laptop, PC, sistem operasi' },
      { id: 'fttp', name: 'FTTP', icon: '🌐', description: 'Fiber to the premise, ONU' },
      { id: 'lan', name: 'LAN', icon: '🔌', description: 'Jaringan lokal, kabel LAN' },
      { id: 'wan', name: 'WAN', icon: '🌍', description: 'Jaringan luas, koneksi antar site' }
    ]
  });
});

// SPA fallback — serve index.html for non-API routes
app.get('{*path}', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// Initialize database and start server
async function start() {
  try {
    await initDatabase();
    console.log('✅ Database initialized');

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║   AI Helpdesk ICT — Pertamina EP                ║
║   Asset 1 Regional 1 Field Lirik                ║
║                                                  ║
║   Server: http://localhost:${PORT}                  ║
║   Status: Running ✅                             ║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
