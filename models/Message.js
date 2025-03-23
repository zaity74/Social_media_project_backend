import mongoose from "mongoose";
import Conversation from "./Conversation.js";
import Joi from "joi"; // Importation de Joi


const messageSchema = new mongoose.Schema(
    {
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,  // Assurez-vous que 'author' est requis
      },
      text: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );


const Message = mongoose.model("Message", messageSchema);

export default Message;
