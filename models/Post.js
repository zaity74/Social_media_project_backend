import mongoose from "mongoose";
import Joi from "joi";
import { ObjectId } from "bson";

const postSchema = new mongoose.Schema({
    content: { type: String, required: true, maxlength: 280 },
    image: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    referencedPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    hashtags: [{ type: String, trim: true }],  
}, { timestamps: true });

// Joi validation
function validatePost(post) {
    const schema = Joi.object({
        content: Joi.string().max(280).allow("").optional(),
        author: Joi.string().custom((value, helpers) => {
            if (ObjectId.isValid(value)) {
                return value;
            }
            return helpers.error('any.invalid');
        }).required(),
        image: Joi.string().optional(),
        referencedPost: Joi.string()
            .custom((value, helpers) => {
                if (!value || ObjectId.isValid(value)) {
                    return value;
                }
                return helpers.error('any.invalid');
            })
            .allow("", null)
            .optional(),
        hashtags: Joi.string().allow("").optional(),  // ✅ Accepte une chaîne simple
    });

    return schema.validate(post);
}

const Post = mongoose.model("Post", postSchema);
export { Post, validatePost };
