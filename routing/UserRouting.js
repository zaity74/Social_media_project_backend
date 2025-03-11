import express from "express";
import {createUser, deleteUser, updateUser} from "../Controllers/UserController.js"
import { register, login } from "../Controllers/authController.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);


/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;