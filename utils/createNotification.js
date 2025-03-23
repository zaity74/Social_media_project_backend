import { Notification} from "../models/Notification.js";

export const createNotification = async ({
    user,
    receiver,
    type,
    content,
    targetId,
    targetModel
}) => {
    try {
        if (!user || !receiver || !type || !targetId || !targetModel) {
            throw new Error("Missing required notification fields");
        }

        await Notification.create({
            user,
            receiver,
            type,
            content,
            targetId,
            targetModel
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        throw new Error("Unable to create notification");
    }
};
