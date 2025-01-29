const bookSchema = require('../models/bookModel'); // Import book schema
const jwt = require('jsonwebtoken');
const tokenGenerated = require('../JWT/token');

const postBook = async (req, res) => {
  const { title, yearofpublication, price } = req.body;
  
  if (!title || !yearofpublication || !price) {
    return res.status(400).json({ message: 'Please provide title, year, and price' });
  }
  
  try {
    const newBook = new bookSchema({
      title,
      yearofpublication,
      price,
      author: req.user.username, // Automatically set author to logged-in user's username
      authorId: req.user._id  // This automatically links the book to the logged-in user
    });
    
    await newBook.save();
    res.status(201).json({ message: 'Book posted successfully', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



//UPDATE BOOK
const updateBook = async (req, res) => {
    try {
      const { title, yearofpublication, price } = req.body;
      req.book.title = title || req.book.title;
      req.book.yearofpublication = yearofpublication || req.book.yearofpublication;
      req.book.price = price || req.book.price;

      await req.book.save();
      res.status(200).json({ message: 'Book updated successfully', book: req.book });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


//DELETE BOOK
const deleteBook = async (req, res) => {
  try {
    // Use findByIdAndDelete instead of remove
    await bookSchema.findByIdAndDelete(req.book._id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { postBook, updateBook, deleteBook };