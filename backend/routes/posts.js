import { Router } from 'express';
import multer from 'multer';
import Post from '../models/post.js';

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
  const posts = await Post.find();
  res.json({ message: 'Posts fetched successfully', posts });
});

router.post('/', multer({ storage }).single('image'), async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
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

router.put('/:id', multer({ storage }).single('image'), async (req, res) => {
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

router.delete('/:id', async (req, res) => {
  await Post.deleteOne({ _id: req.params.id });
  res.json({ message: 'Post deleted' });
});

export default router;
