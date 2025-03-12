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