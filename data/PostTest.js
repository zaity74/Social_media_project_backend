import { Post } from "../models/Post.js";
import mongoose from "mongoose";

const createPostTest = async () => {
    try {
        const existingPost = await Post.findById("67cffbf7a2bc3b8d06d0bb81")
        if(!existingPost) {
            const defaultPost = new Post({
                _id: new mongoose.Types.ObjectId("67cffbf7a2bc3b8d06d0bb81"), // ID fixe pour éviter les doublons
                content: "Je fais un test. Premier post de test",
                image: "image_test_satya.png",
                author: "Satya" // Doit être un ID d'utilisateur valide en base
            });
            await defaultPost.save()
            console.log("Post par défaut crée");
        }
        else {
            console.log('Post déjà existant');
        }
    } catch (err) {
        console.error('Erreur lors de la création du Post:', err);
    }
};

export default createPostTest