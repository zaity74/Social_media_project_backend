import {User, validateUser} from "../models/User.js";
import { Post } from "../models/Post.js";
import FormData from "form-data";
import axios from "axios";
import https from "https";
import fs from "fs";
import mongoose from "mongoose";

export const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).send(user); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Une erreur est survenue" });
    }
}

export const createUser = async (req, res) => {
    try {

        const { error, value } = validateUser(req.body);

        if (error !== undefined) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newUser = new User(req.body);

        const confirmation = await newUser.save();
        res.status(201).json(confirmation);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la sauvegarde",
        });
    }
};

export const updateUser = async (req, res) => {
    try {

        const { error, value } = validateUser(req.body);

        if (error !== undefined) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                "username": req.body.username,
                "email": req.body.email,
                "password": req.body.password,
                "bio": req.body.bio,
                "avatar": req.body.avatar,
            },
            { new : true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la maj",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {

        const deletedUser = await User.findById(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User non trouvé" });
        }

        await deletedUser.deleteOne();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression",
        });
    }
};

export const getPrediction = async (req, res) => {
    console.log("Start prediction...");

    // Vérification des fichiers reçus
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Récupérer l'ID du post si fourni
    const postId = req.body.postId || "Aucun postId fourni";
  
    try {
      const formData = new FormData();
  
      // Ajouter chaque image au FormData
      req.files.forEach((file, index) => {
        formData.append(`image_${index}`, file.buffer, file.originalname);
      });
  
      console.log(`Images envoyées : ${req.files.map(f => f.originalname).join(", ")}`);
      console.log(`Post ID concerné : ${postId}`);
  
      // Agent HTTPS avec certificats
      const httpsAgent = new https.Agent({
        cert: fs.readFileSync("certs/client.crt"),
        key: fs.readFileSync("certs/client.key"),
        ca: fs.readFileSync("certs/ca.crt"),
        rejectUnauthorized: true,
      });
  
      // Envoi des images à l'API IA
      const response = await axios.post("https://127.0.0.1:5000/predict", formData, {
        headers: formData.getHeaders(),
        httpsAgent: httpsAgent,
      });
  
      console.log("Prediction ended: ", response.data);
      res.json(response.data);
  
    } catch (error) {
      console.error("Error calling the IA API:", error.message);
      res.status(500).json({ error: error.message });
    }
  };

export const followUser = async (req, res) => {
    try {
        const userToAdd = req.params.id;
        const follower = req.body.userId;

        if (!mongoose.Types.ObjectId.isValid(userToAdd) || !mongoose.Types.ObjectId.isValid(follower)) {
            return res.status(400).json({ error: "ID invalide" });
        }

        const user = await User.findById(userToAdd);
        if (!user) {
            return res.status(404).json({ error: "User non trouvé" });
        }

        if (user.followers.includes(follower) || follower === user._id.toString()) {
            return res.status(400).json({ error: "Vous suivez déjà cet utilisateur" });
        }

        user.followers.push(follower);
        await user.save();

        await addFollowingToUser(follower, userToAdd);
        res.status(200).json(user);
    } catch (err) {
        console.error("Error following user:", err);
        res.status(500).json({ error: "Erreur lors du suivi de l'utilisateur" });
    }
};

const addFollowingToUser = async (id, followedUser) => {
    try {
        const user = await User.findById(id);
        if (!user) return;

        if (!user.following.includes(followedUser)) {
            user.following.push(followedUser);
            await user.save();
        }
    } catch (error) {
        console.error("Error adding following:", error);
    }
};
export const unFollowUser = async (req, res) => {
    try {
        const userConcerned = req.params.id;
        const unFollower = req.body.userId;

        console.log(userConcerned);
        console.log(unFollower);
        console.log(!mongoose.Types.ObjectId.isValid(userConcerned));
        console.log(!mongoose.Types.ObjectId.isValid(unFollower));
        if (!mongoose.Types.ObjectId.isValid(userConcerned) || !mongoose.Types.ObjectId.isValid(unFollower)) {
            return res.status(400).json({ error: "ID invalide" });
        }

        const user = await User.findById(userConcerned);
        if (!user) {
            return res.status(404).json({ error: "User non trouvé" });
        }

        if (!user.followers.includes(unFollower) || unFollower === user._id.toString()) {
            return res.status(400).json({ error: "Vous ne suivez déjà pas cet utilisateur" });
        }

        user.followers.remove(unFollower);
        await user.save();

        await unFollowingUser(unFollower, userConcerned);
        res.status(200).json(user);
    } catch (err) {
        console.error("Error following user:", err);
        res.status(500).json({ error: "Erreur lors du suivi de l'utilisateur" });
    }
};

const unFollowingUser = async (id, followedUser) => {
    try {
        const user = await User.findById(id);
        if (!user) return;

        if (user.following.includes(followedUser)) {
            user.following.remove(followedUser);
            await user.save();
        }
    } catch (error) {
        console.error("Error adding following:", error);
    }
};

export const getUserLikedPosts = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "ID user invalide" });
        }

        const likedPosts = await Post.find({ likes: userId }).populate("author", "username");

        res.status(200).json(likedPosts);
    } catch (error) {
        console.error("Erreur lors de la récupération des posts likés :", error);
        res.status(500).json({ message: "Une erreur est survenue" });
    }
};

export const getUserFollowers = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "ID user invalide" });
        }

        const user = await User.findById(userId).populate("followers", "username");

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(user.followers);
    } catch (error) {
        console.error("Erreur lors de la récupération des followers :", error);
        res.status(500).json({ message: "Une erreur est survenue" });
    }
};
