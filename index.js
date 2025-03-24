import express from "express";
import http from "http"; 
import dotenv from "dotenv";
import dataBaseConnect from "./database/DatabaseConnect.js";
import routes from "./routing/Routing.js";
import cors from "cors";
import { Server } from "socket.io";

// Charger les variables d'environnement
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env.local";
dotenv.config({ path: envFile });

// Vérifiez les variables d'environnement (si elles sont correctement chargées)
console.log("DB Connection String:", process.env.DB); // Correctement accédé ici

// Création du serveur Express et Socket.IO
const app = express();
const server = http.createServer(app);

dataBaseConnect();
//createUserTest();
//createPostTest();

// Initialisation Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",    // Frontend local
        "https://socialmedy.netlify.app"  // Ajouter l'origine socialmedy
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);  // Permettre les requêtes des origines autorisées
      }
      callback(null, true);  // Accepter toutes les autres origines en production
    },
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
    io.to(receiverId).emit("receiveMessage", data); // ➤ Envoi à la room du receveur
  });

  socket.on("disconnect", () => {
    console.log("🔴 Un utilisateur s'est déconnecté :", socket.id);
  });
});

const port = process.env.PORT;
const ip = "0.0.0.0";
console.log(port); // Assurez-vous que l'IP est "0.0.0.0" pour les environnements cloud

// Configuration des middlewares
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",    // Frontend local
      "https://socialmedy.netlify.app"  // Ajouter l'origine socialmedy
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);  // Permettre les requêtes des origines autorisées
    }
    callback(null, true);  // Accepter toutes les autres origines en production
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization"
}));

app.use(routes);

// Démarrer le serveur
server.listen(port, ip, () => {
  console.log(`🚀 Le serveur est à l'écoute sur ${ip}:${port}`);
});
