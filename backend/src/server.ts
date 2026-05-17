import express from 'express';
import cors from 'cors';
import { config } from './config';
import analyzeRouter from './routes/analyze';
import chatRouter from './routes/chat';

// 1. Initialize Express App
const app = express();

// 2. Middlewares Setup
app.use(cors()); // Enables cross-origin requests
app.use(express.json({ limit: '10mb' })); // Supporting large contract paste volumes
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Routing Map
app.use('/api/analyze', analyzeRouter);
app.use('/api/chat', chatRouter);

// 4. Default Root Health Probe
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'LexGuard Backend API Services'
  });
});

// 5. Boot Listener
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n🛡️  [LexGuard Backend] Express server running in ${config.nodeEnv} mode`);
  console.log(`📡 [LexGuard Backend] Live API endpoint: http://localhost:${PORT}/api/analyze\n`);
});
