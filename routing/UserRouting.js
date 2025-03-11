import express from "express";
import {createUser, deleteUser, updateUser} from "../Controllers/UserController.js"
import { createPost, deletePost } from "../Controllers/PostController.js";

const router = express.Router();

router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.post("/post", createPost);
router.delete("/post/:id", deletePost);

/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;