import express from "express";
import {createUser, deleteUser, followUser, getUsers, unFollowUser,getPrediction ,updateUser} from "../Controllers/UserController.js"
import { register, login } from "../Controllers/authController.js";
import {
    addLikeToPost,
    createPost,
    deletePost,
    getPosts,
    removeLikeToPost,
    updatePost
} from "../Controllers/PostController.js";
import {createCommentFromPost, deleteComment} from "../Controllers/CommentController.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/register", register);
router.post("/login", login);

router.get("/user", getUsers);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.put("/user/follow/:id", followUser);
router.put("/user/unfollow/:id", unFollowUser);

router.get("/post", getPosts);
router.post("/post", createPost);
router.delete("/post/:id", deletePost);
router.put("/post/:id", updatePost);
router.put("/post/like/:id", addLikeToPost);
router.put("/post/unlike/:id", removeLikeToPost);

router.post("/post/comment", createCommentFromPost);
router.delete("/delete/comment/:id", deleteComment);

router.post("/predict", upload.single('image'), getPrediction)


/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;