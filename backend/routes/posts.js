import { Router } from 'express';
import Post from '../models/post.js';

const router = Router();

router.get('/', async (req, res) => {
  const posts = await Post.find();
  res.json({ message: 'Posts fetched successfully', posts });
});

router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  const savedPost = await post.save();
  console.log(savedPost);
  res.status(201).json({ message: 'Post added successfully', post: savedPost });
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json({ post });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

router.put('/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  res.json({ message: 'Post updated successfully', post });
});

router.delete('/:id', async (req, res) => {
  await Post.deleteOne({ _id: req.params.id });
  res.json({ message: 'Post deleted' });
});

export default router;
