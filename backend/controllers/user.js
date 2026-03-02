import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    const result = await user.save();

    res.status(201).json({
      message: 'User created successfully.',
      result: result
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(422).json({
        message: 'This email address is already registered. Please use a different email or log in.'
      });
    }
    res.status(500).json({
      message: 'Could not create account. Please try again later.'
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password. Please check your credentials and try again.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password. Please check your credentials and try again.' });
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, expiresIn: 3600, userId: user._id });

  } catch (err) {
    res.status(500).json({
      message: 'Login failed due to a server error. Please try again later.'
    });
  }
};
