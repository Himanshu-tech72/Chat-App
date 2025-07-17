import express from 'express';
import { createServer } from "http";
import {Server} from "socket.io";
import cors from "cors";

const port = 3000;

const app = express();
const httpServer = createServer(app);


const allowedOrigins = [
  'http://localhost:5173',              // for local dev
  'https://chat-app-abq8.vercel.app'    // your deployed frontend
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get('/', (req, res) => {
    res.send('Namaste');
});

io.on("connection", (socket) => {
  console.log("A new user connected");
  console.log("Id", socket.id)           // Socket id for server-side
                                         // Backend me directly emit nahi karte listen karne ke baad emit karte hai
  socket.on("disconnect", () => {          
    console.log("User disconnected", socket.id);    // Event listner for user disconnect triggerd when return 
  });     
// keyword of useEffect is runned in frontend.

socket.on("message", (data) => {
       io.emit("message", data); // Emit message to all connected clients
})
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})