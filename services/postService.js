const Post = require('../models/post');

async function createPost(data) {
    const post = new Post(data);
    return await post.save();
}

async function getPosts() {
    return await Post.find().populate('author');
}

async function getPostById(id) {
    return await Post.findById(id).populate('author');
}

async function updatePost(id, data) {
    return await Post.findByIdAndUpdate(id, data, { new: true });
}

async function deletePost(id) {
    return await Post.findByIdAndDelete(id);
}

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };