import express from "express";
import http from "http"; // ✅ À ajouter
import dotenv from "dotenv";
import dataBaseConnect from "./database/DatabaseConnect.js";
import routes from "./routing/Routing.js";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env.local";
dotenv.config({ path: envFile });
const server = http.createServer(app);


dataBaseConnect()
//createUserTest()
// createPostTest()

// 🔌 Initialisation Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // autoriser ton frontend React
    methods: ["GET", "POST"]
  }
});

// 👥 Gestion des connexions Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 Un utilisateur est connecté :", socket.id);

  socket.on("join", (userId) => {
    console.log("📥 User connecté :", userId);
    socket.join(userId); // Chaque user rejoint sa "room" privée
  });

  socket.on("sendMessage", (data) => {
    const { receiverId, text } = data;
    io.to(receiverId).emit("receiveMessage", data); // ➤ envoi à la room du receveur
  });

  socket.on("disconnect", () => {
    console.log("🔴 Un utilisateur s'est déconnecté :", socket.id);
  });
});

const port = process.env.PORT;
const ip = process.env.IP;
console.log(port);
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true); // Permettre les requêtes sans origine (ex: requêtes du même domaine)
      }
      callback(null, origin); // Autoriser dynamiquement l'origine
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  }));

app.use(routes);

server.listen(port, ip, () => {
  console.log(`🚀 Le serveur est à l'écoute sur ${ip}:${port}`);
});