import express from "express";
import {createPost, deletePost, updatePost} from "../Controllers/PostController.js";

const router = express.Router();

router.post("/post", createPost);
router.delete("/post/:id", deletePost);
router.put("/post/:id", updatePost);

/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;