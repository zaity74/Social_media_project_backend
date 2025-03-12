import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
//import mongoose from "mongoose";

export const searchPost = async (req, res) => {
    try {
        const { q, user } = req.query;
        let filter = {};

        // Recherche de post par mot clé. (/search?q=motclé)
        if (q) {
            filter.content = { $regex: q, $options: "i" }; 
        }

        // Recherche pas user ('/search?user=userName)
        if (user) {
            const foundUser = await User.findOne({ username: user });
            if (foundUser) {
                filter.author = foundUser._id;
            } else {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
        }

        const tweets = await Post.find(filter).populate("author", "username");
        res.json(tweets);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la recherche" });
    }
};
