import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET || 'secretkey123',
    { expiresIn: '7d' }
  );
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = createToken(user);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }, token });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }, token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/profile', auth, async (req, res) => {
  res.json(req.user);
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (avatar) updates.avatar = avatar;
    if (password) updates.password = password;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, updates);
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed' });
  }
});

router.delete('/profile', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Account deletion failed' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load users' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load user' });
  }
});

export default router;
