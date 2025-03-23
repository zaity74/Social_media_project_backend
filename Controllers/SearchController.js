import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export const searchPost = async (req, res) => {
  try {
    const { q, user } = req.query;
    const filter = {};

    // Recherche par username
    if (user && user !== "undefined") {
      const trimmedUsername = user.trim().replace("@", "");
      const foundUser = await User.findOne({ username: trimmedUsername });
      console.log("user trouvé :", foundUser);

      if (!foundUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      filter.author = foundUser._id;
    }

    // Recherche par hashtag
    if (q && q.startsWith("#")) {
      filter.hashtags = q;
    }

    // Recherche par contenu (seulement si ce n’est PAS un hashtag)
    else if (q && q !== "undefined") {
      filter.content = { $regex: q, $options: "i" };
    }

    const posts = await Post.find(filter).populate("author", "username avatar");
    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur recherche post :", err);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
};

