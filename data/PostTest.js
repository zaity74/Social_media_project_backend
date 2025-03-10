import { Post } from "../models/Post.js";

const createPostTest = async () => {

    const defaultPost = new Post({
        content: 'Premier post de test',
        image: 'image test.png',
        author: '67cee6fe9b41a26868a74c01'
    });
    await defaultPost.save()
    console.log("Post par défaut crée");
}

export default createPostTest