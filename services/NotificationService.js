import { Notification } from "../models/Notification.js";

const LIKE_MESSAGE = "Vous avez un nouveau like sur votre publication.";
const FOLLOW_MESSAGE = "Un utilisateur s'est abonné à vous.";
const COMMENT_MESSAGE = "Un nouveau commentaire est disponible sous votre publication.";
const REPOST_MESSAGE = "Un utilisateur a reposté votre publication.";

/**
 * Create a new notification
 * @param {string} userId - The user ID who will receive the notification
 * @param {string} content - The content of the notification
 * @param {string} type - The type of the notification (like, comment, repost, follow)
 * @param {string} targetId - The related post/user ID
 * @returns {Promise<Object>} - The created notification
 */
export const createNotification = async (userId, type, targetId) => {
    try {

        const content = await getContentByType(type);
        const notification = new Notification({
            user: userId,
            content,
            type,
            targetId
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw new Error("Unable to create notification");
    }
};

const getContentByType = async (type) => {
    switch (type) {
        case "like":
            return LIKE_MESSAGE;
            break;
        case "comment":
            return COMMENT_MESSAGE;
            break;
        case "repost":
            return REPOST_MESSAGE;
            break;
        case "follow":
            return FOLLOW_MESSAGE;
            break;
        default:
            break
    }
}
