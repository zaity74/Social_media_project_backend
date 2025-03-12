import mongoose from "mongoose";
import {Comment, validateComment} from "../models/Comment.js";
import {Post} from "../models/Post.js";

export const createCommentFromPost = async (req, res) => {
    try {
        const { author, content, post: postId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({ error: "ID invalide" });
        }

        const { error } = validateComment({ content, author, post: postId });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post non trouvé" });
        }

        const comment = new Comment({
            author,
            content,
            post: postId
        });
        await comment.save();
        res.status(200).json(comment);
    } catch (err) {
        console.error("Error adding comment to post:", err);
        res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
    }
};
export const deleteComment = async (req, res) => {
    try {

        const deletedComment = await Comment.findById(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        await deletedComment.deleteOne();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression",
        });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "ID invalide" });
        }

        const comments = await Comment.find({ post: postId })
            .populate("author", "username avatar")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (err) {
        console.error("Error adding comment to post:", err);
        res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
    }
};