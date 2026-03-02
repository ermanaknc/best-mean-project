import { Router } from 'express';
import checkAuth from '../middleware/check-auth.js';
import fileUpload from '../middleware/file.js';
import { getPosts, createPost, getPost, updatePost, deletePost } from '../controllers/posts.js';

const router = Router();

router.get('/', getPosts);
router.post('/', checkAuth, fileUpload.single('image'), createPost);
router.get('/:id', getPost);
router.put('/:id', checkAuth, fileUpload.single('image'), updatePost);
router.delete('/:id', checkAuth, deletePost);

export default router;
