import {User, validateUser } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Inscription
export const register = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ error: "Email déjà utilisé" });

        user = await User.findOne({ username: req.body.username });
        if (user) return res.status(400).json({ error: "Username déjà utilisé" });

        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        await user.save();
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// connexion
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Email ou mot de passe incorrect" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Email ou mot de passe incorrect" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};
