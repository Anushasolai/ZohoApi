import express, { Request, Response } from "express";
import { checkConnection } from "./datasource";
import { createServer } from "http";
import { WebSocketServer } from "./websocket/ProfileWebSocket";
import approuter from "./routes/ProfileRoute";
import cors from "cors"; // Add this line

const app = express();
app.use(express.json());
const server = createServer(app);

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Use cors with options

// Routes
app.use("/api/v6", approuter);

const PORT = 8080;

app.get("/", (req: Request, res: Response) => {
  res.send("Successfully Connected");
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  checkConnection();
});

// WebSocket server setup
server.on('upgrade', (request, socket, head) => {
  WebSocketServer.getServer().handleUpgrade(request, socket, head, (ws) => {
    WebSocketServer.getServer().emit('connection', ws, request);
  });
});