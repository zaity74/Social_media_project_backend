import { User } from "../models/User.js";

const createUserTest = async () => {
    try {
        const existingUser = await User.findOne({ email: 'default@user.com' });
        if (!existingUser) {
            const defaultUser = new User({
                username: 'user_test',
                email: 'default@user.com',
                password: 'password',
                bio: 'bio de test',
                avatar: 'default-avatar.png',
                inscriptionDate: '10/23/2024'
            });
            await defaultUser.save();
            console.log('User par défaut créé');
        } else {
            console.log('User déjà existant');
        }
    } catch (err) {
        console.error('Erreur lors de la création du user:', err);
    }
};

export default createUserTest