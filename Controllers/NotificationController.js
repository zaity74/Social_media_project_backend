import mongoose from "mongoose";
import {Notification} from "../models/Notification.js"

export const getNotificationsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({error: "ID d'utilisateur invalide"});
        }
        console.log(userId);
        const notifs = await Notification.find({user: userId});
        res.status(200).json({notifs});
    } catch (error) {
        console.error("Error getting post count:", error);
        res.status(500).json({ message: "Une erreur est survenue" });
    }
};

export const clearNotifsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            await Notification.deleteMany({ user: userId });
        }

        res.status(204).end()
    } catch (error) {
        console.error("Error getting post count:", error);
        res.status(500).json({ message: "Une erreur est survenue" });
    }
};