import express from "express";
import dotenv from "dotenv";
import dataBaseConnect from "./database/DatabaseConnect.js";

const app = express();

dotenv.config();
dataBaseConnect()

const port = process.env.PORT;
console.log(port);
app.use(express.json());

// app.use(routes);

app.listen(port, () =>
    console.log(`Le serveur est a l'écoute sur le port ${port}`)
);