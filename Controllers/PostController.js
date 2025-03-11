import { Post, validatePost, validateUpdatePost } from "../models/Post.js";
import {User, validateUser} from "../models/User.js";
import mongoose from "mongoose";

/**
 
Controller pour récupérer la liste de tous les posts (tweets).
Cette fonction interroge la base de données pour obtenir tous les posts
et renvoie la liste en réponse.*/

export const getPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).send(post); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Une erreur est survenue" });
    }
};

export const createPost = async (req, res) => {
    try {
        const { error } = validatePost(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { content, image, author } = req.body;

        if (!mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({ error: "ID d'auteur invalide" });
        }
        const newPost = new Post({
            content,
            image: image || "",
            author,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ error: "Erreur lors de la création du post" });
    }
};


export const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        if(!deletedPost){
            return res.status(404).json({ message: "Post/Tweet non trouvé" });
        }

        res.status(204).end()
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Une erreur est survenue lors de la sauvegarde"})
    }
}

export const updatePost = async (req, res) => {
    try {

        const { error, value } = validateUpdatePost(req.body);

        if (error !== undefined) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                "content": req.body.content,
                "image": req.body.image || ""
            },
            { new : true });

        if (!updatedPost) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la maj",
        });
    }
};

export const addLikeToPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId;

        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "ID invalide" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post non trouvé" });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ error: "Vous avez déjà aimé ce post" });
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).json(post);
    } catch (err) {
        console.error("Error adding like to post:", err);
        res.status(500).json({ error: "Erreur lors de l'ajout du like au post" });
    }
};
