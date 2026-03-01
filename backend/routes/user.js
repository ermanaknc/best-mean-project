import { Router } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    const result = await user.save();

    res.status(201).json({
      message: 'User created',
      result: result
    });

  } catch (err) {
    res.status(500).json({
      message: 'Creating user failed!',
      error: err.message
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Auth failed' });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      'secret_this_should_be_longer',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, expiresIn: 3600 });

  } catch (err) {
    res.status(500).json({
      message: 'Login failed!',
      error: err.message
    });
  }
});

export default router;
