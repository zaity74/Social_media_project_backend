import express from "express";
import {createUser, deleteUser, followUser, getUsers, unFollowUser,getPrediction ,updateUser} from "../Controllers/UserController.js";
import {register, login} from "../Controllers/AuthController.js";
import {
    addLikeToPost,
    createPost,
    deletePost, getCountPostByUserId, getPostByUserId,
    getPosts,
    removeLikeToPost,
    updatePost
} from "../Controllers/PostController.js";
import {createCommentFromPost, deleteComment, getCommentsByPost} from "../Controllers/CommentController.js";
import { searchPost } from "../Controllers/SearchController.js";
import multer from "multer";
import {getNotificationsByUserId, clearNotifsByUser} from "../Controllers/NotificationController.js";
import { getUserLikedPosts, getUserFollowers } from "../Controllers/UserController.js";
import { getPostByHashtag } from "../Controllers/PostController.js";
//import { getPostsByHashtag } from "../Controllers/PostController.js";


const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(), // Stockage en mémoire (peut être modifié)
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille des fichiers (5MB)
  });

router.post("/register", register);
router.post("/login", login);

router.get("/user", getUsers);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.put("/user/follow/:id", followUser);
router.put("/user/unfollow/:id", unFollowUser);
router.get("/countpost/:userId", getCountPostByUserId);

router.get("/:id/likedPosts", getUserLikedPosts);
router.get("/:id/followers", getUserFollowers);

router.get("/post", getPosts);
router.get("/post/:userId", getPostByUserId);
router.post("/post", createPost);
router.delete("/post/:id", deletePost);
router.put("/post/:id", updatePost);
router.put("/post/like/:id", addLikeToPost);
router.put("/post/unlike/:id", removeLikeToPost);

router.get("/notification/:userId", getNotificationsByUserId);
router.delete("/notification/delete/:userId", clearNotifsByUser);

router.get("/search", searchPost);

router.post("/post/comment", createCommentFromPost);
router.delete("/delete/comment/:id", deleteComment);
router.get("/post/comments/:id",getCommentsByPost);
router.get("/hashtag/:hashtag", getPostByHashtag);

router.post("/", createPost);
//router.get("/hashtag/:tag", getPostsByHashtag);

router.post("/predict", upload.array("images", 10), getPrediction)


/**
 * Le router va nous permettre de faire un lien entre nos URL et nos fonctions ( lien front et back )
 */
export default router;