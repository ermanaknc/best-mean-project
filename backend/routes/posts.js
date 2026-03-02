import { Router } from 'express';
import multer from 'multer';
import Post from '../models/post.js';
import checkAuth from '../middleware/check-auth.js';

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error('Invalid MIME type');
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

const router = Router();

router.get('/', async (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;

  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  const [posts, totalPosts] = await Promise.all([
    postQuery,
    Post.countDocuments(),
  ]);

  res.json({ message: 'Posts fetched successfully', posts, totalPosts });
});

router.post('/', checkAuth, multer({ storage }).single('image'), async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId,
  });
  const savedPost = await post.save();
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

router.put('/:id', checkAuth, multer({ storage }).single('image'), async (req, res) => {
  const existingPost = await Post.findById(req.params.id);
  if (!existingPost) {
    return res.status(404).json({ message: 'Post not found' });
  }
  if (existingPost.creator.toString() !== req.userData.userId) {
    return res.status(403).json({ message: 'Not authorized to edit this post' });
  }

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content, imagePath },
    { new: true }
  );
  res.json({ message: 'Post updated successfully', post });
});

router.delete('/:id', checkAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  if (post.creator.toString() !== req.userData.userId) {
    return res.status(403).json({ message: 'Not authorized to delete this post' });
  }
  await Post.deleteOne({ _id: req.params.id });
  res.json({ message: 'Post deleted' });
});

export default router;
