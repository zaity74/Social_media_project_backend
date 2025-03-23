import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { User } from "../models/User.js";
import mongoose from "mongoose";

export const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Récupérer toutes les conversations
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    }).sort({ updatedAt: -1 });

    // 2. Enrichir chaque conversation avec les infos de l'autre utilisateur
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.members.find((id) => id.toString() !== userId);
        const user = await User.findById(otherUserId).select("username avatar");
        return {
          ...conv._doc,
          participant: user,
        };
      })
    );

    res.status(200).json(enrichedConversations);
  } catch (err) {
    console.error("Erreur getConversations:", err);
    res.status(500).json({ error: "Erreur récupération conversations" });
  }
};

export const sendMessage = async (req, res) => {
    try {
      const { conversationId, sender, text, author } = req.body;

      // Validation native de Mongoose
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return res.status(400).json({ error: "conversationId is not valid" });
      }
      if (!mongoose.Types.ObjectId.isValid(sender)) {
        return res.status(400).json({ error: "sender is not valid" });
      }
      if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({ error: "author is not valid" });
      }
  
      const message = new Message({
        conversationId,
        sender,
        author,
        text,
      });
  
      const savedMessage = await message.save();
  
      console.log('Message envoyé', savedMessage);
  
      // Mettre à jour la date de la conversation
      await Conversation.findByIdAndUpdate(conversationId, {
        updatedAt: new Date(),
      });
  
      res.status(201).json(savedMessage);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
};

  
  

export const getMessages = async (req, res) => {
    try {
      const messages = await Message.find({ conversationId: req.params.id })
        .populate("sender", "username avatar"); // <-- ici
  
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: "Erreur récupération messages" });
    }
  };
  

// Crée une nouvelle conversation entre deux utilisateurs
export const createConversation = async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
  
      // Vérifier si une conversation existe déjà entre les deux
      const existingConversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });
  
      if (existingConversation) {
        return res.status(200).json(existingConversation);
      }
  
      // Sinon, créer une nouvelle conversation
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
  
      const savedConversation = await newConversation.save();
      res.status(201).json(savedConversation);
    } catch (err) {
      console.error("Erreur création conversation :", err);
      res.status(500).json({ error: "Erreur lors de la création de la conversation" });
    }
  };

export const deleteConversation = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await Conversation.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ message: "Conversation non trouvée" });
      }
  
      res.status(200).json({ message: "Conversation supprimée avec succès" });
    } catch (err) {
      console.error("Erreur suppression conversation :", err);
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  };
  