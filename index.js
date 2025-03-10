import express from "express";
import dotenv from "dotenv";

const app = express();

const port = process.env.PORT;
console.log(port);
app.use(express.json());

// app.use(routes);

app.listen(8081, () =>
    console.log(`Le serveur est a l'écoute sur le port ${8081}`)
);