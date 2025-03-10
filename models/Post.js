import mongoose from "mongoose";
import Joi from "joi";
const postSchema = new mongoose.Schema({
    content: { type: String, required: true, maxlength: 280 },
    image: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });

// Joi validation
function validatePost(post) {
    const schema = Joi.object({
        content: Joi.string().max(280).required(),
        image: Joi.string().optional(),
    });
    return schema.validate(post);
}

const Post = mongoose.model("Post", postSchema);
export { Post, validatePost };
