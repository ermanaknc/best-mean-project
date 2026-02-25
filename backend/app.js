import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import postsRoutes from './routes/posts.js';

const app = express();

mongoose.connect("mongodb+srv://ermanaknc:E_e553924385@cluster0.devraqy.mongodb.net/mean-project?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log('MongoDB connection failed:', err);
  });

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/images', express.static(path.join('backend', 'images')));
app.use('/api/posts', postsRoutes);

export default app;
