import { Post, validatePost } from "../models/Post.js";
import mongoose from "mongoose";
import { createNotification } from "../utils/createNotification.js";
import { Hashtag } from "../models/hashtag.js";

// validatePost validateUpdatePost
/**
Controller pour récupérer la liste de tous les posts (tweets).
Cette fonction interroge la base de données pour obtenir tous les posts
et renvoie la liste en réponse.*/

export const getPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).send(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

export const getPostByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params;

    if (!hashtag.startsWith("#")) {
      return res.status(400).json({ error: "Le hashtag doit commencer par #" });
    }

    const posts = await Post.find({ hashtags: hashtag }).populate(
      "author",
      "username"
    );

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun post trouvé avec ce hashtag" });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur lors de la récupération des posts par hashtag:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des posts" });
  }
};

export const getCountPostByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID d'utilisateur invalide" });
    }
    const postCount = await Post.countDocuments({ author: userId });
    res.status(200).json({ count: postCount });
  } catch (error) {
    console.error("Error getting post count:", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};
export const getPostByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID d'utilisateur invalide" });
    }
    const posts = await Post.find({ author: userId });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error getting post count:", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

export const createPost = async (req, res) => {
  try {
    console.log("📥 Données reçues du frontend :", req.body); // LOG

    const { error } = validatePost(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { content, image, author, referencedPost, hashtags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({ error: "ID d'auteur invalide" });
    }

    let validReferencedPost = null;
    if (referencedPost && mongoose.Types.ObjectId.isValid(referencedPost)) {
      validReferencedPost = referencedPost;
    }

    // ✅ Correction : Support des hashtags séparés par virgules OU espaces
    let formattedHashtags = [];
    if (typeof hashtags === "string") {
      formattedHashtags = hashtags
        .split(/[\s,]+/) // Séparer par espace ou virgule
        .map((tag) => tag.trim()) // Nettoyer les espaces
        .filter((tag) => tag.startsWith("#") && tag.length > 1); // Garder uniquement les hashtags valides
    } else if (Array.isArray(hashtags)) {
      formattedHashtags = hashtags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.startsWith("#") && tag.length > 1);
    }

    console.log("🛠 Hashtags après formatage :", formattedHashtags); // ✅ Vérification

    const newPost = new Post({
      content,
      image: image || "",
      author,
      referencedPost: validReferencedPost,
      hashtags: formattedHashtags, // ✅ Hashtags au bon format
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Erreur lors de la création du post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post/Tweet non trouvé" });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de la sauvegarde" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { error, value } = validateUpdatePost(req.body);

    if (error !== undefined) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        content: req.body.content,
        image: req.body.image || "",
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la maj",
    });
  }
};

export const addLikeToPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.body.userId;

        if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "ID invalide" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post non trouvé" });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ error: "Vous avez déjà aimé ce post" });
        }

        post.likes.push(userId);
        await post.save();

        // ✅ Créer la notification correctement
        if (userId !== String(post.author)) {
            await createNotification({
                user: userId,
                receiver: post.author,
                type: "like",
                content: "Vous avez un nouveau like sur votre publication.",
                targetId: post._id,
                targetModel: "Post"
            });
        }

        res.status(200).json(post);
    } catch (err) {
        console.error("Error adding like to post:", err);
        res.status(500).json({ error: "Erreur lors de l'ajout du like au post" });
    }
};

export const removeLikeToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;

    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé" });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ error: "Vous n'aimez déjà pas ce post" });
    }

    post.likes.remove(userId);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error("Error adding like to post:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout du like au post" });
  }
};
