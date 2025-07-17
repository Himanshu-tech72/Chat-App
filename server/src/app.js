// server.js  (runs on Render)
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const port = process.env.PORT || 3000;   // Render sets PORT automatically

const app = express();
const httpServer = createServer(app);

// ----- Socket.IO CORS -----
const io = new Server(httpServer, {
  cors: {
    origin: 'https://chat-app-4i26.vercel.app', // ✅ exact, trimmed URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ----- Express CORS (optional, only if you hit REST endpoints too) -----
app.use(cors({
  origin: 'https://chat-app-4i26.vercel.app',
  credentials: true
}));

app.get('/', (_, res) => res.send('Namaste'));

io.on('connection', socket => {
  console.log('A new user connected →', socket.id);

  socket.on('message', data => {
    io.emit('message', data);          // broadcast to every client
  });

  socket.on('disconnect', () => {
    console.log('User disconnected →', socket.id);
  });
});

httpServer.listen(port, () =>
  console.log(`Socket.IO server listening on port ${port}`)
);