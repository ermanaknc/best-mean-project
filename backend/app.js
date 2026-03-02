import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import postsRoutes from './routes/posts.js';
import usersRoutes from './routes/user.js';

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/images', express.static(path.join('backend', 'images')));
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

export default app;
