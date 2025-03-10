import express from "express";
import {createUser, updateUser} from "../Controllers/UserController.js";

const router = express.Router();

router.post("/user", createUser);
router.put("/user/:id", updateUser);

/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;