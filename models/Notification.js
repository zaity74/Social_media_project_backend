import mongoose from "mongoose";
import Joi from "joi";
import { ObjectId } from "bson";

const notificationSchema = new mongoose.Schema(
    {
        content: { type: String, required: true, maxlength: 280 },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: {
            type: String,
            enum: ["like", "comment", "repost", "follow"],
            required: true
        },
        targetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    },
    { timestamps: true }
);

// Validation function
function validateNotification(notification) {
    const schema = Joi.object({
        content: Joi.string().max(280).allow("").optional(),
        user: Joi.string().custom((value, helpers) => {
            if (ObjectId.isValid(value)) {
                return value;
            }
            return helpers.error("any.invalid");
        }).required(),
        type: Joi.string().valid("like", "comment", "repost", "follow").required(),
        targetId: Joi.string().custom((value, helpers) => {
            if (ObjectId.isValid(value)) {
                return value;
            }
            return helpers.error("any.invalid");
        }).required()
    });

    return schema.validate(notification);
}

const Notification = mongoose.model("Notification", notificationSchema);
export { Notification, validateNotification };
