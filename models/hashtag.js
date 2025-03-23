import mongoose from "mongoose";

const hashtagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }
});

const Hashtag = mongoose.model("Hashtag", hashtagSchema);
export { Hashtag };
