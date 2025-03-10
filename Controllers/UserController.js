import {User, validateUser} from "../models/User.js";

export const createUser = async (req, res) => {
    try {

        const { error, value } = validateUser(req.body);

        if (error != undefined) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newUser = new User(req.body);

        // if (req.body.image && newUser) {
        //     newUser.images = [req.body.image];
        // }

        const confirmation = await newUser.save();
        res.status(201).json(confirmation);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la sauvegarde",
        });
    }
};
export const updateUser = async (req, res) => {
    try {

        const { error, value } = validateUser(req.body);

        if (error != undefined) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newUser = new User(req.body);

        // if (req.body.image && newUser) {
        //     newUser.images = [req.body.image];
        // }

        const confirmation = await newUser.save();
        res.status(201).json(confirmation);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la sauvegarde",
        });
    }
};
