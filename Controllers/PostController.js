import { Post, validatePost } from "../models/Post.js";

/**
 
Controller pour récupérer la liste de tous les posts (tweets).
Cette fonction interroge la base de données pour obtenir tous les posts
et renvoie la liste en réponse.*/

export const getPosts = async (req, res) => {
    try {
        // Récupération de tous les produits dans la base de données
        const post = await Post.find();
        res.status(200).send(post); // Envoi des produits au client avec un statut 200 (OK)
    } catch (error) {
        console.error(error); // Affiche l'erreur dans la console
        res.status(500).json({ message: "Une erreur est survenue" }); // Erreur serveur
    }
};