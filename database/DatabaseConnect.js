import mongoose from "mongoose";
import dotenv from "dotenv";


const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env.local";
dotenv.config({ path: envFile });


/**
 * Fonction permettant la connection à notre base de donnée
 */
const dataBaseConnect = async () => {
    try {
        console.log(process.env.DB);
        await mongoose.connect(process.env.DB);
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Problème lors de la connection ', error);
        process.exit(1);
    }
}

export default dataBaseConnect