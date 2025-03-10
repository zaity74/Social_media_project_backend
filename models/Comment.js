const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true, maxlength: 280 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }
}, { timestamps: true });

function validateComment(comment) {
    const schema = Joi.object({
        content: Joi.string().max(280).required(),
    });
    return schema.validate(comment);
}

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment, validateComment };
