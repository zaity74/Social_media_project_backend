import { Post, validatePost } from "../models/Post.js";

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
        // Création du post
        const newPost = new Post({
            content: req.body.content,
            image: req.body.image || "",
            author: req.user._id
        });

        await newPost.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la création du post" });
    }
}