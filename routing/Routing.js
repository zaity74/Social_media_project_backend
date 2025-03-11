import express from "express";
import {createUser, deleteUser, getUsers, updateUser} from "../Controllers/UserController.js"
import { register, login } from "../Controllers/authController.js";
import {
    addLikeToPost,
    createPost,
    deletePost,
    getPosts,
    removeLikeToPost,
    updatePost
} from "../Controllers/PostController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/user", getUsers);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.get("/post", getPosts);
router.post("/post", createPost);
router.delete("/post/:id", deletePost);
router.put("/post/:id", updatePost);
router.put("/post/like/:id", addLikeToPost);
router.put("/post/unlike/:id", removeLikeToPost);


/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;