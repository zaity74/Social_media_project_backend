import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, maxlength: 160 },
    avatar: { type: String, default: "default-avatar.png" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        bio: Joi.string().max(160),
        avatar: Joi.string().empty("default-avatar.png"),
    });
    return schema.validate(user);
}

function validateUserUpdate(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).optional(),
        bio: Joi.string().max(160).optional(),
        avatar: Joi.string().optional(),
    });

    return schema.validate(user);
}

const User = mongoose.model("User", userSchema);
export { User, validateUser, validateUserUpdate };
