const jwt = require('jsonwebtoken');
const userSchema = require('../models/userModel');
const bookSchema = require('../models/bookModel');
require('dotenv').config();

// authmiddleware.js (already set up for token verification)
const authmiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Use cookie to extract token
  if (!token) {
    return res.status(404).json({ message: 'You must login to continue' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userSchema.findById(verified.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user; // Attach user data to the request for next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token' });
  }
};



//verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};


//verify ownership
const verifyOwnership = async (req, res, next) => {
  try {
    const bookId = req.params.id; // Get book ID from request parameters
    const book = await bookSchema.findById(bookId); // Find the book

    //console.log('Book:', book);
    //console.log('User:', req.user);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Access req.user._id correctly since the user is wrapped in `id`
    const userId = req.user.id._id || req.user._id;  // Ensure we are comparing ObjectIds correctly

    if (book.authorId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only update or delete your own books' });
    }

    // Attach book to request for further use in controller
    req.book = book;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};






module.exports = { authmiddleware, verifyToken, verifyOwnership };

