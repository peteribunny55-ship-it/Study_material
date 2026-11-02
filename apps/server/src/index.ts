import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ultra-cricket-ai-server' });
});

app.get('/api/match-config', (_req, res) => {
  res.json({
    formats: ['T20', 'ODI', 'Test', 'Practice'],
    difficulty: ['Beginner', 'Medium', 'Expert'],
    stadiums: ['Wankhede', 'M. A. Chidambaram', 'Eden Gardens'],
  });
});

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'connected', message: 'Server connected' }));

  socket.on('message', (raw) => {
    try {
      const payload = JSON.parse(raw.toString());
      socket.send(JSON.stringify({ type: 'ack', payload }));
    } catch (error) {
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
    }
  });
});

const port = Number(process.env.PORT ?? 4000);
server.listen(port, () => {
  console.log(`Ultra Cricket AI backend is running on http://localhost:${port}`);
});
