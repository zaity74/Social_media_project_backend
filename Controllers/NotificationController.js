import mongoose from "mongoose";
import {Notification} from "../models/Notification.js"
import { Post } from "../models/Post.js"; // Importer le modèle Post pour vérifier les posts

export const getNotificationsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "ID d'utilisateur invalide" });
        }

        const notifications = await Notification.find({ receiver: userId })
            .populate("user", "username avatar") // utilisateur qui a liké/commenté/suivi
            .populate({
                path: "targetId",
                select: "content image username avatar", // selon que c’est un Post ou un User
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
        res.status(500).json({ message: "Une erreur est survenue" });
    }
};


export const clearNotifsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "ID invalide" });
        }

        // ✅ Supprime les notifications reçues par l'utilisateur
        await Notification.deleteMany({ receiver: userId });
        await Notification.updateMany({ receiver: userId }, { isRead: true });

        res.status(204).end();
    } catch (error) {
        console.error("Erreur lors de la suppression des notifications :", error);
        res.status(500).json({ message: "Une erreur est survenue" });
    }
};


export const getUnreadNotificationCount = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "ID d'utilisateur invalide" });
      }
  
      const count = await Notification.countDocuments({
        receiver: userId,
        isRead: false
      });
  
      res.status(200).json({ unreadCount: count });
    } catch (error) {
      console.error("Erreur lors du comptage des notifications non lues :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };