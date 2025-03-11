import { Post, validatePost } from "../models/Post.js";
import {User, validateUser} from "../models/User.js";

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
        const user = await User.findOne({ username: req.body.author });
        if (!user) {
            return res.status(400).json({ error: "Auteur non trouvé" });
        }

        const newPost = new Post({
            content: req.body.content,
            image: req.body.image || "",
            author: user._id,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la création du post" });
    }
}

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
