import express from "express";
import {createUser, deleteUser, updateUser} from "../Controllers/UserController.js"
import { register, login } from "../Controllers/authController.js";
import {createPost, deletePost, getPosts, updatePost} from "../Controllers/PostController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.get("/post", getPosts);
router.post("/post", createPost);
router.delete("/post/:id", deletePost);
router.put("/post/:id", updatePost);


/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;