import "dotenv/config";
import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

const mongoURI = process.env.MONGO_URI || "";
if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGO_URI not provided. Skipping DB connection.");
}

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express" });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`BACK: Server listening on port ${PORT}`);
});
