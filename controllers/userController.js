//!require models 
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//TODO: Move to .env
const JWT_SECRET = 'your-secret-key'; // Store in environment variable in production


const login = async (req, res) => {
  try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required' });
      }

      // Find user
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
          expiresIn: '1h'
      });

      res.json({ message: 'Login successful', token });
  } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const signup = async (req, res) => {
  try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required' });
      }

      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save user
      const user = new User({ username, password: hashedPassword });
      await user.save();

      // Generate JWT
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
          expiresIn: '1h'
      });

      res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const getUser = async (req, res) => {
 
    const user = await User.find(); // Get all users
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  
};

// CommonJS export
module.exports = {
  login,
  signup,
  getUser
};
