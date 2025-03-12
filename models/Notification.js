import mongoose from "mongoose";
import Joi from "joi";
import { ObjectId } from "bson";

const notificationSchema = new mongoose.Schema(
    {
        content: { type: String, required: true, maxlength: 280 },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The user who receives the notification
        type: {
            type: String,
            enum: ["like", "comment", "repost", "follow"],
            required: true
        }, // Type of notification
        targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // The post or user related to the notification
        seen: { type: Boolean, default: false } // If the user has seen the notification
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
        }).required(),
        seen: Joi.boolean().optional()
    });

    return schema.validate(notification);
}

const Notification = mongoose.model("Notification", notificationSchema);
export { Notification, validateNotification };
