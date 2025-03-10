import mongoose from "mongoose";
import Joi from "joi";

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    country: String,
    inscriptionDate: String,


});

const User = mongoose.model("User", userSchema);

/**
 * Schema de validation pour le produit
 */
const userValidation = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": " est obligatoire",
    }),
    password: Joi.string().required().messages({
        "string.empty": "La description est obligatoire",
    }),
    email: Joi.string().required().messages({
        "string.empty": "La description est obligatoire",
    }),
    country: Joi.string().optional().allow(null, ""),
    inscriptionDate: Joi.string().required().messages({
        "string.empty": "La description est obligatoire",
    }),
});

export { User, userValidation };
export default User;

