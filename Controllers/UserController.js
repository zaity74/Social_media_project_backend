import {User, validateUser} from "../models/User.js";
import FormData from "form-data";
import axios from "axios";
import https from "https";
import fs from "fs";

export const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).send(user); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Une erreur est survenue" });
    }
}

export const createUser = async (req, res) => {
    try {

        const { error, value } = validateUser(req.body);

        if (error !== undefined) {
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

        if (error !== undefined) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                "username": req.body.username,
                "email": req.body.email,
                "password": req.body.password,
                "bio": req.body.bio,
                "avatar": req.body.avatar,
            },
            { new : true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la maj",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {

        const deletedUser = await User.findById(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User non trouvé" });
        }

        await deletedUser.deleteOne();
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression",
        });
    }
};

export const getPrediction = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }
  
    try {
      const formData = new FormData();
      formData.append('image', req.file.buffer, req.file.originalname);
  
      const httpsAgent = new https.Agent({
        cert: fs.readFileSync('certs/client.crt'),
        key: fs.readFileSync('certs/client.key'),
        ca: fs.readFileSync('certs/ca.crt'),
        rejectUnauthorized: true
      });
  
      const response = await axios.post('https://127.0.0.1:5000/predict', formData, {
        headers: formData.getHeaders(),
        httpsAgent: httpsAgent
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error calling the IA API:', error);
      res.status(500).json({ error: error.message });
    }
  }
