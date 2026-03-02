import Post from '../models/post.js';

export const getPosts = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: 'Fetching posts failed. Please try again later.' });
  }
};

export const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required.' });
    }

    const url = `${req.protocol}://${req.get('host')}`;
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,
      creator: req.userData.userId,
    });
    const savedPost = await post.save();
    res.status(201).json({ message: 'Post added successfully', post: savedPost });
  } catch (err) {
    res.status(500).json({ message: 'Creating post failed. Please try again later.' });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: 'Fetching post failed. Please try again later.' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    if (existingPost.creator.toString() !== req.userData.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this post.' });
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
  } catch (err) {
    res.status(500).json({ message: 'Updating post failed. Please try again later.' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    if (post.creator.toString() !== req.userData.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Deleting post failed. Please try again later.' });
  }
};
