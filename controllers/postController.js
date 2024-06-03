const postService = require('../services/postService');

async function createPost(req, res) {
    try {
        const post = await postService.createPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
}

async function getPosts(req, res) {
    try {
        const posts = await postService.getPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
}

async function getPostById(req, res) {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
}

async function updatePost(req, res) {
    try {
        const post = await postService.updatePost(req.params.id, req.body);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
}

async function deletePost(req, res) {
    try {
        const post = await postService.deletePost(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
}

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };