import express from "express";
import dotenv from "dotenv";
import dataBaseConnect from "./database/DatabaseConnect.js";
//import createUserTest from "./data/UserTest.js";
// import createPostTest from "./data/PostTest.js";
import routes from "./routing/UserRouting.js";
import cors from "cors";

const app = express();

dotenv.config();
dataBaseConnect()
//createUserTest()
// createPostTest()

const port = process.env.PORT;
console.log(port);
app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(port, () =>
    console.log(`Le serveur est a l'écoute sur le port ${port}`)
);