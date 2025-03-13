import express from "express";
import dotenv from "dotenv";
import dataBaseConnect from "./database/DatabaseConnect.js";
//import createUserTest from "./data/UserTest.js";
// import createPostTest from "./data/PostTest.js";
import routes from "./routing/Routing.js";
import cors from "cors";

const app = express();
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env.local";
dotenv.config({ path: envFile });

dataBaseConnect()
//createUserTest()
// createPostTest()

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

app.listen(port,ip, () =>
    console.log(`Le serveur est a l'écoute sur ${ip}:${port}`)
);