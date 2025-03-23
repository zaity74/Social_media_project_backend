import mongoose from "mongoose";
import Joi from "joi";
import {ObjectId} from "bson";
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true, maxlength: 280 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }
}, { timestamps: true });

function validateComment(comment) {
    const schema = Joi.object({
        content: Joi.string().max(280).required(),
        author: Joi.string().custom((value, helpers) => {
            if (ObjectId.isValid(value)) {
                return value;
            } else {
                return helpers.error('any.invalid');
            }
        }).required(),
        post: Joi.string().custom((value, helpers) => {
            console.log(ObjectId.isValid(value))
            if (ObjectId.isValid(value)) {
                return value;
            } else {
                return helpers.error('any.invalid');
            }
        }).required()
    });
    return schema.validate(comment);
}

const Comment = mongoose.model("Comment", commentSchema);
export { Comment, validateComment };
