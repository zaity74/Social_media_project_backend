import express from "express";
import {createUser} from "../Controllers/UserController.js";

const router = express.Router();

router.post("/user", createUser);

/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;